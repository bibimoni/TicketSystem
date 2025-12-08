// src/pages/Pay.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import Paying from "../components/Paying";
import TicketDetail from "../components/TicketDetail";

import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";

function Pay() {
    const { eventId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy dữ liệu
    const [eventData, setEventData] = useState(location.state?.eventData || null);
    const [selectedTickets, setSelectedTickets] = useState(location.state?.selectedTickets || []);

    // Helper functions
    const extractBannerUrl = (infoString) => {
        if (!infoString) return null;
        return infoString.trim();
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {

            alert("Vui lòng đăng nhập để thực hiện thanh toán!");

            navigate("/");
            return;
        }

        if (selectedTickets.length === 0) {
            navigate(`/booking/${eventId}`);
            return;
        }

        if (!eventData && eventId) {
            const fetchEvent = async () => {
                try {
                    const response = await eventService.getEventById(eventId);
                    const data = response.data || response;

                    const bannerUrl = extractBannerUrl(data.event_banner_url);
                    const cleanDesc = data.information;

                    setEventData({
                        id: data.id,
                        title: data.name,
                        date: data.eventTime,
                        location: data.destination,
                        description: cleanDesc,
                        banner: bannerUrl || defaultImage,
                        ...data
                    });
                } catch (error) {
                    // console.error("Lỗi tải sự kiện:", error);
                }
            };
            fetchEvent();
        }
    }, [eventData, eventId, selectedTickets, navigate]);

    const handleTimeout = () => {
        alert("Đã hết thời gian giữ vé. Giao dịch đã bị hủy!");
        navigate(`/about-event/${eventId}`);
    };

    const token = localStorage.getItem("token");
    if (!token) return null;
    if (!eventData || selectedTickets.length === 0) return null;

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />

            <TicketDetail
                pageType="confirmation"
                eventData={eventData}
                onTimeout={handleTimeout}
            />

            <Paying
                eventData={eventData}
                selectedTickets={selectedTickets}
            />

            <Footer />
        </div>
    );
}

export default Pay;