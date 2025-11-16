// src/pages/Search.js
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Calendar } from "lucide-react";
import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import Footer from "../components/Footer";
import feature1 from "../assets/images/feature3.jpg"

// Data gia 
const events = [
    { id: 1, title: "ANH TRAI VƯỢT NGÀN CHÔNG GAI - DAY 2", date: "14 tháng 6, 2025", price: "600.000 đ", hot: true, image: feature1, finished: false },
    { id: 2, title: "V CONCERT 2025 - Rạng rỡ Việt Nam", date: "09 tháng 8, 2025", price: "500.000 đ", hot: true, image: feature1, finished: true },
    { id: 3, title: "TAYLOR SWIFT: THE ERAS TOUR", date: "13 tháng 8, 2024", price: "5.000.000 đ", hot: true, image: feature1, finished: false },
    { id: 4, title: "VIETNAMESE CONCERT - HOÀNG THÙY LINH", date: "13 tháng 8, 2024", price: "2.000.000 đ", image: feature1, finished: false },
    { id: 5, title: "ANH TRAI VƯỢT NGÀN CHÔNG GAI - DAY 2", date: "14 tháng 6, 2025", price: "600.000 đ", hot: true, image: feature1, finished: true },
    { id: 6, title: "V CONCERT 2025 - Rạng rỡ Việt Nam", date: "09 tháng 8, 2025", price: "500.000 đ", hot: true, image: feature1, finished: true },
    { id: 7, title: "TAYLOR SWIFT: THE ERAS TOUR", date: "13 tháng 8, 2024", price: "5.000.000 đ", hot: true, image: feature1, finished: true },
    { id: 8, title: "VIETNAMESE CONCERT - HOÀNG THÙY LINH", date: "13 tháng 8, 2024", price: "2.000.000 đ", image: feature1, finished: false },
];
const recommended = [
    { id: 10, title: "SPRING CONCERT 2025", image: feature1 },
    { id: 11, title: "V CONCERT", image: feature1 },
    { id: 12, title: "TAYLOR SWIFT THE ERAS TOUR", image: feature1 },
    { id: 13, title: "SPRING CONCERT 2025", image: feature1 },
    { id: 14, title: "V CONCERT", image: feature1 },
];

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <CatalogBar />

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
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white rounded-[10px] shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 cursor-pointer group"
                            >
                                {/* Nội dung card */}
                                <div className="relative w-full max-h-[180px] overflow-hidden rounded-t-[10px] mb-4">
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Badge: Đã diễn ra hoặc Bán chạy */}
                                    {event.finished ? (
                                        <span className="absolute top-0 right-0 bg-white text-primary px-3 py-1 rounded-tr-[10px] rounded-bl-[10px] text-sm font-semibold shadow">
                                            Đã diễn ra
                                        </span>
                                    ) : event.hot ? (
                                        <span className="absolute top-0 right-0 bg-white text-primary px-3 py-1 rounded-tr-[10px] rounded-bl-[10px] text-sm font-semibold shadow">
                                            Bán chạy
                                        </span>
                                    ) : null}
                                </div>
                                <div className="ml-6 mr-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-lg uppercase line-clamp-2 group-hover:text-primary transition-colors">
                                            {event.title}
                                        </h3>
                                        <p className="text-[15px] mt-2">
                                            <span className="text-gray-700 font-semibold italic ">Giá chỉ từ </span>
                                            <span className="text-primary font-extrabold text-lg">{event.price}</span>
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 text-gray-600 text-sm">
                                            <Calendar size={16} />
                                            <span>{event.date}</span>
                                        </div>
                                    </div>
                                    <button className="w-full mb-3 mt-3 bg-primary hover:bg-red-600 text-white font-semibold py-3 rounded-[8px] transition shadow-lg">
                                        Mua vé ngay
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Nút Xem thêm */}
                <div className="text-center mt-10 ">
                    <button className="bg-primary text-white text-l border-[3px] border-primary hover:bg-white hover:text-primary font-bold py-4 px-12 rounded-full transition">
                        Xem thêm
                    </button>
                </div>
                {/* CÓ THỂ BẠN THÍCH */}
                <div className="mt-16">

                    {/* Line + title căn giữa */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-full max-w-7xl ">
                            <hr className="border-white border-[3px] mb-4 " />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                            CÓ THỂ BẠN THÍCH
                        </h2>
                    </div>

                    {/* Grid 5 hình */}
                    <div className="grid grid-cols-5 gap-4">
                        {recommended.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
                            >
                                <div className="w-full h-32 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            <Footer />
        </div>
    );
}
export default Search;