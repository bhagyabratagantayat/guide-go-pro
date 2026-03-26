import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
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
export const registerUser = (userData) => api.post('/auth/register', userData);
export const toggleGuideStatus = () => api.put('/guides/toggle-status');

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

export default api;
