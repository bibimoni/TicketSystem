// src/pages/AboutEvent.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import Footer from "../components/Footer";
import TicketDetail from "../components/TicketDetail";
import Info from "../components/Info";
import MoreEvent from "../components/MoreEvent";
import Loader from "../components/TicketLoader";

import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";

function AboutEvent() {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventDetail = async () => {
            setLoading(true);
            try {
                const response = await eventService.getEventById(eventId);

                const evtData = response.data || response;

                const processedEvent = {
                    id: evtData.id,
                    title: evtData.name,
                    description: evtData.information,
                    date: evtData.eventTime,
                    location: evtData.destination,
                    organizer: evtData.organizer || "BTC Sự Kiện",
                    organizer_logo: evtData.organizer_logo || defaultImage,
                    organizer_information: evtData.organizer_information || "Đối tác chính thức của TickeZ.",
                    event_picture: evtData.event_picture_url || defaultImage,
                    event_banner: evtData.event_banner_url|| defaultImage,
                    ticketTypes: evtData.ticketTypes || [] 
                };

                setEvent(processedEvent);
            } catch (error) {
                // console.error("Lỗi tải chi tiết sự kiện:", error);
            } finally {
                setLoading(false);
            }
        };

        if (eventId) {
            fetchEventDetail();
        }
    }, [eventId]);

    if (loading) return(
        <Loader text="Đang tải sự kiện..." height="100vh"/>
    );
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