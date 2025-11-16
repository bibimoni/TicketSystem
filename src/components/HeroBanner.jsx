import feature1 from "../assets/images/feature3.jpg";
import React, { useState } from "react";

const HeroBanner = () => {
    // Dữ liệu sự kiện nổi bật – 2 sự kiện cho 2 ô
    const featuredEvents = [
        {
            id: 1,
            title: "G-DRAGON IN HANOI WORLD TOUR",
            subtitle: "NOV 08 SAT 2025 WONDER OCEAN CITY",
            date: "14-15/06/2025",
            image: feature1,
        },
        {
            id: 2,
            title: "VIETNAMESE",
            subtitle: "HOÀNG THÙY LINH",
            date: "NOV 08 SAT 2025 WONDER OCEAN CITY",
            image: feature1,
        },
        {
            id: 3,
            title: "NIỀM VUI CỦA CHÚNG TA",
            subtitle: "NOV 08 SAT 2025 WONDER OCEAN CITY",
            image: feature1,
        },
        {
            id: 4,
            title: "TAYLOR SWIFT ERAS TOUR",
            subtitle: "2025 HANOI",
            image: feature1,
        },
        {
            id: 5,
            title: "BLACKPINK CONCERT",
            subtitle: "2025 HO CHI MINH",
            image: feature1,
        },
    ];

    const rightEvents = [
        {
            id: 1,
            title: "ANH TRAI VƯỢT NGÀN CHỐNG GAI",
            subtitle: "NOV 08 SAT 2025 WONDER OCEAN CITY",
            date: "14-15/06/2025",
            image: feature1,
        },
        {
            id: 2,
            title: "VIETNAMESE",
            subtitle: "HOÀNG THÙY LINH",
            date: "NOV 08 SAT 2025 WONDER OCEAN CITY",
            image: feature1,
        },
    ];
    // State cho carousel
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredEvents.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredEvents.length) % featuredEvents.length);
    };

    return (
        <div className="flex-grow py-8">
            {/* BANNER SỰ KIỆN NỔI BẬT */}
            <section className="w-full bg-gradient-to-b from-primary/5 to-gray-100 relative">
                <div className="max-w-7xl mx-auto px-4">

                    {/* 2 Ô KẾ BÊN – TRÁI LỚN (8/12 cột), PHẢI NHỎ (4/12 cột) */}
                    <div className="grid grid-cols-12 gap-4">
                        {/* Ô TRÁI – LỚN HƠN */}
                        <div className="relative col-span-8 ">
                            {/* Hình hiện tại */}
                            <div className="bg-cover bg-center rounded-lg shadow-2xl overflow-hidden cursor-pointer group relative">
                                <img
                                    src={featuredEvents[currentIndex].image}
                                    alt={featuredEvents[currentIndex].title}
                                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 group-hover:to-black/40 transition-all duration-300"></div>

                                {/* Nội dung text */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-2">{featuredEvents[currentIndex].title}</h3>
                                    <p className="text-sm opacity-90 mb-4">{featuredEvents[currentIndex].subtitle}</p>

                                </div>

                                {/* Dots indicators */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                    {featuredEvents.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentIndex(index)}
                                            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* NÚT TRÁI/PHẢI – GIỮA HÌNH */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 text-white transition-all"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Ô PHẢI – 2 Ô NHỎ TRÊN DƯỚI */}
                        <div className="col-span-4 grid grid-rows-2 gap-4">
                            {/* Ô NHỎ TRÊN */}
                            <div className="row-span-2 relative bg-cover bg-center rounded-lg shadow-2xl overflow-hidden cursor-pointer group ">
                                <img
                                    src={rightEvents[0].image}
                                    alt={rightEvents[0].title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            {/* Ô NHỎ DƯỚI */}
                            <div className="row-span-2 relative bg-cover bg-center rounded-lg shadow-2xl overflow-hidden cursor-pointer group">
                                <img
                                    src={rightEvents[1].image}
                                    alt={rightEvents[1].title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                    </div>

                </div>
            </section>
        </div>
    );
};
export default HeroBanner;