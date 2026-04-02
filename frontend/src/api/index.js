import { CONFIG } from '../config';
import axios from 'axios';

const api = axios.create({
    baseURL: `${CONFIG.BACKEND_URL}`
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getLocations = (search = '') => api.get(`/locations?search=${search}`);
export const getNearbyGuides = (lat, lng) => api.get(`/guides/nearby?lat=${lat}&lng=${lng}`);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const testLogin = (role) => api.post('/auth/test-login', { role });
export const registerUser = (userData) => api.post('/auth/register', userData);
export const toggleGuideStatus = () => api.put('/guides/toggle-status');
export const updateGuideLocation = (lat, lng) => api.post('/guides/update-location', { lat, lng });

// Booking APIs
export const createBooking = (bookingData) => api.post('/bookings/create', bookingData);
export const acceptBooking = (bookingId) => api.post(`/bookings/accept/${bookingId}`);
export const startTrip = (bookingId, otp) => api.post('/bookings/start', { bookingId, otp });
export const endTrip = (bookingId) => api.post('/bookings/end', { bookingId });
export const getUserBookings = () => api.get('/bookings/user-bookings');
export const getGuideBookings = () => api.get('/bookings/guide-bookings');

// Admin APIs
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminConfig = () => api.get('/admin/config');
export const updateAdminConfig = (config) => api.put('/admin/config', config);

export const getAdminUsers = () => api.get('/admin/users');
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminGuides = () => api.get('/admin/guides');
export const approveAdminGuide = (id) => api.put(`/admin/guides/approve/${id}`);
export const rejectAdminGuide = (id) => api.delete(`/admin/guides/reject/${id}`);
export const getAdminBookings = (status) => api.get(`/admin/bookings${status ? `?status=${status}` : ''}`);
export const getAdminReports = () => api.get('/admin/reports');

export default api;
