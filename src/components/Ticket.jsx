import React, { useState } from "react";
import { User, Ticket as TicketIcon, Calendar } from "lucide-react";
import userData from "../database/User";
import TicketItem from "../components/TicketItem";
import logo from "../assets/images/logo-full.png"
import myTickets from "../database/MyTicket";

function Ticket() {
    // State
    const [statusTab, setStatusTab] = useState("all"); // Outer tab: all/pending/success/cancel
    const [timeTab, setTimeTab] = useState("coming"); // Inner tab: coming/ended

    // Sidebar categories
    const categories = [
        { label: "Thông tin tài khoản", icon: User, active: false },
        { label: "Vé của tôi", icon: TicketIcon, active: true },
        { label: "Sự kiện của tôi", icon: Calendar, active: false },
    ];

    

    // Tabs
    const statusTabs = [
        { key: "all", label: "Tất cả vé" },
        { key: "pending", label: "Chờ xử lý" },
        { key: "success", label: "Thành công" },
        { key: "cancel", label: "Đã hủy" },
    ];

    // Filter tickets based on tab
    const filteredTickets = myTickets.filter(
        (t) => (statusTab === "all" ? true : t.state === statusTab) && t.status === timeTab
    );

    return (
        <div className="flex px-10 py-8 gap-8">
            {/* SIDEBAR */}
            <aside className="w-[300px] flex flex-col items-center gap-6">
                <img src={userData.avatar} className="w-20 h-20 rounded-full" alt="avatar" />
                <span className="font-bold text-secondary text-[15px]">{userData.name}</span>

                <nav className="w-full flex flex-col gap-4">
                    {categories.map((item, index) => (
                        <button
                            key={index}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${item.active ? "bg-white/50" : "hover:bg-white/30"
                                }`}
                        >
                            <item.icon className="w-[25px] h-[25px] text-primary" />
                            <span
                                className={`text-sm ${item.active ? "font-extrabold" : "font-semibold"
                                    } text-primary`}
                            >
                                {item.label}
                            </span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* DIVIDER */}
            <div className="w-[2px] bg-black/20"></div>

            {/* MAIN */}
            <section className="flex-1 mr-10">
                <h1 className="font-bold text-primary text-[32px] mb-4">VÉ CỦA TÔI</h1>

                {/* OUTER TAB: Status */}
                <div className="flex w-full bg-gray-200 p-2 rounded-full mb-4">
                    {statusTabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setStatusTab(t.key)}
                            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold ${statusTab === t.key ? "bg-primary text-white" : "text-gray-600"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="w-full bg-white p-2 rounded-lg mb-6">
                    {/* INNER TAB: Coming / Ended */}
                    <div className="flex w-full mb-6">
                        <button
                            onClick={() => setTimeTab("coming")}
                            className={`flex-1 px-6 py-2 text-sm font-semibold ${timeTab === "coming" ? "text-primary font-extrabold" : "text-gray-600"
                                }`}
                        >
                            Sắp diễn ra
                        </button>

                        <button
                            onClick={() => setTimeTab("ended")}
                            className={`flex-1 px-6 py-2 rounded-full text-sm font-semibold ${timeTab === "ended" ? "text-primary font-extrabold" : "text-gray-600"
                                }`}
                        >
                            Đã kết thúc
                        </button>
                    </div>
                    {/* TICKET LIST */}
                    <div className="flex flex-col gap-6 mx-5">
                        {filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket, idx) => (
                                <TicketItem key={idx} ticket={ticket} mode={timeTab} />
                            ))
                        ) : (
                            <div className="relative flex flex-col items-center justify-center gap-3 mb-3">
                                <img
                                    className="w-[300px] h-[150px] rounded-xl object-cover opacity-50"
                                    src={logo}
                                    alt="logo"
                                />
                                <div className="text-lg text-gray-700 font-bold text-center">
                                    Bạn chưa có vé nào
                                </div>
                                <button className="bg-primary text-white text-lg border-[3px] border-primary hover:bg-white hover:text-primary font-bold py-4 px-12 rounded-full transition">
                                    MUA VÉ NGAY
                                </button>
                            </div>

                        )}
                    </div>

                </div>



            </section>
        </div>
    );
}

export default Ticket;
