// src/components/TicketDetail.js
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import eventsData from "../database/Event";

const TicketDetail = ({ pageType }) => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [remainingTime, setRemainingTime] = useState(20 * 60); // 20 phút

    useEffect(() => {
        const foundEvent = eventsData.find(e => e.id === eventId);
        setEvent(foundEvent || null);
    }, [eventId]);

    useEffect(() => {
        if (pageType !== "confirmation") return;

        const timer = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [pageType]);

    if (!event) return <div className="text-center py-10">Sự kiện không tồn tại hoặc đang tải...</div>;

    // Format ngày
    const formattedDate = new Date(event.date).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const minPrice = event.ticketCategories?.length
    ? Math.min(...event.ticketCategories.map(t => parseInt(t.price.replace(/\D/g, ''))))
    : 0;
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const renderAction = () => {
        if (!event) return null;

        if (pageType === "home" || pageType === "event") {
            return (
                <>
                    <div className="h-0.5 bg-secondary opacity-40 my-2" />
                    <div className="mb-3 flex items-center">
                        <span className="font-semibold italic text-black text-base opacity-70 mr-6">Giá từ</span>
                        <div className="font-extrabold text-primary text-2xl text-center">
                            {minPrice.toLocaleString("vi-VN")} đ
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className="w-40 mb-4 bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition">
                            Mua vé ngay
                        </button>
                    </div>
                </>
            );
        } else if (pageType === "confirmation") {
            return (
                <div className="flex justify-center item-center">
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
                        <h1 className="font-bold text-black text-lg mb-4">{event.title}</h1>

                        <div className="flex items-center gap-3 mb-3">
                            <CalendarIcon className="w-[25px] h-[25px] text-secondary" />
                            <span className="font-medium text-secondary text-xs">{formattedDate}</span>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <MapPinIcon className="w-[25px] h-[25px] text-secondary" />
                            <span className="font-medium text-secondary text-xs">{event.location}</span>
                        </div>
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
                        alt="Concert Poster"
                        src={event.bannerLandscape}
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
