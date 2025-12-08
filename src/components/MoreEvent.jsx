// src/components/MoreEvent.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";

const MoreEvent = () => {
    const [events, setEvents] = useState([]);
    
    const extractBannerUrl = (infoString) => {
        if (!infoString) return null;
        const match = infoString.match(/\[Banner\]:\s*([^\s\n]+)/);
        return match ? match[1] : null;
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getAllEvents();
                
                if (Array.isArray(response)) {
                    const processedData = response.map(evt => ({
                        id: evt.id,
                        title: evt.name,
                        image: extractBannerUrl(evt.information) || defaultImage
                    }));

                    const randomEvents = processedData
                        .sort(() => 0.5 - Math.random()) 
                        .slice(0, 10);

                    setEvents(randomEvents);
                }
            } catch (error) {
                // console.error("Lỗi tải MoreEvent:", error);
            }
        };

        fetchEvents();
    }, []);

    if (events.length === 0) return null;

    return (
        <section className="bg-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-6">

                {/* Tiêu đề căn giữa */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-full max-w-7xl">
                        <hr className="border-gray-300 border-[1px] mb-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 text-center uppercase">
                        Có thể bạn thích
                    </h2>
                </div>

                {/* 5 hình */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {events.map((item) => (
                        <Link 
                            to={`/about-event/${item.id}`}
                            key={item.id}
                            className="block group"
                            title={item.title}
                        >
                            <div className="bg-white rounded-lg shadow-md overflow-hidden h-32 relative">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {e.target.src = defaultImage}}
                                />
                            
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default MoreEvent;