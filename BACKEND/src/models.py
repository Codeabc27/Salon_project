import datetime

try:
    from .database import Base
except ImportError:  # pragma: no cover - allows running as a script from src/
    from database import Base
from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship


def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)


class UserModel(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    phone = Column(String(30), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(
        String(30), default="SALON_OWNER"
    )  # SALON_OWNER, CUSTOMER, SUPER_ADMIN, MANAGER, RECEPTIONIST, STAFF
    created_at = Column(DateTime, default=utc_now)

    salons = relationship(
        "SalonModel", back_populates="owner", cascade="all, delete-orphan"
    )


class SalonModel(Base):
    __tablename__ = "salons"
    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String(150), nullable=False)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    address = Column(String(255), nullable=False)
    city = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    phone = Column(String(30), nullable=True)
    whatsapp = Column(String(30), nullable=True)
    image_url = Column(Text, nullable=True)
    logo_url = Column(Text, nullable=True)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    owner = relationship("UserModel", back_populates="salons")
    availability = relationship(
        "SalonAvailabilityModel",
        back_populates="salon",
        uselist=False,
        cascade="all, delete-orphan",
    )
    services = relationship(
        "ServiceModel", back_populates="salon", cascade="all, delete-orphan"
    )
    staff = relationship(
        "StaffModel", back_populates="salon", cascade="all, delete-orphan"
    )
    bookings = relationship(
        "BookingModel", back_populates="salon", cascade="all, delete-orphan"
    )
    customers = relationship(
        "CustomerCRMModel", back_populates="salon", cascade="all, delete-orphan"
    )
    offers = relationship(
        "OfferModel", back_populates="salon", cascade="all, delete-orphan"
    )
    reviews = relationship(
        "ReviewModel", back_populates="salon", cascade="all, delete-orphan"
    )


class SalonAvailabilityModel(Base):
    __tablename__ = "salon_availability"
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(
        Integer,
        ForeignKey("salons.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    opening_time = Column(String(20), default="09:00 AM")
    closing_time = Column(String(20), default="09:00 PM")
    lunch_break_start = Column(String(20), default="01:00 PM")
    lunch_break_end = Column(String(20), default="02:00 PM")
    weekly_off_days = Column(JSON, default=list)  # e.g. ["Sunday"]
    max_simultaneous_bookings = Column(Integer, default=5)
    online_booking_enabled = Column(Boolean, default=True)
    same_day_booking_enabled = Column(Boolean, default=True)
    advance_booking_days_limit = Column(Integer, default=30)
    cancellation_policy = Column(
        Text, default="Free cancellation up to 2 hours before appointment."
    )

    salon = relationship("SalonModel", back_populates="availability")


class ServiceModel(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(
        Integer, ForeignKey("salons.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), default="Hair")  # Hair, Facial, Spa, Nails, Package
    price = Column(Float, nullable=False)
    duration = Column(Integer, default=45)  # minutes
    image_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    salon = relationship("SalonModel", back_populates="services")


class StaffModel(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(
        Integer, ForeignKey("salons.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String(100), nullable=False)
    photo_url = Column(Text, nullable=True)
    role = Column(
        String(100), default="Stylist"
    )  # Senior Stylist, Hair Specialist, etc.
    phone = Column(String(30), nullable=True)
    work_start_time = Column(String(20), default="09:00 AM")
    work_end_time = Column(String(20), default="08:00 PM")
    weekly_off = Column(String(30), default="Tuesday")
    commission_percentage = Column(Float, default=10.0)
    is_active = Column(Boolean, default=True)
    rating = Column(Float, default=5.0)
    total_appointments = Column(Integer, default=0)
    total_revenue_generated = Column(Float, default=0.0)

    salon = relationship("SalonModel", back_populates="staff")


class BookingModel(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(
        Integer, ForeignKey("salons.id", ondelete="CASCADE"), nullable=False
    )
    customer_id = Column(
        Integer, ForeignKey("customers_crm.id", ondelete="SET NULL"), nullable=True
    )
    customer_name = Column(String(100), nullable=False)
    customer_phone = Column(String(30), nullable=True)
    service_name = Column(String(150), nullable=False)
    staff_name = Column(String(100), default="Assigned Stylist")
    booking_date = Column(String(50), nullable=False)  # YYYY-MM-DD
    start_time = Column(String(20), nullable=False)
    duration_minutes = Column(Integer, default=45)
    amount = Column(Float, nullable=False)
    booking_source = Column(String(30), default="app")  # app, walk-in, phone
    status = Column(
        String(30), default="PENDING"
    )  # PENDING, CONFIRMED, ARRIVED, IN_SERVICE, COMPLETED, CANCELLED, NO_SHOW
    payment_status = Column(String(30), default="UNPAID")  # PAID, UNPAID
    payment_method = Column(String(30), default="CASH")  # ONLINE, CASH, UPI
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    salon = relationship("SalonModel", back_populates="bookings")


class CustomerCRMModel(Base):
    __tablename__ = "customers_crm"
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(
        Integer, ForeignKey("salons.id", ondelete="CASCADE"), nullable=False
    )
    name = Column(String(100), nullable=False)
    phone = Column(String(30), nullable=False)
    email = Column(String(120), nullable=True)
    total_visits = Column(Integer, default=1)
    total_spent = Column(Float, default=0.0)
    favorite_service = Column(String(150), nullable=True)
    favorite_staff = Column(String(100), nullable=True)
    last_visit = Column(String(50), nullable=True)
    cancellations_count = Column(Integer, default=0)
    no_show_count = Column(Integer, default=0)
    internal_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    salon = relationship("SalonModel", back_populates="customers")


class OfferModel(Base):
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(
        Integer, ForeignKey("salons.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(150), nullable=False)
    code = Column(String(50), nullable=False)
    discount_percentage = Column(Float, default=0.0)
    fixed_discount = Column(Float, default=0.0)
    min_booking_amount = Column(Float, default=0.0)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=False)
    applicable_services = Column(JSON, default=list)
    usage_limit = Column(Integer, default=100)
    usage_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    salon = relationship("SalonModel", back_populates="offers")


class ReviewModel(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(
        Integer, ForeignKey("salons.id", ondelete="CASCADE"), nullable=False
    )
    customer_name = Column(String(100), nullable=False)
    service_reviewed = Column(String(150), nullable=True)
    staff_reviewed = Column(String(100), nullable=True)
    rating = Column(Float, default=5.0)
    comment = Column(Text, nullable=True)
    owner_reply = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    salon = relationship("SalonModel", back_populates="reviews")


class NotificationModel(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(
        Integer, ForeignKey("salons.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="BOOKING")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
