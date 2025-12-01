import { MessageCircle } from "lucide-react";

function TicketItem({ ticket, mode }) {
    const isComing = mode === "coming";

    const dateStr = ticket.eventTime 
        ? new Date(ticket.eventTime).toLocaleDateString("vi-VN", {
            weekday: 'short', day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        : "Chưa xác định ngày";

    const priceStr = ticket.totalAmount 
        ? Number(ticket.totalAmount).toLocaleString("vi-VN") + " đ" 
        : "0 đ";

    const getStatusText = (status) => {
        switch (status) {
            case "PAID": return "Thanh toán thành công";
            case "PENDING": return "Chờ thanh toán";
            case "CANCELLED": return "Đã hủy";
            case "FAILED": return "Thất bại";
            default: return status;
        }
    };

    return (
        <div className="grid grid-cols-12 shadow-md hover:shadow-xl transition-shadow duration-300 p-5 rounded-[10px] bg-primary relative overflow-hidden text-white group">
            {/* LEFT SECTION */}
            <div className="col-span-8 flex flex-col gap-2 mr-4 border-r border-white/30 pr-4">
                {/* Tên sự kiện */}
                <div className="flex items-center">
                    <div className="bg-white h-7 w-2 mr-4 rounded-sm"></div>
                    <div className="font-extrabold text-xl uppercase truncate leading-tight" title={ticket.eventName}>
                        {ticket.eventName}
                    </div>
                </div>
                
                <div className="bg-white/50 h-[1px] w-full my-2"></div>

                <div className="grid grid-cols-12 items-start text-sm">
                    {/* Danh sách vé */}
                    <div className="col-span-4 font-bold space-y-1">
                        {ticket.items && ticket.items.length > 0 ? (
                            ticket.items.map((item, i) => (
                                <div key={i} className="truncate text-yellow-300">
                                    {item.ticketTypeName} <span className="text-white">x{item.quantity}</span>
                                </div>
                            ))
                        ) : (
                            <span>Không có thông tin vé</span>
                        )}
                    </div>

                    {/* Trạng thái thanh toán */}
                    <div className="col-span-3 flex flex-col items-center justify-center">
                        <span className={`font-bold px-2 py-1 rounded text-xs border ${
                            ticket.status === 'PAID' ? 'border-green-400 text-green-100' : 'border-yellow-400 text-yellow-100'
                        }`}>
                            {getStatusText(ticket.status)}
                        </span>
                    </div>

                    {/* Thời gian & Địa điểm */}
                    <div className="col-span-5 text-right space-y-1">
                        <div className="font-semibold">{dateStr}</div>
                        <div className="truncate opacity-90 text-xs" title={ticket.location}>
                             {ticket.location}
                        </div>
                    </div>
                </div>

                {ticket.status === 'PAID' && (
                    <button className="flex items-center gap-2 text-white/80 hover:text-white hover:underline mt-2 w-fit text-xs transition-colors">
                        <MessageCircle size={14} />
                        Viết đánh giá
                    </button>
                )}
            </div>

            {/* RIGHT SECTION  */}
            <div className="col-span-3 flex flex-col items-center justify-center gap-3 text-center pl-2">
                <div className="font-semibold text-xs italic opacity-80 uppercase tracking-widest">
                    {ticket.organizer}
                </div>
                
                <div className="font-extrabold text-3xl text-yellow-300 drop-shadow-sm">
                    {priceStr}
                </div>

                <span
                    className={`px-4 py-1 text-xs rounded-full font-bold shadow-sm ${
                        isComing 
                        ? "bg-white text-primary" 
                        : "bg-gray-600 text-gray-200"
                    }`}
                >
                    {isComing ? "Sắp diễn ra" : "Đã kết thúc"}
                </span>
            </div>

            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full"></div>
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full"></div>
        </div>
    );
}

export default TicketItem;