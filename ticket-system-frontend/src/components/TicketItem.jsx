import React from "react";
import { MessageCircle } from "lucide-react";

function TicketItem({ ticket, mode }) {
    const isEventEnded = mode === "ended";

    const dateStr = ticket.eventTime
        ? new Date(ticket.eventTime).toLocaleDateString("vi-VN", {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : "Chưa xác định ngày";

    // Giá tổng 
    const priceStr = ticket.totalAmount
        ? Number(ticket.totalAmount).toLocaleString("vi-VN") + " đ"
        : "0 đ";

    const getStatusText = (status) => {
        switch (status) {
            case "SUCCESS": return "Thanh toán thành công";
            case "PAID": return "Thanh toán thành công";
            case "PENDING": return "Chờ thanh toán";
            case "CANCELLED": return "Đã hủy";
            case "FAILED": return "Thất bại";
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "SUCCESS":
            case "PAID":
                return "border-green-500 text-green-500 bg-white";
            case "PENDING":
                return "border-yellow-500 text-yellow-500 bg-white";
            case "CANCELLED":
                return "border-red-500 text-red-500 bg-white";
            case "FAILED":
                return "border-red-500 text-red-500 bg-white";
            default:
                return "border-gray-200 text-white";
        }
    };

    const groupedItems = React.useMemo(() => {
        if (!ticket.items) return [];
        
        const groupedMap = ticket.items.reduce((acc, item) => {
            const key = item.ticketTypeName;
            
            if (acc[key]) {
                acc[key].quantity += item.quantity;
            } else {
                acc[key] = { ...item };
            }
            return acc;
        }, {});

        return Object.values(groupedMap);
    }, [ticket.items]);

    return (
        <div className="grid grid-cols-12 shadow-sm transition-all duration-300 p-0 rounded-2xl mybg relative overflow-hidden text-white group min-h-[180px]">

            {/* LEFT SECTION */}
            <div className="col-span-8 p-5 flex flex-col justify-between border-white/40 relative">

                {/* Header */}
                <div>
                    <div className="flex items-start gap-3">
                        <div className="bg-white h-8 w-2 mt-1 rounded-full"></div>
                        <div className="flex-1 overflow-hidden">
                            <h3 className="font-extrabold text-xl uppercase leading-tight truncate pr-2" title={ticket.eventName}>
                                {ticket.eventName}
                            </h3>
                            <p className="text-xs font-medium text-white/70 uppercase tracking-wider mt-1 truncate">
                                {ticket.organizer}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-[1.5px] bg-white my-2"></div>

                {/* Body */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                        <div className="text-xs text-white uppercase font-bold">Loại vé</div>
                        <div className="flex flex-col gap-1">
                            {groupedItems && groupedItems.length > 0 ? (
                                groupedItems.map((item, i) => {
                                    const itemPrice = item.ticketPrice
                                        ? Number(item.ticketPrice).toLocaleString("vi-VN") + " đ" 
                                        : "0 đ";

                                    return (
                                        <div key={i} className="text-sm font-semibold flex items-center justify-between pr-4">
                                            <div className="flex flex-col truncate mr-2">
                                                <span className="truncate text-yellow-200" title={item.ticketTypeName}>
                                                    {item.ticketTypeName}
                                                </span>
                                                <span className="text-[10px] text-white/70 font-normal">
                                                    {itemPrice} / vé
                                                </span>
                                            </div>
                                            
                                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs text-white whitespace-nowrap">
                                                x{item.quantity}
                                            </span>
                                        </div>
                                    );
                                })
                            ) : (
                                <span className="italic opacity-70">Vé đã ẩn</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 text-right">
                        <div className="text-xs text-white uppercase font-bold">Thời gian & Địa điểm</div>
                        <div>
                            <div className="font-bold text-white text-yellow-200">{dateStr}</div>
                            <div className="text-xs text-white/80 truncate mt-0.5" title={ticket.location}>
                                {ticket.location}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- RIGHT SECTION --- */}
            <div className="col-span-4 p-4 flex flex-col items-center justify-center gap-4 text-center ml-8">

                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(ticket.status)}`}>
                    {getStatusText(ticket.status)}
                </span>

                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-white uppercase">Tổng thanh toán</span>
                    <span className="font-extrabold text-3xl text-yellow-300">
                        {priceStr}
                    </span>
                </div>

                <span
                    className={`px-4 py-1.5 text-xs rounded-full font-bold shadow-lg ring-2 ring-white/20 ${!isEventEnded
                            ? "bg-white text-myred"
                            : "bg-gray-600 text-white"
                        }`}
                >
                    {!isEventEnded ? "Sắp diễn ra" : "Đã kết thúc"}
                </span>
            </div>

            {/* DECORATION */}
            <div className="absolute -top-4 left-[70%] w-8 h-8 bg-white rounded-full z-10 -translate-x-1/2"></div>
            <div className="absolute top-0 bottom-0 left-[70%] border-l-4 border-dashed border-white z-0 -translate-x-1/2"></div>
            <div className="absolute -bottom-4 left-[70%] w-8 h-8 bg-white rounded-full z-10 -translate-x-1/2"></div>
        </div>
    );
}

export default TicketItem;