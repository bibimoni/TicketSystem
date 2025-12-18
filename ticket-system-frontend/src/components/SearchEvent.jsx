import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Filter, Calendar, X, Check } from "lucide-react";
import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";
import Loader from "./TicketLoader";

const SearchEvent = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(8);

    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filterLocation, setFilterLocation] = useState("");
    const [filterPrice, setFilterPrice] = useState("");

    const getMinPrice = (ticketTypes) => {
        if (!ticketTypes || ticketTypes.length === 0) return 0;
        const prices = ticketTypes.map(t => t.price);
        return Math.min(...prices);
    };

    const extractCity = (fullAddress) => {
        if (!fullAddress) return "Khác";

        const parts = fullAddress.split(",").map(part => part.trim());

        for (let i = parts.length - 1; i >= 0; i--) {
            const part = parts[i];
            const lowerPart = part.toLowerCase();

            if (["việt nam", "vietnam", "vn", "viet nam"].includes(lowerPart)) {
                continue;
            }
            if (lowerPart.includes("hồ chí minh") || lowerPart.includes("hcm") || lowerPart.includes("sai gon") || lowerPart.includes("sài gòn") || lowerPart.includes("ho chi minh city") || lowerPart.includes("hcm city") ){
                return "TP. Hồ Chí Minh";
            }
            if (lowerPart.includes("hà nội") || lowerPart.includes("ha noi") || lowerPart.includes("hanoi") || lowerPart.includes("hanoi city") || lowerPart === "hn" || lowerPart.includes("ha noi city") || lowerPart.includes("hn city") ){
                return "TP. Hà Nội";
            }
            if (lowerPart.includes("đà nẵng") || lowerPart.includes("da nang")) {
                return "TP. Đà Nẵng";
            }
            return part.replace(/^(Thành phố|Tỉnh|City)\s+/i, ""); 
        }

        return "Khác";
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await eventService.getEvents();

                const processedEvents = Array.isArray(response) ? response.map(evt => {
                    const minPrice = getMinPrice(evt.ticketTypes);
                    const eventDate = new Date(evt.eventTime);
                    const isFinished = eventDate < new Date() || evt.status === 'COMPLETED';
                    const city = extractCity(evt.destination); 

                    return {
                        id: evt.id,
                        title: evt.name,
                        date: eventDate.toLocaleDateString("vi-VN", { day: 'numeric', month: 'long', year: 'numeric' }),
                        price: minPrice > 0 ? minPrice.toLocaleString("vi-VN") + " đ" : "Chưa cập nhật",
                        image: evt.event_banner_url || defaultImage,
                        finished: isFinished,
                        ticketTypes: evt.ticketTypes,
                        hot: false,

                        rawDate: eventDate,
                        rawPrice: minPrice,
                        rawCity: city 
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

    // LẤY DANH SÁCH TỈNH
    const uniqueCities = useMemo(() => {
        const cities = events.map(e => e.rawCity);
        return [...new Set(cities)].sort((a, b) => a.localeCompare(b, 'vi')); 
    }, [events]);

    // LOGIC LỌC
    const filteredEvents = events.filter(event => {
        const matchQuery = event.title.toLowerCase().includes(query.toLowerCase());

        let matchDate = true;
        if (startDate) {
            matchDate = matchDate && (new Date(event.rawDate) >= new Date(startDate));
        }
        if (endDate) {
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            matchDate = matchDate && (new Date(event.rawDate) <= endOfDay);
        }

        let matchLocation = true;
        if (filterLocation) {
            matchLocation = event.rawCity === filterLocation;
        }

        let matchPrice = true;
        if (filterPrice) {
            const price = event.rawPrice;
            switch (filterPrice) {
                case "under-500": matchPrice = price < 500000; break;
                case "500-1000": matchPrice = price >= 500000 && price <= 1000000; break;
                case "over-1000": matchPrice = price > 1000000; break;
                default: matchPrice = true;
            }
        }

        return matchQuery && matchDate && matchLocation && matchPrice;
    });

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 8);
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setFilterLocation("");
        setFilterPrice("");
    };

    if (loading) return (
        <Loader text="Đang tìm kiếm sự kiện..." height="100vh" />
    );

    return (
        <>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col mb-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <h2 className="text-xl md:text-l font-bold text-gray-800">
                            Kết quả tìm kiếm:{" "}
                            <span className="text-primary font-extrabold">"{query}"</span>
                        </h2>

                        <div className="flex flex-wrap gap-4">  
                            <button 
                                onClick={() => setShowFilterPanel(!showFilterPanel)}
                                className={`flex items-center px-5 py-2 rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 ${showFilterPanel ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                            >
                                <Filter size={20} className="mr-2" />
                                <span className="font-medium">Bộ lọc</span>
                            </button>
                        </div>
                    </div>

                    {showFilterPanel && (
                        <div className="mt-6 p-6 bg-white rounded-xl shadow-inner border border-gray-200 animate-fadeIn">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-primary mb-1">Từ ngày</label>
                                    <input 
                                        type="date" 
                                        className="border rounded-md p-2 focus:border-primary focus:outline-none"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-primary mb-1">Đến ngày</label>
                                    <input 
                                        type="date" 
                                        className="border rounded-md p-2 focus:border-primary focus:outline-none"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-primary mb-1">Tỉnh / Thành phố</label>
                                    <select 
                                        className="border rounded-md p-2 focus:border-primary focus:outline-none"
                                        value={filterLocation}
                                        onChange={(e) => setFilterLocation(e.target.value)}
                                    >
                                        <option value="">Tất cả địa điểm</option>
                                        {uniqueCities.map((city, idx) => (
                                            <option key={idx} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-semibold text-primary mb-1">Mức giá</label>
                                    <select 
                                        className="border rounded-md p-2 focus:border-primary focus:outline-none"
                                        value={filterPrice}
                                        onChange={(e) => setFilterPrice(e.target.value)}
                                    >
                                        <option value="">Tất cả mức giá</option>
                                        <option value="under-500">Dưới 500k</option>
                                        <option value="500-1000">500k - 1 triệu</option>
                                        <option value="over-1000">Trên 1 triệu</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 font-semibold"
                                >
                                    <X size={16} /> Xóa bộ lọc
                                </button>
                                <button 
                                    onClick={() => setShowFilterPanel(false)}
                                    className="flex items-center gap-1 text-sm bg-primary text-white px-4 py-1.5 rounded hover:bg-opacity-90 font-bold"
                                >
                                    <Check size={16} /> Áp dụng
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="max-w-7xl mx-auto px-6">
                    {filteredEvents.length > 0 ? (
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
                                                onError={(e) => { e.target.src = "" }}
                                            />
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

                                        <div className="p-4 flex flex-col flex-grow justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg uppercase truncate text-gray-800 group-hover:text-primary transition-colors" title={event.title}>
                                                    {event.title}
                                                </h3>
                                                <p className="text-[15px] mt-2 flex gap-3 items-center">
                                                    <span className="text-gray-500 font-medium text-sm italic">Giá chỉ từ </span>
                                                    <span className="text-primary font-extrabold text-lg block leading-tight">
                                                        {event.price}
                                                    </span>
                                                </p>
                                                <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm font-medium">
                                                    <Calendar size={16} className="text-secondary" />
                                                    <span>{event.date}</span>
                                                </div>
                                            </div>
                                            <button className="w-full mt-5 bg-primary border-2 border-primary text-white hover:bg-white hover:text-primary font-bold py-2.5 rounded-[8px] transition-all duration-300 shadow-sm hover:shadow-md">
                                                Mua vé ngay
                                            </button>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500 text-lg">Không tìm thấy sự kiện nào phù hợp với bộ lọc.</p>
                            <button onClick={clearFilters} className="text-primary font-bold mt-2 hover:underline">Xóa bộ lọc</button>
                        </div>
                    )}
                </div>

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