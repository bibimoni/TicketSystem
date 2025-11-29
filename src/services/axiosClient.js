// (Cấu hình chung)
import axios from 'axios';

const axiosClient = axios.create({
    // Đường dẫn gốc của Backend
    baseURL: 'https://ticket-system-backend-pkuf.onrender.com', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor cho Request: Tự động gắn Token nếu có
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor cho Response: Xử lý kết quả trả về
axiosClient.interceptors.response.use(
    (response) => {
        // Trả về data trực tiếp (bỏ qua lớp wrapper của axios)
        return response.data;
    },
    (error) => {
        // Xử lý lỗi chung (VD: Token hết hạn 401 thì logout)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            // Có thể redirect về trang login hoặc reload trang
            // window.location.href = '/'; 
        }
        return Promise.reject(error);
    }
);

export default axiosClient;