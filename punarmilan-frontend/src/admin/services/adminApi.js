import axios from 'axios';

const ADMIN_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/admin';

const adminApi = axios.create({
    baseURL: ADMIN_API_URL,
    withCredentials: true,
});

// Request interceptor to add JWT
adminApi.interceptors.request.use((config) => {
    const adminData = JSON.parse(localStorage.getItem('adminData'));
    if (adminData && adminData.token) {
        config.headers.Authorization = `Bearer ${adminData.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default adminApi;
