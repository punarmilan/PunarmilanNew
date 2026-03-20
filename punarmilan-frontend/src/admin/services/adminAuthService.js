import adminApi from './adminApi';

export const adminAuthService = {
    login: async (email, password) => {
        const response = await adminApi.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('adminData', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('adminData');
    }
};

export default adminApi;
