import axiosClient from './axiosClient';

const authService = {
    login(username, password) {
        return axiosClient.post('/auth/login', { username, password });
    },

    register(data) {
        return axiosClient.post('/customer', data);
    },
    
    loginWithGoogle() {
        const baseURL = axiosClient.defaults.baseURL;
        window.location.href = `${baseURL}/auth/google`;
    }
};

export default authService;