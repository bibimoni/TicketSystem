// src/pages/AboutEvent.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import Footer from "../components/Footer";
import TicketDetail from "../components/TicketDetail";
import Info from "../components/Info";
import MoreEvent from "../components/MoreEvent";

import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";

function AboutEvent() {
    const { eventId } = useParams(); // Lấy eventID
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hàm tách link ảnh 
    const extractBannerUrl = (infoString) => {
        if (!infoString) return null;
        return infoString.trim();
    };

    useEffect(() => {
        const fetchEventDetail = async () => {
            setLoading(true);
            try {
                const response = await eventService.getEventById(eventId);

                const evtData = response.data || response;

                // Xử lý dữ liệu
                // const bannerUrl = extractBannerUrl(evtData.event_banner_url);
                const bannerUrl = evtData.event_banner_url;
                const cleanDesc = evtData.information;

                const processedEvent = {
                    id: evtData.id,
                    title: evtData.name,
                    description: cleanDesc,
                    date: evtData.eventTime,
                    location: evtData.destination,
                    organizer: evtData.organizer || "BTC Sự Kiện",
                    banner: bannerUrl || defaultImage,
                    ticketTypes: evtData.ticketTypes || [] // Danh sách loại vé
                };

                setEvent(processedEvent);
            } catch (error) {
                console.error("Lỗi tải chi tiết sự kiện:", error);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEventDetail();
        }
    }, [eventId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-xl font-bold text-primary">Đang tải thông tin...</div>;
    if (!event) return <div className="min-h-screen flex items-center justify-center text-xl text-primary">Không tìm thấy sự kiện!</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <CatalogBar />

            <TicketDetail pageType="event" eventData={event} />
            <Info eventData={event} />

            <MoreEvent />
            <Footer />
        </div>
    );
}

export default AboutEvent;