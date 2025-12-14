// src/pages/QuestionForm.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import Footer from "../components/Footer";
import TicketDetail from "../components/TicketDetail";
import Form from "../components/Form";

import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";

function QuestionForm() {
    const { eventId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const hasCheckedAuth = useRef(false);

    const [eventData, setEventData] = useState(location.state?.eventData || null);
    const [selectedTickets, setSelectedTickets] = useState(location.state?.selectedTickets || []);

    // Helper Functions
    const extractBannerUrl = (infoString) => {
        if (!infoString) return null;
        return infoString.trim();
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            if (!hasCheckedAuth.current) {
                alert("Vui lòng đăng nhập để tiếp tục!");
                hasCheckedAuth.current = true;
            }
            navigate("/");
            return;
        }

        if (selectedTickets.length === 0) {
            alert("Không tìm thấy thông tin vé đã chọn. Vui lòng chọn vé lại.");
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
                    console.error("Lỗi tải sự kiện:", error);
                }
            };
            fetchEvent();
        }
    }, [eventData, eventId, selectedTickets, navigate]);

    const handleTimeout = () => {
        alert("Hết thời gian thao tác. Vui lòng chọn vé lại.");
        navigate(`/booking/${eventId}`);
    };

    // Render Guard
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

            <Form
                eventData={eventData}
                selectedTickets={selectedTickets}
            />

            <Footer />
        </div>
    );
}

export default QuestionForm;