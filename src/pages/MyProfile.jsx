// src/pages/MyProfile.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import Profile from "../components/Profile";

function MyProfile() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    if (!token) return null;

    useEffect(() => {

        const token = localStorage.getItem("token");
        
        if (!token) {
            alert("Vui lòng đăng nhập để xem thông tin cá nhân!");
            navigate("/"); 
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />

            <Breadcrumb />
            <Profile />
            
            <Footer />
        </div>
    );
}
export default MyProfile;