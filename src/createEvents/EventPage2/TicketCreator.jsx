import { useState } from "react";
import line13 from "../../Elements/line-13.svg";
import line14 from "../../Elements/line-14.svg";
import { useContext } from "react";
import { EventContext } from '../../context/EventContext';
import { useEffect } from "react";
export default function TicketCreator({ editingTicket, setEditingTicket }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    ticketName: '',
    ticketPrice: '',
    ticketQuantity: '',
    minTickets: '',
    maxTickets: '',
    ticketInfo: '',
  });
  const { setEventData } = useContext(EventContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (editingTicket) {
      // Lấy dữ liệu từ vé đang sửa, điền vào form
      setFormData({
        ticketName: editingTicket.ticketName || '',
        ticketPrice: editingTicket.ticketPrice || '',
        ticketQuantity: editingTicket.ticketQuantity || '',
        minTickets: editingTicket.minTickets || '',
        maxTickets: editingTicket.maxTickets || '',
        ticketInfo: editingTicket.ticketInfo || '',
      });
      // Tự động mở modal
      setShowForm(true);
    }
  }, [editingTicket]);
// Hàm dọn dẹp (để tránh lặp code)
  const closeAndReset = () => {
    setShowForm(false);
    setFormData({ // Reset form về rỗng
      ticketName: '', ticketPrice: '', ticketQuantity: '',
      minTickets: '', maxTickets: '', ticketInfo: '',
    });
    // Quan trọng: Báo cho cha biết là đã sửa xong!
    setEditingTicket(null); 
  };
const handleSubmit = (e) => {
    e.preventDefault(); 
    
    if (editingTicket) {
      // --- TRƯỜNG HỢP 1: ĐANG SỬA (EDIT MODE) ---
      const updatedTicket = {
        ...formData,
        id: editingTicket.id // Giữ lại ID cũ
      };

      setEventData(prevData => {
        // Tạo 1 mảng vé mới
        const newTickets = prevData.tickets.map(ticket => 
          ticket.id === editingTicket.id ? updatedTicket : ticket
        );
        // Trả về state mới với mảng vé đã được cập nhật
        return { ...prevData, tickets: newTickets };
      });

    } else {
      // --- TRƯỜNG HỢP 2: TẠO MỚI (CREATE MODE) ---
      // (Code này giữ nguyên như cũ)
      const newTicket = { ...formData, id: Date.now() };
      setEventData(prevData => {
        const existingTickets = prevData.tickets || [];
        return {
          ...prevData,
          tickets: [...existingTickets, newTicket]
        };
      });
    }

    // 5. Dọn dẹp sau khi Lưu
    closeAndReset();

    // 6. Đóng modal và reset form (như cũ)
    setShowForm(false); 
    setFormData({
      ticketName: '',
      ticketPrice: '',
      ticketQuantity: '',
      minTickets: '',
      maxTickets: '',
      ticketInfo: '',
    });
  };
  return (
    <div>
      {/* Nút mở form */}
     <div
  onClick={() => setShowForm(true)}
  className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
>
  <div className="w-8 h-8 relative bg-[#f94f2f] rounded-2xl">
    <img
      className="absolute top-1 left-[15px] w-0.5 h-[23px]"
      alt="Line"
      src={line13}
    />
    <img
      className="absolute top-[15px] left-1 w-[23px] h-0.5"
      alt="Line"
      src={line14}
    />
  </div>

  <div className="mt-1.5 w-[51px] h-[19px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-base text-center tracking-[0] leading-[normal] whitespace-nowrap">
    Tạo vé
  </div>
</div>


{showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div
            className="bg-[#ffe5e0] w-[950px] rounded-lg shadow-lg p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
          >
          {/* Nút đóng */}
          <button
            onClick={() => setShowForm(false)}
            className="absolute top-3 right-3 text-[#f94f2f] hover:text-[#e13229] bg-transparent border-none outline-none focus:outline-none active:outline-none text-xl font-bold transition-transform hover:scale-110"
          >
            ✕
          </button>



            {/* Tiêu đề */}
          <form className="text-center">
          <h2 className="mt-1.5 mx-auto [font-family:'Inter-Bold',Helvetica] font-bold text-[#f94f2f] text-lg text-center tracking-[0] leading-[normal] whitespace-nowrap">
            Tạo vé
          </h2>

          </form>


            {/* Form */}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}> {/* onSubmit cho form */}
              {/* Dòng 1: Tên vé */}
              <div>
                <label
                  htmlFor="ticketName"
                  className="inline-block bg-[#ffffff] text-[#f94f2f] font-semibold text-sm px-4 py-1 rounded-full text-center"
                >
                  Tên vé
                </label>
                <input
                  id="ticketName"
                  name="ticketName"
                  type="text"
                  placeholder="Nhập tên vé"
                  value={formData.ticketName}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3b30] mt-2"
                />
              </div>


              {/* Dòng 2: Giá vé + Số lượng + Giới hạn */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="ticketPrice"
                    className="inline-block bg-[#ffffff] text-[#f94f2f] font-semibold text-sm px-4 py-1 rounded-full text-center"
                  >
                    Giá vé
                  </label>
                  <input
                    id="ticketPrice"
                    name="ticketPrice"
                    type="text"
                    placeholder="VD: 3.000.000đ"
                    value={formData.ticketPrice}
                    onChange={handleChange}
                    className="w-[150px]  bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3b30] mt-2"
                  />
                </div>


                <div>
                  <label 
                    htmlFor="ticketQuantity" 
                    className="inline-block bg-[#ffffff] text-[#f94f2f] font-semibold text-sm px-4 py-1 rounded-full text-center"
                  >Số lượng vé
                  </label>
                  <input
                    id="ticketQuantity"
                    name="ticketQuantity" // Thêm name
                    type="number"
                    placeholder="VD: 100"
                    value={formData.ticketQuantity}
                    onChange={handleChange}
                    className="w-[150px]  bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3b30] mt-2"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="minTickets" 
                    className="inline-block bg-[#ffffff] text-[#f94f2f] font-semibold text-sm px-4 py-1 rounded-full text-center">
                    Số vé tối thiểu / đơn
                  </label>
                  <input
                    id="minTickets"
                    name="minTickets" // Thêm name
                    type="number"
                    placeholder="VD: 1"
                    value={formData.minTickets}
                    onChange={handleChange}
                    className="w-[150px]  bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3b30] mt-2"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="maxTickets" 
                    className="inline-block bg-[#ffffff] text-[#f94f2f] font-semibold text-sm px-4 py-1 rounded-full text-center">
                    Số vé tối đa / đơn
                  </label>
                  <input
                    id="maxTickets"
                    name="maxTickets" // Thêm name
                    type="number"
                    placeholder="VD: 10"
                    value={formData.maxTickets}
                    onChange={handleChange}
                    className="w-[150px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff3b30] mt-2"
                  />
                </div>
              </div>

              {/* Dòng 3: Thông tin vé */}
              <div>
                <label 
                  htmlFor="ticketInfo" 
                  className="inline-block bg-[#ffffff] text-[#f94f2f] font-semibold text-sm px-4 py-1 rounded-full text-center"
                  >Thông tin vé
                  </label>
                <textarea
                  id="ticketInfo"
                  name="ticketInfo" // Thêm name
                  placeholder="VD: Khu vực dành cho khán giả trên 13 tuổi..."
                  value={formData.ticketInfo}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-[#ff3b30] mt-2"
                />
              </div>

              {/* Nút Lưu */}
              <button
                type="submit" // Đổi thành type="submit" để kích hoạt handleSubmit
                className="bg-[#ff3b30] hover:bg-[#e13229] text-white font-semibold rounded-md py-2 mt-2 transition border-none"
              >
                Lưu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    
  );
}
