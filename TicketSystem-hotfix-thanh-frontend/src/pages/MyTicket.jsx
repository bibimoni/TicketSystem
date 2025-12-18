// src/pages/MyTicket.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import MoreEvent from "../components/MoreEvent";
import Ticket from "../components/Ticket";

function MyTicket() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Vui lòng đăng nhập để xem vé của bạn!");
            navigate("/"); 
        }
    }, [navigate]);

    const token = localStorage.getItem("token");
    if (!token) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <Ticket />
            <MoreEvent />
            <Footer />
        </div>
    );
}

export default MyTicket;