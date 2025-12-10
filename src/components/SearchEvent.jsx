import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Filter, Calendar } from "lucide-react";
import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";

const SearchEvent = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || ""; 

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(8);

    const getMinPrice = (ticketTypes) => {
        if (!ticketTypes || ticketTypes.length === 0) return 0;
        const prices = ticketTypes.map(t => t.price);
        return Math.min(...prices);
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getAllEvents();

                const processedEvents = Array.isArray(response) ? response.map(evt => {
                    const minPrice = getMinPrice(evt.ticketTypes);
                    const eventDate = new Date(evt.eventTime);
                    const isFinished = eventDate < new Date();

                    return {
                        id: evt.id,
                        title: evt.name,
                        date: eventDate.toLocaleDateString("vi-VN", { day: 'numeric', month: 'long', year: 'numeric' }),
                        price: minPrice > 0 ? minPrice.toLocaleString("vi-VN") + " đ" : "Chưa cập nhật",
                        image: evt.event_banner_url || defaultImage,
                        finished: isFinished,
                        ticketTypes: evt.ticketTypes,
                        hot: false
                    };
                }) : [];

                setEvents(processedEvents);
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);


    useEffect(() => {
        setVisibleCount(8);
    }, [query]);

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(query.toLowerCase())
    );

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-lg text-primary font-bold">
            Đang tìm kiếm sự kiện...
        </div>
    );

    return (
        <>
            {/* KẾT QUẢ TÌM KIẾM */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Header + Bộ lọc */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    {/* Tiêu đề */}
                    <h2 className="text-xl md:text-l font-bold text-gray-800">
                        Kết quả tìm kiếm:{" "}
                        <span className="text-primary font-extrabold">"{query || 'trống'}"</span>
                    </h2>

                    {/* Bộ lọc */}
                    <div className="flex flex-wrap gap-4">
                        <button className="flex items-center bg-primary text-white px-5 py-2 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1">
                            <Calendar size={20} className="mr-2" />
                            <span className="font-medium">Tất cả các ngày</span>
                        </button>
                        <button className="flex items-center bg-primary text-white px-5 py-2 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1">
                            <Filter size={20} className="mr-2" />
                            <span className="font-medium">Bộ lọc</span>
                        </button>
                    </div>
                </div>

                {/* Grid sự kiện */}
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-12 gap-6">
                        {filteredEvents.slice(0, visibleCount).map((event) => (
                            <div
                                key={event.id}
                                className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white rounded-[10px] shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group h-full"
                            >
                                <Link to={`/about-event/${event.id}`} className="flex flex-col h-full">

                                    <div className="relative w-full h-[180px] overflow-hidden rounded-t-[10px]">
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image" }}
                                        />

                                        {/* Badge trạng thái */}
                                        {event.finished ? (
                                            <span className="absolute top-0 right-0 bg-white text-primary px-3 py-1 rounded-bl-[10px] text-xs font-bold shadow-md z-10">
                                                ĐÃ DIỄN RA
                                            </span>
                                        ) : event.hot ? (
                                            <span className="absolute top-0 right-0 bg-white text-primary px-3 py-1 rounded-bl-[10px] text-xs font-bold shadow-md z-10">
                                                BÁN CHẠY
                                            </span>
                                        ) : null}
                                    </div>

                                    {/* Phần Nội dung */}
                                    <div className="p-4 flex flex-col flex-grow justify-between">
                                        <div>
                                            <h3
                                                className="font-bold text-lg uppercase truncate text-gray-800 group-hover:text-primary transition-colors"
                                                title={event.title}
                                            >
                                                {event.title}
                                            </h3>

                                            {/* Giá tiền */}
                                            <p className="text-[15px] mt-2 flex gap-3 items-center">
                                                <span className="text-gray-500 font-medium text-sm italic">Giá chỉ từ </span>
                                                <span className="text-primary font-extrabold text-lg block leading-tight">
                                                    {event.price}
                                                </span>
                                            </p>

                                            {/* Ngày tháng */}
                                            <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm font-medium">
                                                <Calendar size={16} className="text-secondary" />
                                                <span>{event.date}</span>
                                            </div>
                                        </div>

                                        {/* Nút Mua vé */}
                                        <button className="w-full mt-5 bg-primary border-2 border-primary text-white hover:bg-white hover:text-primary font-bold py-2.5 rounded-[8px] transition-all duration-300 shadow-sm hover:shadow-md">
                                            Mua vé ngay
                                        </button>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nút Xem thêm */}
                {visibleCount < filteredEvents.length && (
                    <div className="text-center mt-12">
                        <button
                            onClick={handleLoadMore}
                            className="bg-primary text-white text-lg border-[3px] border-primary hover:bg-white hover:text-primary font-bold py-3 px-10 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Xem thêm
                        </button>
                    </div>
                )}

            </div>
        </>
    );
}

export default SearchEvent;