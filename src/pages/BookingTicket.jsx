// src/pages/BookingTicket.js
import React from "react";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import Booking from "../components/Booking";


function BookingTicket() {
    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <Booking />
            <Footer />
        </div>
    );
}
export default BookingTicket;