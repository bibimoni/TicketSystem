import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import eventsData from "../database/Event";
import { ChevronDownIcon, ChevronUpIcon, ChevronRightIcon } from "lucide-react";

const Info = () => {
    const { eventId } = useParams();
    const [expanded, setExpanded] = useState(false);
    const [openItem, setOpenItem] = useState(null);
    const [event, setEvent] = useState(null);

    useEffect(() => {
        const foundEvent = eventsData.find(e => e.id === eventId);
        setEvent(foundEvent || null);
    }, [eventId]);

    if (!event) return <div className="text-center py-10">Sự kiện không tồn tại hoặc đang tải...</div>;

    // Cắt nội dung mô tả
    const shortText = event.description.slice(0, 300) + "...";

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

                            <p className="font-medium text-secondary text-sm leading-normal whitespace-pre-line">
                                {expanded ? event.description : shortText}
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
                                    src={event.organizationLogo}
                                />
                                <div>
                                    <h3 className="font-bold text-black text-base mb-2">
                                        {event.organizationName}
                                    </h3>
                                    <p className="font-medium text-secondary text-sm">
                                        {event.organizationDesc}
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
                                {event.ticketCategories.map((ticket, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === event.ticketCategories.length - 1;
                                    const isOpen = openItem === ticket.id;

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
                                                    {ticket.price}
                                                </span>

                                                {ticket.soldOut && (
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

                                            {/* DETAILS */}
                                            {ticket.hasDetails && isOpen && (
                                                <div
                                                    className={`px-6 py-4 
                                                                ${isLast ? "rounded-b-[5px]" : ""}
                                                                ${index % 2 === 0 ? "bg-white" : "bg-[#f2f2f2]"}`}
                                                >
                                                    <div className="space-y-2">
                                                        {ticket.details?.map((detail, idx) => (
                                                            <p
                                                                key={idx}
                                                                className="font-bold text-secondary text-base"
                                                            >
                                                                {detail}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* BUTTON */}
                            <div className="flex justify-center">
                                <button className="mt-6 w-40 bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition">
                                    Mua vé ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BANNER */}
                <div className="flex-1 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:800ms]">
                    <img
                        className="bg-white rounded-[10px] border-0"
                        alt="Event Banner"
                        src={event.bannerPortrait} 
                    />
                </div>
            </section>
        </>
    );
};

export default Info;
