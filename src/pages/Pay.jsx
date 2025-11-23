// src/pages/Pay.js
import React from "react";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import Paying from "../components/Paying";
import TicketDetail from "../components/TicketDetail";


function Pay() {
    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <TicketDetail pageType="confirmation"/>
            <Paying />
            <Footer />
        </div>
    );
}
export default Pay;