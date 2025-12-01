// src/components/HeroBanner.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";

const HeroBanner = () => {
    const [events, setEvents] = useState([]);
    const [randomEvents, setRandomEvents] = useState([]); // 2 event random 
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Tách link ảnh
    const extractBannerUrl = (infoString) => {
        if (!infoString) return null;
        const match = infoString.match(/\[Banner\]:\s*([^\s\n]+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const fetchAndProcessData = async () => {
            try {
                const response = await eventService.getAllEvents();
                const now = new Date();

                let processedEvents = Array.isArray(response) ? response.map(evt => {
                    const bannerUrl = extractBannerUrl(evt.information);
                    return {
                        id: evt.id,
                        title: evt.name,
                        subtitle: new Date(evt.eventTime).toLocaleDateString("vi-VN", {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }).toUpperCase() + ` - ${evt.destination}`,
                        eventTime: evt.eventTime,
                        image: bannerUrl || defaultImage,
                    };
                }) : [];

                processedEvents = processedEvents
                    .filter(evt => new Date(evt.eventTime) > now)
                    .sort((a, b) => new Date(a.eventTime) - new Date(b.eventTime))
                    .slice(0, 10);

                setEvents(processedEvents);

                // Random 2 sự kiện
                if (processedEvents.length > 0) {
                    // Tạo bản sao 
                    const shuffled = [...processedEvents].sort(() => 0.5 - Math.random());
                    setRandomEvents(shuffled.slice(0, 2));
                }

            } catch (error) {
                // console.error("Lỗi tải HeroBanner:", error); //Debug
            } finally {
                setLoading(false);
            }
        };

        fetchAndProcessData();
    }, []);

    // --- Logic Carousel ---
    const nextSlide = () => {
        if (events.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    };

    const prevSlide = () => {
        if (events.length === 0) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
    };

    // Auto slide sau 5s
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(interval);
    }, [events.length]);


    if (loading) return <div className="py-8 text-center text-primary">Đang tải...</div>;

    const currentEvent = events[currentIndex];

    return (
        <div className="flex-grow py-8">
            <div className="w-full relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-12 gap-4">

                        {/* --- Ô TRÁI --- */}
                        <div className="relative col-span-8">
                            <Link to={`/about-event/${currentEvent.id}`}>
                                <div className="w-full h-[480px] bg-gray-200 rounded-lg shadow-2xl overflow-hidden cursor-pointer group relative">
                                    <img
                                        src={currentEvent.image}
                                        alt={currentEvent.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }}
                                    />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 group-hover:to-black/60 transition-all duration-300"></div>

                                    {/* Nội dung*/}
                                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                        <h3 className="text-3xl font-bold mb-2 drop-shadow-lg uppercase">{currentEvent.title}</h3>
                                        <p className="text-sm font-semibold opacity-90 mb-4 inline-block px-2 py-1 rounded">
                                            {currentEvent.subtitle}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Dots indicators */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                                {events.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentIndex(index);
                                        }}
                                        className={`w-3 h-3 rounded-full transition-all shadow ${index === currentIndex ? 'bg-primary scale-125' : 'bg-white/70 hover:bg-white'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Nút Prev */}
                            <button
                                onClick={(e) => { e.preventDefault(); prevSlide(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-primary/80 rounded-full p-3 text-white transition-all backdrop-blur-sm"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            {/* Nút Next */}
                            <button
                                onClick={(e) => { e.preventDefault(); nextSlide(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-primary/80 rounded-full p-3 text-white transition-all backdrop-blur-sm"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* --- Ô PHẢI --- */}
                        <div className="col-span-4 grid grid-rows-2 gap-4 h-[480px]">
                            {randomEvents.map((item, idx) => (
                                <Link to={`/about-event/${item.id}`} key={item.id} className="h-full">
                                    <div className="relative w-full h-full bg-gray-200 rounded-lg shadow-xl overflow-hidden cursor-pointer group">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }}
                                        />

                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;