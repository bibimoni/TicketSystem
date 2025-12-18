// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        toast.error("Vui lòng đăng nhập để truy cập trang này!", { 
            toastId: "auth-required" 
        });
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;