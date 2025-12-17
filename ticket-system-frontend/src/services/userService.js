import axiosClient from './axiosClient';

const userService = {
    getProfile() {
        return axiosClient.get('/customer/profile');
    },
    updateProfile(data) {
        return axiosClient.patch('/customer/profile', data);
    },
    uploadImage(file) {
        const formData = new FormData();
        formData.append('file', file);

        return axiosClient.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    }
};

export default userService;