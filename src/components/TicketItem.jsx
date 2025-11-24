import { MessageCircle } from "lucide-react";

function TicketItem({ ticket, mode }) {
    const isComing = mode === "coming";

    return (
        <div className="grid grid-cols-12 shadow-sm p-5 rounded-[5px] bg-primary relative overflow-hidden">
            {/* LEFT - 70% */}
            <div className="col-span-8 text-white flex flex-col gap-2 mr-4">
                <div className="flex">
                    <div className="bg-white h-7 w-3 mr-4"></div>
                    <div className="font-extrabold text-lg">{ticket.title}</div>
                </div>
                <div className="bg-white h-0.5 w-full"></div>

                <div className="grid grid-cols-12 items-center italic pt-3">
                    <div className="col-span-4"></div>

                    <div className="col-span-3 font-bold text-center">{ticket.type}</div>

                    <div className="col-span-5 text-sm text-white text-right">
                        <div>{ticket.date}</div>
                        <div>{ticket.location}</div>
                    </div>
                </div>

                <button className="flex items-center gap-2 text-white">
                    <MessageCircle size={18} />
                    Đánh giá
                </button>
            </div>

            <div className="border-l-4 border-white border-dashed self-stretch mx-4"></div>

            {/* RIGHT - 30% */}
            <div className="col-span-3 flex flex-col items-center justify-center gap-2">
                <span className="font-semibold text-white text-l italic">{ticket.organizationName}</span>
                <span className="font-extrabold text-white text-4xl mt-4 mb-4">{ticket.price}</span>
                <span
                    className={`px-4 py-1 text-xs rounded-full font-bold ${isComing ? "bg-white text-primary" : "bg-gray-200 text-gray-600"
                        }`}
                >
                    {isComing ? "Sắp diễn ra" : "Đã kết thúc"}
                </span>


            </div>
        </div>
    );
}

export default TicketItem;
