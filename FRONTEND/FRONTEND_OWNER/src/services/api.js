import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('owner_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication
export const login = (data) => api.post('/api/auth/login', data);
export const register = (data) => api.post('/api/auth/register', data);

// Salons
export const getOwnerSalons = () => api.get('/api/owner/salons');
export const createSalon = (data) => api.post('/api/owner/salons', data);
export const updateSalon = (id, data) => api.patch(`/api/owner/salons/${id}`, data);

// Dashboard & Live Queue
export const getDashboardStats = (id) => api.get(`/api/owner/salons/${id}/dashboard-stats`);

// Bookings & Walk-ins
export const getSalonBookings = (id, status = 'ALL') => 
  api.get(`/api/owner/salons/${id}/bookings${status !== 'ALL' ? `?status_filter=${status}` : ''}`);
export const updateBookingStatus = (id, status, payment_status = null) => 
  api.patch(`/api/owner/bookings/${id}/status`, { status, payment_status });
export const createWalkInBooking = (id, data) => api.post(`/api/owner/salons/${id}/walk-in`, data);

// Services
export const getSalonServices = (id) => api.get(`/api/owner/salons/${id}/services`);
export const createService = (id, data) => api.post(`/api/owner/salons/${id}/services`, data);
export const deleteService = (salonId, serviceId) => api.delete(`/api/owner/salons/${salonId}/services/${serviceId}`);

// Staff
export const getSalonStaff = (id) => api.get(`/api/owner/salons/${id}/staff`);
export const createStaff = (id, data) => api.post(`/api/owner/salons/${id}/staff`, data);

// CRM Customers
export const getSalonCustomers = (id) => api.get(`/api/owner/salons/${id}/customers`);

// Offers
export const getSalonOffers = (id) => api.get(`/api/owner/salons/${id}/offers`);
export const createOffer = (id, data) => api.post(`/api/owner/salons/${id}/offers`, data);
export const toggleOffer = (salonId, offerId) => api.patch(`/api/owner/salons/${salonId}/offers/${offerId}/toggle`);
export const deleteOffer = (salonId, offerId) => api.delete(`/api/owner/salons/${salonId}/offers/${offerId}`);

// Earnings & Analytics
export const getSalonEarnings = (id) => api.get(`/api/owner/salons/${id}/earnings`);
export const getSalonAnalytics = (id) => api.get(`/api/owner/salons/${id}/analytics`);

export default api;

