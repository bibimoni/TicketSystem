import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

import TicketItem from "../components/TicketItem";

import userService from "../services/userService";
import transactionService from "../services/transactionService";
import logo from "../assets/images/logo-full.png";
import { User, Ticket as TicketIcon, Calendar } from "lucide-react";

function Ticket() {
    const navigate = useNavigate();

    const [user, setUser] = useState({ name: "User", avatar: logo });
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [statusTab, setStatusTab] = useState("all");
    const [timeTab, setTimeTab] = useState("coming");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const profileData = await userService.getProfile();
                const u = profileData.user || profileData;
                setUser({
                    name: u.name || u.username,
                    avatar: u.avatar || logo
                });

                const response = await transactionService.getMyTransactions();
                const rawTransactions = Array.isArray(response) ? response : (response.data || []);

                const mappedTickets = rawTransactions.map(trans => {
                    const firstTicketItem = trans.tickets?.[0];
                    const ticketRoot = firstTicketItem?.ticket || {};
                    const ticketType = ticketRoot.ticket_type || {}; 
                    const eventDetail = ticketType.event || {};      

                    const items = trans.tickets?.map(t => ({
                        ticketTypeName: t.ticket?.ticket_type?.name || "Vé sự kiện",
                        quantity: t.amount || 1,
                        code: t.ticket?.code,
                        ticketPrice: t.ticket?.ticket_type?.price
                    })) || [];

                    return {
                        id: trans.id,
                        status: trans.status,
                        priceBefore : trans.price_before_voucher, 
                        totalAmount: trans.total_price,
                        eventName: eventDetail.name || "Sự kiện chưa cập nhật",
                        eventTime: eventDetail.eventTime,
                        location: eventDetail.destination || "Địa điểm chưa cập nhật",
                        organizer: eventDetail.organzier || eventDetail.organizer || "BTC",
                        items: items
                    };
                });

                setTickets(mappedTickets);

            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statusTabs = [
        { key: "all", label: "Tất cả" },
        { key: "SUCCESS", label: "Thành công" },
        { key: "PENDING", label: "Chờ xử lý" }, 
        { key: "CANCELLED", label: "Đã hủy" }, 
    ];

    const filteredTickets = tickets.filter((t) => {
        // Lọc theo Status
        const matchStatus = statusTab === "all" ? true : t.status === statusTab;

        // Lọc theo Thời gian
        let matchTime = true;
        if (t.eventTime) {
            const eventDate = new Date(t.eventTime);
            const now = new Date();
            if (timeTab === "coming") matchTime = eventDate >= now;
            if (timeTab === "ended") matchTime = eventDate < now;
        } else {
            matchTime = (timeTab === "coming");
        }

        return matchStatus && matchTime;
    });

    const categories = [
        { label: "Thông tin tài khoản", active: false, icon: User, href: "/my-profile" },
        { label: "Vé của tôi", active: true, icon: TicketIcon, href: "/my-ticket" },
        { label: "Sự kiện của tôi", active: false, icon: Calendar, href: "/" },
    ];

    return (
        <div className="flex px-10 py-8 gap-8 bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <aside className="w-[300px] flex flex-col items-center gap-6 bg-white p-6 rounded-xl h-fit shadow-sm">
                <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
                    <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" onError={(e) => e.target.src = logo} />
                </div>
                <span className="font-bold text-secondary text-[15px]">{user.name}</span>

                <nav className="w-full flex flex-col gap-4">
                    {categories.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(item.href)}
                            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left ${
                                item.active ? "bg-primary/10 text-primary" : "hover:bg-gray-100 text-gray-600"
                            }`}
                        >
                            <item.icon className={`w-[20px] h-[20px] ${item.active ? "text-primary" : "text-gray-400"}`} />
                            <span className={`text-sm ${item.active ? "font-extrabold" : "font-semibold"}`}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <section className="flex-1 mr-10">
                <h1 className="font-bold text-primary text-[32px] mb-4">VÉ CỦA TÔI</h1>

                {/* OUTER TAB */}
                <div className="flex w-full bg-white p-1 rounded-full mb-4 shadow-sm border border-gray-200">
                    {statusTabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setStatusTab(t.key)}
                            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                                statusTab === t.key ? "mybg text-white shadow" : "text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <div className="w-full bg-white p-4 rounded-xl shadow-sm mb-6 min-h-[500px]">
                    {/* INNER TAB */}
                    <div className="flex w-full mb-6 border-b border-gray-100">
                        <button
                            onClick={() => setTimeTab("coming")}
                            className={`flex-1 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                timeTab === "coming" ? "border-primary text-primary font-extrabold" : "border-transparent text-gray-600 hover:text-primary"
                            }`}
                        >
                            Sắp diễn ra
                        </button>

                        <button
                            onClick={() => setTimeTab("ended")}
                            className={`flex-1 px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
                                timeTab === "ended" ? "border-primary text-primary font-extrabold" : "border-transparent text-gray-600 hover:text-primary"
                            }`}
                        >
                            Đã kết thúc
                        </button>
                    </div>

                    {/* TICKET LIST */}
                    <div className="flex flex-col gap-6 mx-2">
                        {loading ? (
                            <div className="text-center py-10 text-primary">Đang tải dữ liệu...</div>
                        ) : filteredTickets.length > 0 ? (
                            filteredTickets.map((ticket, idx) => (
                                <TicketItem key={ticket.id || idx} ticket={ticket} mode={timeTab} />
                            ))
                        ) : (
                            <div className="relative flex flex-col items-center justify-center gap-3 py-10">
                                <img
                                    className="w-[300px] h-[180px] object-cover opacity-50 rounded-full"
                                    src={logo}
                                    alt="empty"
                                />
                                <div className="text-lg text-gray-500 font-medium text-center">
                                    {statusTab === 'all' 
                                        ? "Bạn chưa có vé nào trong mục này." 
                                        : `Không có vé nào ở trạng thái "${statusTabs.find(s=>s.key===statusTab)?.label}"`}
                                </div>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="bg-primary text-white text-lg border-[3px] border-primary hover:bg-white hover:text-primary font-bold py-3 px-10 rounded-full transition-all duration-300"
                                >
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