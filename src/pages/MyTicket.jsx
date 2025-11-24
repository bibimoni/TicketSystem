import React from "react";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import MoreEvent from "../components/MoreEvent";
import Ticket from "../components/Ticket";

function MyTicket() {
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