// src/components/Booking.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsTicketPerforatedFill } from "react-icons/bs";
import { Minus, Plus, InfoIcon } from "lucide-react";

import BackButton from "../components/BackButton";

import eventService from "../services/eventService";

const Booking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState([]);

  // Fetch sự kiện
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await eventService.getEventById(eventId);
        const data = response.data || response; // Handle response wrapper

        if (data) {
          setEventData(data);
          const types = data.ticketTypes || [];
          setQuantities(new Array(types.length).fill(0));
        }
      } catch (error) {
        // console.error("Lỗi tải thông tin sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleIncrement = (index) => {
    const newQuantities = [...quantities];
    const ticket = eventData.ticketTypes[index];
    if (ticket.remaining !== undefined && newQuantities[index] >= ticket.remaining) {
      return; 
    }
    newQuantities[index] += 1;
    setQuantities(newQuantities);
  };

  const handleDecrement = (index) => {
    const newQuantities = [...quantities];
    if (newQuantities[index] > 0) newQuantities[index] -= 1;
    setQuantities(newQuantities);
  };

  const handleContinue = () => {
    const totalTickets = quantities.reduce((sum, qty) => sum + qty, 0);
    if (totalTickets === 0) {
      alert("Vui lòng chọn ít nhất 1 vé!");
      return;
    }

    const selectedTickets = eventData.ticketTypes
      .map((ticket, index) => ({
        ...ticket,
        quantity: quantities[index],
        price: ticket.amount || ticket.price,
        name: ticket.name
      }))
      .filter((ticket) => ticket.quantity > 0);

    navigate(`/question-form/${eventId}`, { state: { selectedTickets, eventData } });
  };

  if (loading) return <div className="text-center py-10 font-bold text-primary">Đang tải thông tin vé...</div>;
  if (!eventData) return <div className="text-center py-10 text-primary font-bold">Sự kiện không tồn tại</div>;

  const ticketTypes = eventData.ticketTypes || [];
  const totalTickets = quantities.reduce((sum, qty) => sum + qty, 0);

  // Helper format tiền
  const formatPrice = (price) => {
    if (typeof price === 'number') return price.toLocaleString("vi-VN") + " đ";
    return price;
  }

  return (
    <div className="min-h-screen w-full overflow-x-auto">
      <div className="min-w-[1440px]">
        <main className="px-[122px] py-8">
          <BackButton className="mb-4" />

          <div className="grid grid-cols-12  w-full relative gap-5">
            {/* LEFT content */}
            <section className="relative col-span-8">
              <div className="bg-white rounded-[10px] p-7 shadow-none">
                <div className="flex justify-between mb-6">
                  <h2 className="font-bold text-primary text-xl">Hạng vé</h2>
                  <h2 className="font-bold text-primary text-xl">Số lượng</h2>
                </div>

                <div className="space-y-4">
                  {ticketTypes.map((ticket, index) => {
                    
                    const isSoldOut = ticket.remaining <= 0;

                    return (
                      <div
                        key={ticket.id}
                        className="relative bg-[#d9d9d9] rounded-[10px] p-5"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-secondary text-lg mb-2">
                              {ticket.name}
                            </h3>
                            <p className="font-extrabold text-primary text-xl">
                              {formatPrice(ticket.amount)}
                            </p>
                            {/* <p className="text-xs italic text-gray-500 mt-1">
                              Còn lại: {ticket.remaining} vé
                            </p> */}
                          </div>

                          <div className="flex items-center gap-3">
                            {isSoldOut ? (
                              <div className="absolute bg-primary top-0 right-0 text-white rounded-[0px_10px_0px_10px] h-[30px] px-4 flex items-center">
                                <span className="font-bold text-sm">Hết vé</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 bg-white rounded-[20px] px-3 py-1">
                                <button onClick={() => handleDecrement(index)}>
                                  <Minus className="w-3.5 h-3.5 text-primary" />
                                </button>

                                <span className="font-bold text-primary text-sm min-w-[20px] text-center">
                                  {quantities[index]}
                                </span>

                                <button onClick={() => handleIncrement(index)}>
                                  <Plus className="w-3.5 h-3.5 text-primary" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Hiển thị mô tả vé nếu có */}
                      {ticket.description && (
                        <div className="bg-white rounded-[10px] p-4">
                          <div className="flex items-start gap-2">
                            <InfoIcon className="w-5 h-5 mt-0.5 text-primary" />
                            <div className="font-medium text-secondary text-sm">
                                {ticket.description}
                            </div>
                          </div>
                        </div>
                      )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* RIGHT SIDEBAR */}
            <aside className="relative col-span-4">
              <div className="bg-secondary rounded-[10px]">
                <div className="bg-secondary rounded-t-[10px] p-6">
                  <h2 className="font-extrabold text-white text-xl text-center">
                    {eventData.name}
                  </h2>
                </div>

                <div className="h-0.5 bg-white mx-6" />

                <div className="bg-white rounded-[10px] m-6 p-6">
                  <h3 className="font-bold text-primary text-xl text-center mb-6">
                    Bảng giá vé
                  </h3>

                  <div className="space-y-4">
                    {ticketTypes.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="font-bold text-secondary text-base">
                          {item.name}
                        </span>
                        <span className="font-extrabold text-primary text-base">
                          {formatPrice(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 mb-6">
                  <div className="flex gap-3">
                    <BsTicketPerforatedFill className="w-15 text-white" />
                    <p className="font-extrabold text-sm">
                      <span className="text-white">Đã chọn: </span>
                      <span className="text-primary">{totalTickets} vé</span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button className="mt-6 w-40 bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition mb-6"
                          onClick={handleContinue}
                  >
                    TIẾP TỤC
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Booking;
