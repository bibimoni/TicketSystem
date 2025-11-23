// src/pages/MyProfile.js
import React from "react";
import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import Breadcrumb from "../components/Breadcrumb";
import Profile from "../components/Profile";

function MyProfile() {
    

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