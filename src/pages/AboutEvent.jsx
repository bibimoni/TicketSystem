// src/pages/AboutEvent.js
import React from "react";
import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import Footer from "../components/Footer";

function AboutEvent() {
    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <CatalogBar />
            <Footer />
        </div>
    );
}

export default AboutEvent;