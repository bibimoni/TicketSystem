// src/pages/BookingTicket.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import Booking from "../components/Booking";

function BookingTicket() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Vui lòng đăng nhập để mua vé!");
            navigate("/");
        }
    }, [navigate]);

    // const token = localStorage.getItem("token");
    // if (!token) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />

            <Booking />

            <Footer />
        </div>
    );
}
export default BookingTicket;