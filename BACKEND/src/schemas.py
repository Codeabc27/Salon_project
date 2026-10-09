from pydantic import BaseModel, EmailStr


# ================= AUTH SCHEMAS =================
class RegisterPayload(BaseModel):
    email: EmailStr
    password: str
    role: str | None = "SALON_OWNER"  # SALON_OWNER, CUSTOMER, SUPER_ADMIN


from pydantic import BaseModel
from typing import Optional


class LoginPayload(BaseModel):
    email: Optional[str] = None
    login_identifier: Optional[str] = None
    password: str


# Keep your existing schemas below this line (SalonProfileCreate, ServiceCreate, etc.)


class SalonProfileCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    address: str
    city: str
    phone: str | None = None
    whatsapp: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class SalonProfileUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    address: str | None = None
    city: str | None = None
    phone: str | None = None
    whatsapp: str | None = None
    image_url: str | None = None
    logo_url: str | None = None


class AvailabilitySettingsUpdate(BaseModel):
    opening_time: str
    closing_time: str
    lunch_break_start: str
    lunch_break_end: str
    weekly_off_days: list[str]
    max_simultaneous_bookings: int
    online_booking_enabled: bool
    same_day_booking_enabled: bool
    advance_booking_days_limit: int
    cancellation_policy: str


class ServiceCreate(BaseModel):
    name: str
    description: str | None = None
    category: str | None = "Hair"
    price: float
    duration: int = 45
    image_url: str | None = None


class StaffCreate(BaseModel):
    name: str
    role: str | None = "Stylist"
    phone: str | None = None
    work_start_time: str | None = "09:00 AM"
    work_end_time: str | None = "08:00 PM"
    weekly_off: str | None = "Sunday"
    commission_percentage: float | None = 10.0


class WalkInBookingCreate(BaseModel):
    customer_name: str
    customer_phone: str | None = None
    service_name: str
    staff_name: str | None = "Assigned Stylist"
    booking_date: str | None = None
    start_time: str | None = "Now"
    duration_minutes: int | None = 45
    amount: float
    payment_method: str | None = "CASH"


class BookingStatusUpdate(BaseModel):
    status: (
        str  # PENDING, CONFIRMED, ARRIVED, IN_SERVICE, COMPLETED, CANCELLED, NO_SHOW
    )
    payment_status: str | None = None


class BookingReschedule(BaseModel):
    booking_date: str
    start_time: str


class OfferCreate(BaseModel):
    title: str
    code: str
    discount_percentage: float | None = 0.0
    fixed_discount: float | None = 0.0
    min_booking_amount: float | None = 0.0
    start_date: str
    end_date: str
    applicable_services: list[str] | None = []
    usage_limit: int | None = 100


class ReviewReplyCreate(BaseModel):
    owner_reply: str


class CustomerNoteUpdate(BaseModel):
    internal_notes: str
