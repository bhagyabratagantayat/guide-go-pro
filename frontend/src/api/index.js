import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

export const getLocations = (search = '') => api.get(`/locations?search=${search}`);
export const getNearbyGuides = (lat, lng) => api.get(`/guides/nearby?lat=${lat}&lng=${lng}`);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const toggleGuideStatus = () => api.put('/guides/toggle-status');

// Admin APIs
export const getAdminStats = () => api.get('/admin/stats');
export const getAdminConfig = () => api.get('/admin/config');
export const updateAdminConfig = (config) => api.put('/admin/config', config);

export default api;
