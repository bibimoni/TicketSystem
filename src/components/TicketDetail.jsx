// src/components/TicketDetail.jsx
import { useState, useEffect } from "react";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import { Link } from "react-router-dom";

import defaultImage from "../assets/images/default_img.png";

const TicketDetail = ({ pageType, eventData, onTimeout }) => {
    const [remainingTime, setRemainingTime] = useState(20 * 60);

    useEffect(() => {
        if (pageType !== "confirmation") return;

        if (remainingTime === 0) {
            if (onTimeout) onTimeout();
            return;
        }

        const timer = setInterval(() => {
            setRemainingTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [remainingTime, pageType, onTimeout]);

    if (!eventData) return null;

    const title = eventData.title || eventData.name || "Tên sự kiện đang cập nhật";
    const rawDate = eventData.date || eventData.eventTime;
    const location = eventData.location || eventData.destination || "Địa điểm đang cập nhật";

    let bannerSrc = eventData.banner || eventData.image || defaultImage;
    if (!eventData.banner && !eventData.image && eventData.information) {
        const match = eventData.information.match(/\[Banner\]:\s*([^\s\n]+)/);
        if (match) bannerSrc = match[1];
    }

    const formattedDate = rawDate
        ? new Date(rawDate).toLocaleDateString("vi-VN", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        })
        : "Thời gian đang cập nhật";

    const getMinPrice = () => {
        if (!eventData.ticketTypes || eventData.ticketTypes.length === 0) return 0;
        const prices = eventData.ticketTypes.map(t => t.price);
        return Math.min(...prices);
    };

    const minPrice = getMinPrice();

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const renderAction = () => {
        if (pageType === "home" || pageType === "event") {
            return (
                <>
                    <div className="mb-4 flex items-center">
                        <span className="font-semibold italic text-black text-base opacity-70 mr-6">Giá từ</span>
                        <div className="font-extrabold text-primary text-2xl text-center">
                            {minPrice > 0 ? minPrice.toLocaleString("vi-VN") + " đ" : "Đang cập nhật"}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Link to={`/booking/${eventData.id}`}>
                            <button className="w-40 mb-4 border-[3px] bg-primary border-primary hover:bg-white hover:text-primary text-white font-bold py-3 rounded-xl transition">
                                Mua vé ngay
                            </button>
                        </Link>
                    </div>
                </>
            );
        } else if (pageType === "confirmation") {
            return (
                <div className="flex justify-center item-center mt-4">
                    <div className="bg-white rounded-[15px] border-4 border-solid border-[#d9d9d9] p-3 inline-block">
                        <p className="font-bold text-primary text-base text-center mb-2">
                            Hoàn tất đặt vé trong
                        </p>
                        <div className="flex justify-center item-center bg-primary rounded-[20px] px-3 py-1">
                            <span className="font-bold text-white text-xl">
                                {formatTime(remainingTime)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <section className="flex py-9 max-w-7xl mx-auto px-4 relative">
            <div className="grid grid-cols-12 h-[300px] w-full relative">
                {/* Cột trái */}
                <div className="relative col-span-5 h-[300px] rounded-l-3xl bg-white">
                    <div className="p-6">
                        <h1 className="font-bold text-black text-lg mb-4 uppercase line-clamp-2" title={title}>
                            {title}
                        </h1>

                        <div className="flex items-center gap-3 mb-3">
                            <CalendarIcon className="w-[25px] h-[25px] text-secondary" />
                            <span className="font-medium text-secondary text-xs">{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <MapPinIcon className="w-[25px] h-[25px] text-secondary" />
                            <span className="font-medium text-secondary text-xs line-clamp-2">{location}</span>
                        </div>
                        <div className="h-0.5 bg-secondary opacity-40 my-4" />
                        {renderAction()}
                    </div>
                </div>

                {/* Bán nguyệt */}
                <div className="absolute left-[41.5%] top-0 h-full flex flex-col justify-between items-center z-10">
                    <div className="w-[65px] h-[65px] -ml-8 -mt-7 rounded-full bg-gray-100" />
                    <div className="w-[65px] h-[65px] -ml-8 -mb-7 rounded-full bg-gray-100" />
                </div>

                {/* Cột phải */}
                <div className="relative col-span-7 h-[300px] overflow-hidden">
                    <img
                        className="w-full h-full object-cover"
                        alt={title}
                        src={bannerSrc}
                        onError={(e) => { e.target.onerror = null; e.target.src = defaultImage }}
                    />
                    <div className="absolute top-1/2 -right-9 transform -translate-y-1/2 flex flex-col items-center justify-between h-[80%]">
                        <div className="w-6 h-6 rounded-full bg-gray-100" />
                        <div className="w-8 h-8 rounded-full bg-gray-100" />
                        <div className="w-[65px] h-[65px] rounded-full bg-gray-100" />
                        <div className="w-8 h-8 rounded-full bg-gray-100" />
                        <div className="w-6 h-6 rounded-full bg-gray-100" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TicketDetail;
