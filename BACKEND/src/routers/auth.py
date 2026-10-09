import os
from datetime import datetime, timedelta, timezone

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

try:
    from ..database import get_db
    from ..models import UserModel
    from ..schemas import LoginPayload, RegisterPayload
except ImportError:  # pragma: no cover - allows running as a script from src/
    from database import get_db
    from models import UserModel
    from schemas import LoginPayload, RegisterPayload

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

JWT_SECRET = os.getenv("JWT_SECRET", "change-this-secret-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except:
        return False


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "exp": expire}, JWT_SECRET, algorithm=JWT_ALGORITHM
    )


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        raise credentials_exception

    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise credentials_exception
    return user


@router.get("/dashboard/stats")
def get_dashboard_overview(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user),
):
    salon = (
        db.query(UserModel)
        .join(UserModel.salons)
        .filter(UserModel.id == current_user.id)
        .first()
    )
    if not salon:
        raise HTTPException(status_code=404, detail="Salon not found")

    return {
        "salon_id": salon_id,
        "owner_id": current_user.id,
        "status": "ok",
    }


@router.post("/register", status_code=201)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    email = payload.email.lower().strip()
    role = (payload.role or "SALON_OWNER").upper()

    if db.query(UserModel).filter(UserModel.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = UserModel(
        email=email,
        hashed_password=hash_password(payload.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "role": user.role},
    }


@router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    raw_identifier = payload.login_identifier or payload.email
    if not raw_identifier:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Email or username identifier is required.",
        )

    identifier = raw_identifier.strip().lower()
    user = db.query(UserModel).filter(UserModel.email == identifier).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "access_token": create_access_token(user.id),
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "role": user.role},
    }


@router.get("/me")
def get_me(current_user: UserModel = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }


def verify_salon_ownership(
    salon_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if getattr(current_user, "role", None) in ["SUPER_ADMIN", "MANAGER"]:
        return True

    salon = (
        db.query(UserModel)
        .join(UserModel.salons)
        .filter(UserModel.id == current_user.id, UserModel.salons.any(id=salon_id))
        .first()
    )

    if not salon:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have permission to access this salon's data.",
        )
    return True
