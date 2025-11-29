import axiosClient from './axiosClient';

const authService = {
    login(username, password) {
        return axiosClient.post('/auth/login', { username, password });
    },
    register(data) {
        // data gồm: email, username, password...
        return axiosClient.post('/customer', data);
    }
};

export default authService;