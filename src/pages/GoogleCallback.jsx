import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

function GoogleCallback() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchToken = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get('code');

            if (!code) {
                alert("Không tìm thấy mã xác thực Google!");
                navigate('/');
                return;
            }

            try {
                const response = await axiosClient.get(`/auth/google/callback?code=${code}`);
                
                const token = response.access_token; 

                if (token) {
                    localStorage.setItem('token', token);
                    window.location.href = '/'; 
                } else {
                    navigate('/');
                }

            } catch (error) {
                // console.error("Lỗi xác thực Google:", error);
                navigate('/');
            }
        };

        fetchToken();
    }, [location, navigate]);

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-semibold text-primary">Đang xử lý đăng nhập Google...</p>
        </div>
    );
}

export default GoogleCallback;