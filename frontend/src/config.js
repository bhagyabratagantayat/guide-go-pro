export const CONFIG = {
    TEST_MODE: true,
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    BACKEND_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
};
