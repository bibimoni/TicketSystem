// src/components/Info.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from "lucide-react";
import defaultAvatar from "../assets/images/default_img.png";

const Info = ({ eventData }) => {
    const [expanded, setExpanded] = useState(false);
    const [openItem, setOpenItem] = useState(null);

    if (!eventData) return <div className="text-center py-10">Đang tải thông tin...</div>;

    const description = eventData.description || "Đang cập nhật mô tả...";
    const shortText = description.slice(0, 300) + (description.length > 300 ? "..." : "");

    const toggle = (id) => {
        setOpenItem(openItem === id ? null : id);
    };

    return (
        <>
            <section className="px-[122px] py-8 flex gap-8">
                {/* GIỚI THIỆU */}
                <div className="flex-[2] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
                    <div className="bg-white rounded-[10px] border-0">
                        <div className="p-6">
                            <h2 className="font-bold text-primary text-2xl mb-4">
                                GIỚI THIỆU
                            </h2>

                            <p className="font-medium text-secondary text-sm leading-normal whitespace-pre-line text-justify">
                                {expanded ? description : shortText}
                            </p>

                            {/* Nút xem thêm */}
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => setExpanded(!expanded)}
                                    className="mt-3 text-primary font-semibold text-sm hover:underline"
                                >
                                    {expanded ? <ChevronUpIcon size={30} /> : <ChevronDownIcon size={30} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ĐƠN VỊ TỔ CHỨC */}
                <div className="flex-1 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
                    <div className="bg-white rounded-[10px] border-0">
                        <div className="p-6">
                            <h2 className="font-bold text-primary text-2xl mb-4">
                                Đơn vị tổ chức
                            </h2>

                            <div className="flex items-start gap-4">
                                <img
                                    className="w-[100px] h-[100px] object-cover rounded-full border-grey border-[2px]"
                                    alt="Organization Logo"
                                    src={defaultAvatar}
                                />
                                <div>
                                    <h3 className="font-bold text-black text-base mb-2">
                                        {eventData.organizer}
                                    </h3>
                                    <p className="font-medium text-secondary text-sm">
                                        Đối tác chính thức của TickeZ
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="px-[122px] py-8 flex gap-8">
                {/* THÔNG TIN VÉ */}
                <div className="flex-[2] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:1000ms]">
                    <div className="bg-secondary rounded-[10px] border-0">
                        <div className="p-6">

                            {/* HEADER */}
                            <div className="flex items-center gap-2 mb-6">
                                <h2 className="font-extrabold text-white text-2xl">
                                    Thông tin vé
                                </h2>
                            </div>

                            {/* LIST */}
                            <div className="space-y-0">
                                {eventData.ticketTypes && eventData.ticketTypes.map((ticket, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === eventData.ticketTypes.length - 1;
                                    const isOpen = openItem === ticket.id;
                                    const isSoldOut = ticket.remaining <= 0;

                                    return (
                                        <div key={ticket.id} className="border-0">
                                            {/* ITEM HEADER */}
                                            <div
                                                onClick={() => ticket.hasDetails && toggle(ticket.id)}
                                                className={`
                                                    px-6 py-4 cursor-pointer select-none relative
                                                    ${index % 2 === 0 ? "bg-white" : "bg-[#f2f2f2]"}
                                                    ${isFirst ? "rounded-t-[5px]" : ""}
                                                    ${isLast && !ticket.hasDetails ? "rounded-b-[5px]" : ""}
                                                    flex items-center justify-between
                                                `}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <ChevronRightIcon
                                                        className={`w-[25px] h-[30px] text-secondary transition-transform duration-200
                                                            ${isOpen ? "rotate-90" : ""}`}
                                                    />
                                                    <span className="font-bold text-secondary text-base">
                                                        {ticket.name}
                                                    </span>
                                                </div>

                                                <span className="font-extrabold text-primary text-xl mr-10">
                                                    {ticket.price.toLocaleString("vi-VN")} đ
                                                </span>

                                                {isSoldOut && (
                                                    <div
                                                        className={`
                                                            absolute top-0 right-0
                                                            bg-primary text-white
                                                            rounded-bl-[5px]
                                                            w-[55px] h-[25px]
                                                            flex items-center justify-center
                                                            text-[9px] font-bold
                                                            ${index === 0 ? "rounded-tr-[5px]" : ""}`}
                                                    >
                                                        Hết vé
                                                    </div>
                                                )}
                                            </div>

                                            {/* DETAILS  */}
                                            {isOpen && (
                                                <div
                                                    className={`px-6 py-4 
                                                                ${isLast ? "rounded-b-[5px]" : ""}
                                                                ${index % 2 === 0 ? "bg-white" : "bg-[#f2f2f2]"}`}
                                                >
                                                    <div className="space-y-2">
                                                        <p className="font-bold text-secondary text-base">
                                                            Mô tả vé chưa cập nhật
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* BUTTON */}
                            <div className="flex justify-center">
                                <Link to={`/booking/${eventData.id}`}>
                                    <button className="mt-6 w-40 bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition text-white text-lg border-[3px] border-primary hover:bg-white hover:text-primary">
                                        Mua vé ngay
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BANNER */}
                <div className="flex-1 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
                    <img
                        className="bg-white rounded-[10px] border-0 w-full object-cover"
                        alt="Event Banner"
                        src={eventData.banner}
                        onError={(e) => { e.target.src = { defaultAvatar } }}
                    />
                </div>
            </section>
        </>
    );
};

export default Info;