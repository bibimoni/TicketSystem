// src/pages/AboutEvent.js
import React from "react";
import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import Footer from "../components/Footer";
import TicketDetail from "../components/TicketDetail";
import Info from "../components/Info";
import MoreEvent from "../components/MoreEvent"

function AboutEvent() {
    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <CatalogBar />
            <TicketDetail pageType="event"/>
            <Info />
            <MoreEvent />
            <Footer />
        </div>
    );
}

export default AboutEvent;