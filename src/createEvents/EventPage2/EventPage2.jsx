import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from "react";
import { EventContext } from '../../context/EventContext';
import { QlementineIconsMoney16 } from "../../Elements/QlementineIconsMoney16";
import { Calendar } from "../../Elements/Calendar";
import rectangle7 from "../../Elements/rectangle-7.png";
import rectangle212 from "../../Elements/rectangle-21-2.png";
import TicketCreator from "./TicketCreator";
import rectangle622 from "../../Elements/rectangle-62.png";
import rectangle62 from "../../Elements/rectangle-62.png";
import rectangle53 from "../../Elements/rectangle-53.svg";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useContext } from "react";
import rectangle56 from "../../Elements/rectangle-56.svg";
import rectangle57 from "../../Elements/rectangle-57.svg";
import rectangle58 from "../../Elements/rectangle-58.svg";
import ticke12 from "../../Elements/ticke-1-2.png";
import TICKETZ_LOGO from '../../Elements/ticketZ.png';
import OrganizerHeader from "../../information/OrganizerHeader";
import AdminHeader from "../../information/AdminHeader";
import { FiHome } from "react-icons/fi";

// const formatToDateTimePicker = (dateTimeString) => {
//   if (!dateTimeString || !dateTimeString.includes(' ')) return '';
  
//   const parts = dateTimeString.split(' '); // ["HH:mm", "DD/MM/YYYY"]
//   if (parts.length !== 2) return '';

//   const time = parts[0];
//   const dateParts = parts[1].split('/'); // ["DD", "MM", "YYYY"]
  
//   if (dateParts.length !== 3) return '';
  
//   const [day, month, year] = dateParts;
//   // Trả về định dạng "YYYY-MM-DDTHH:mm"
//   return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`;
// };

// /**
//  * Chuyển "YYYY-MM-DDTHH:mm" (từ input) sang "HH:mm DD/MM/YYYY" (lưu vào Context)
//  */
// const formatFromDateTimePicker = (pickerString) => {
//   if (!pickerString || !pickerString.includes('T')) return '';
  
//   const parts = pickerString.split('T'); // ["YYYY-MM-DD", "HH:mm"]
//   if (parts.length !== 2) return '';

//   const time = parts[1];
//   const dateParts = parts[0].split('-'); // ["YYYY", "MM", "DD"]
  
//   if (dateParts.length !== 3) return '';
  
//   const [year, month, day] = dateParts;
//   // Trả về định dạng "HH:mm DD/MM/YYYY"
//   return `${time} ${day}/${month}/${year}`;
// };

export const EventPage2 = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { eventData, setEventData } = useContext(EventContext);
  const { eventId } = useParams();
  
  const handleStepClick = (step) => {
    // Nếu đang ở Admin xem chi tiết
    if (isAdmin) {
       navigate(`/admin/duyet-su-kien/${eventId}/buoc-${step}`);
    } 
    // Nếu đang chỉnh sửa sự kiện cũ
    else if (eventId) {
       navigate(`/event-edit/${eventId}/buoc-${step}`);
    } 
    // Nếu đang tạo mới
    else {
        navigate(`/tao-su-kien/buoc-${step}`);
    }
  };

  const handleContinueClick = () => {
    if (isAdmin) {
        navigate(`/admin/duyet-su-kien/${eventId}/buoc-3`);
    }
    else {
      if (eventId) {
        navigate(`/event-edit/${eventId}/buoc-3`);
      } else {
        navigate('/tao-su-kien/buoc-3');
      }
    }
  };
  const [editingTicket, setEditingTicket] = useState(null);
  const handleDeleteTicket = (ticketId) => {
    const updatedTickets = eventData.tickets.filter(t => t.id !== ticketId);
    setEventData(prev => ({
      ...prev,
      tickets: updatedTickets
    }));
  };
  const handleEditClick = (ticketToEdit) => {
    setEditingTicket(ticketToEdit); 
    // Khi set state này, TicketCreator (con) sẽ nhận được và tự động mở modal
  };
  return (
    <div className="bg-[#d9d9d9] overflow-hidden border border-solid border-[#d9d9d9] w-full min-w-[1440px] min-h-[1905px] relative">

      {/* Sidebar và Header */}
      <div className="absolute top-[72px] left-[267px] w-[1500px] h-[1439px] bg-[#fff8f7]" />
      <div className="absolute top-0 left-0 w-[272px] h-[1511px] bg-[#f94f2f]" />
      <img className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]" alt="Rectangle" src={rectangle7} />
      
      {/* Nút Lưu */}
      {/* <div className="absolute top-[85px] left-[1206px] w-[102px] h-[45px]">
        <img className="absolute top-0 -left-1 w-[108px] h-[53px]" alt="Rectangle" src={rectangle202} />
        <img className="absolute top-0 -left-1 w-[108px] h-[53px]" alt="Rectangle" src={rectangle21} />
        <div className="absolute top-[15px] left-[38px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Lưu
        </div>
      </div> */}

      {/* Nút Tiếp tục */}
      <div 
            className="absolute top-[85px] left-[1320px] w-[102px] h-[45px] cursor-pointer" // Thêm cursor-pointer
            onClick={handleContinueClick} // Gán sự kiện onClick vào đây
          >
            <img
              className="absolute top-0 -left-1 w-[108px] h-[53px]"
              alt="Rectangle"
              src={rectangle212} // Đảm bảo rectangle212 đã được import đúng
            />
            <div className="absolute top-[15px] left-[25px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#ffffff] text-xs text-center tracking-[0] leading-[normal]">
              Tiếp tục
            </div>
      </div>

      {/* Logo và Sidebar */}
      <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
        <img
          className="absolute top-0 left-0 w-[63px] h-[63px] object-contain" // <-- Điều chỉnh lại class
          alt="ticketZ Logo"
          src={TICKETZ_LOGO}
        />
      </div>

      <div 
        onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/su-kien-cua-toi')} 
        className="absolute top-[27px] left-[89px] [font-family:'Moul-Regular',Helvetica] font-normal text-white text-xl text-center tracking-[0] leading-[15px] cursor-pointer">
        {isAdmin ? "Admin" : "Organizer"} <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; center
      </div>
      
            

      {/* Header */}
      {!isAdmin && (
          <div className="mt-[17px] w-[102px] h-[45px] relative ml-[989px]">
          <button
              onClick={() => navigate('/')} 
              className="flex items-center justify-center w-[108px] h-[45px] rounded-full bg-[#FF5331] text-white text-xs font-semibold [font-family:'Montserrat-SemiBold',Helvetica] shadow-[0_4px_8px_rgba(0,0,0,0.25)] border-none outline-none"
          >
              Tạo sự kiện
          </button>
          </div>
      )}

      {isAdmin ? <AdminHeader /> : <OrganizerHeader />}
      {/* Thanh bước */}
      {/* --- BƯỚC 1: Thông tin sự kiện --- */}
      <div 
        onClick={() => handleStepClick(1)} // <--- Thêm sự kiện click
        className="absolute top-[88px] left-[286px] w-[148px] h-8 flex gap-1 cursor-pointer hover:opacity-70 transition-opacity" // <--- Thêm cursor-pointer
      >
        <div className="w-[34px] h-8 relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200" /> {/* Thêm border nhẹ cho rõ */}
          <div className="left-3.5 absolute top-2 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            1
          </div>
        </div>
        <div className="mt-2 w-[108px] h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
          Thông tin sự kiện
        </div>
      </div>

      {/* --- BƯỚC 2: Thời gian & Loại vé --- */}
      <div 
        onClick={() => handleStepClick(2)} 
        className="absolute top-[90px] left-[572px] w-[150px] h-8 flex gap-0.5 cursor-pointer hover:opacity-70 transition-opacity"
      >
        <div className="w-[34px] h-8 relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200" />
          <div className="absolute top-2 left-[13px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            2
          </div>
        </div>
        <p className="mt-2 w-28 h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
          Thời gian &amp; loại vé
        </p>
      </div>

      {/* --- BƯỚC 3 & 4 (Chung 1 khối flex) --- */}
      <div className="absolute top-[90px] left-[827px] w-[334px] h-[34px] flex">
        
        {/* Bước 3: Cài đặt */}
        <div 
            onClick={() => handleStepClick(3)}
            className="w-[92px] flex gap-3 cursor-pointer hover:opacity-70 transition-opacity"
        >
          <div className="w-[34px] h-8 relative">
            <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200" />
            <div className="absolute top-2 left-[13px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
              3
            </div>
          </div>
          <div className="mt-2 w-11 h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            Cài đặt
          </div>
        </div>

        {/* Bước 4: Thông tin thanh toán */}
        <div 
            onClick={() => handleStepClick(4)}
            className="flex ml-[69px] cursor-pointer hover:opacity-70 transition-opacity"
        >
            <div className="mt-0.5 w-[34px] h-8 relative">
            <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200" />
            <div className="left-3 absolute top-2 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
                4
            </div>
            </div>
            <div className="mt-2.5 w-[132px] h-[15px] ml-[5px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            Thông tin thanh toán
            </div>
        </div>
         </div>
        <div className="mt-2.5 w-[132px] h-[15px] ml-[5px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
          Thông tin thanh toán
        </div>
      
      {/* Line */}
    <div className="absolute top-[130px] left-[273px] w-[1500px] h-[3px] bg-gray-300 rounded-full opacity-70"></div>


      {/* Form thời gian */}
      <div className="absolute top-[156px] left-[305px] w-[1112px] h-[130px] bg-[#ffe8e2] rounded-md" />
      <div className="absolute top-[174px] left-[305px] w-[173px] h-[29px]">
        <div className="absolute top-0 left-[22px] w-[131px] h-[29px] bg-white rounded-lg" />
        <div className="absolute top-1.5 left-0 w-[171px] font-semibold text-[#f94f2f] text-xs text-center leading-[normal]">
          Thời gian bán vé
        </div>
      </div>

      {/* Input: Thời gian BẮT ĐẦU bán vé */}
      <input
        type="datetime-local"
        disabled={isAdmin}
        // Hiển thị: Cắt chuỗi để input hiểu
        value={eventData.startTime ? eventData.startTime.substring(0, 16) : ''}
        // Lưu: Nối thêm đuôi chuẩn API
        onChange={(e) => {
          setEventData(prev => ({ 
            ...prev, 
            startTime: e.target.value + ":00+07:00" 
          }));
        }}
        className="absolute top-[216px] left-[327px] w-[513px] h-[31px] bg-white rounded border border-[#ccc] px-3 text-xs text-[#6e6e6e] font-light focus:outline-none focus:ring-1 focus:ring-[#6e6e6e]"
      />

      {/* Input: Thời gian KẾT THÚC bán vé */}
      <input
        type="datetime-local"
        disabled={isAdmin}
        value={eventData.endTime ? eventData.endTime.substring(0, 16) : ''}
        onChange={(e) => {
          setEventData(prev => ({ 
            ...prev, 
            endTime: e.target.value + ":00+07:00" 
          }));
        }}
        className="absolute top-[216px] left-[871px] w-[513px] h-[31px] bg-white rounded border border-[#ccc] px-3 text-xs text-[#6e6e6e] font-light focus:outline-none focus:ring-1 focus:ring-[#6e6e6e]"
      />
<div className="absolute top-[300px] left-[305px] w-[1064px] min-h-[100px] bg-[#ffe8e2] rounded-md p-6 flex flex-col">

  {/* 1. Label "Loại vé" - Đã bỏ `absolute` và thêm `mb-4` (margin-bottom) */}
  <div className="w-[173px] h-[29px] relative mb-4">
    <div className="absolute top-0 left-[0 px] w-[131px] h-[29px] bg-white rounded-lg" />
    <div className="absolute top-1.5 left-[-30px] w-[171px] font-semibold text-[#f94f2f] text-xs text-center leading-[normal]">
      Loại vé
    </div>
  </div>

  {/* 2. Danh sách vé - Đã bỏ `absolute` và thêm `mb-4` */}
  <div className="w-full space-y-2 mb-4">
    {/* Kiểm tra xem có vé nào không và map qua chúng */}
    {eventData.tickets && eventData.tickets.map(ticket => (
      <div 
        key={ticket.id} 
        // Bỏ w-[1053px] để nó tự dãn 100% theo cha
        className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm w-[1048px]"
      >
        <div className="flex items-center gap-3">
          <span className="cursor-grab">☰</span>
          <span className="font-semibold">{ticket.ticketName || "Chưa đặt tên"}</span>
          {isAdmin && (
             <span className="text-sm text-gray-500 ml-4">
               (Giá: {ticket.ticketPrice} - SL: {ticket.ticketQuantity})
             </span>
          )}
        </div>
        {!isAdmin && (
          <div className="flex gap-2">
            <button 
              className="p-2 bg-white rounded-md hover:bg-gray-300"
              onClick={() => handleEditClick(ticket)}
            >
              <FaEdit />
            </button>
            <button 
              className="p-2 bg-[#F94F2F] rounded-md hover:bg-red-600"
              onClick={() => handleDeleteTicket(ticket.id)}
            >
              <FaTrash className="text-white w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    ))}
  </div>

  {/* 3. Nút "Tạo vé" - Đã bỏ `absolute` và bọc trong div `justify-center` */}
<div className="flex justify-center">
      {!isAdmin && (
        <TicketCreator 
          editingTicket={editingTicket}
          setEditingTicket={setEditingTicket}
        />
      )}
  </div>

</div>
      {/* Sidebar buttons */}
      <div 
              // 1. Thay đổi vị trí: Nếu là Admin (ReadOnly) thì xuống 223px, User thì 140px
              className={`absolute w-[238px] h-[54px] left-[19px] flex ${isAdmin ? 'top-[223px]' : 'top-[140px]'}`}
            >
              <div 
                // 2. Thay đổi đường dẫn: Admin về Dashboard, User về Sự kiện của tôi
                onClick={() => navigate(isAdmin? '/admin/danh-sach-su-kien' : '/su-kien-cua-toi')}
                className="w-60 h-[54px] relative cursor-pointer"
              >
                <img
                  className="absolute top-0 left-0 w-[238px] h-[54px]"
                  alt="Rectangle"
                  src={rectangle62}
                />
      
                {/* 3. Thay đổi tên hiển thị */}
                <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
                  {isAdmin? "Danh sách sự kiện" : "Sự kiện của tôi"}
                </div>
                
                <Calendar className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
              </div>
            </div>
      
            <div 
              // 1. Xử lý vị trí: Admin lên trên (140px), User ở dưới (223px)
              className={`absolute left-[19px] w-60 h-[54px] ${isAdmin ? 'top-[140px]' : 'top-[223px]'}`}
            >
               <div
                  // 2. Xử lý chuyển trang
                  onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dieu-khoan-BTC')}
                  className="w-full h-full relative cursor-pointer"
               >
                  <img
                    className="absolute top-0 left-0 w-[238px] h-[54px]"
                    alt="Rectangle"
                    src={rectangle622}
                  />
      
                  {/* 3. Xử lý Tên nút */}
                  <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs tracking-[0] leading-[normal]">
                    {isAdmin? "Dashboard" : "Điều khoản BTC"}
                  </div>
      
                  {/* 4. Xử lý Icon: Admin dùng Ngôi nhà, User dùng Money */}
                  {isAdmin ? (
                     <FiHome className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1] text-black" />
                  ) : (
                     <QlementineIconsMoney16 className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
                  )}
               </div>
            </div>
            
        {/* Footer */}
        <div className="absolute top-[1511px] left-0 w-[1472px] h-[581px]">
                <div className="absolute top-0 left-0 w-[1500px] h-[581px] bg-[#5d5c5c]" />
        
                <img
                  className="absolute top-[60px] left-[121px] w-[345px] h-[113px] aspect-[3.05]"
                  alt="Ticke"
                  src={ticke12}
                />
        
                <div className="absolute top-[90px] left-[851px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Giới thiệu về TickeZ.
                </div>
        
                <p className="absolute top-[309px] left-[589px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Bạn đang truy cập TickeZ. phiên bản Số 123456789
                </p>
        
                <div className="absolute top-[90px] left-[972px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Hợp đồng
                </div>
        
                <div className="absolute top-[90px] left-[1217px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Hotline: 033.33.333
                </div>
        
                <div className="top-[90px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] whitespace-nowrap absolute left-[1337px] text-white text-center tracking-[0] leading-[normal]">
                  Thông báo
                </div>
        
                <div className="absolute top-[109px] left-[1337px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  About us
                </div>
        
                <div className="absolute top-32 left-[1337px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  FAQs
                </div>
        
                <div className="absolute top-[147px] left-[1337px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Góp ý
                </div>
        
                <div className="absolute top-[109px] left-[1217px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Chatbot hỗ trợ
                </div>
        
                <p className="absolute top-[109px] left-[972px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Điều khoản &amp; Điều kiện
                </p>
        
                <p className="absolute top-32 left-[972px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Chính sách bảo vệ người dùng
                </p>
        
                <div className="absolute top-[60px] left-[972px] [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center tracking-[0] leading-[normal]">
                  QUY ĐỊNH
                </div>
        
                <div className="absolute top-[60px] left-[1217px] [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center tracking-[0] leading-[normal]">
                  LIÊN HỆ
                </div>
        
                <div className="top-[60px] [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-xs absolute left-[1337px] text-white text-center tracking-[0] leading-[normal]">
                  THÔNG TIN
                </div>
        
                <div className="absolute top-[60px] left-[851px] [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center tracking-[0] leading-[normal]">
                  GIỚI THIỆU
                </div>
        
                <div className="absolute top-[199px] left-[121px] [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center tracking-[0] leading-[normal]">
                  FOLLOW US
                </div>
        
                <img
                  className="absolute top-[221px] left-[121px] w-10 h-10 object-cover"
                  alt="Rectangle"
                  src={rectangle53}
                />
        
                <img
                  className="absolute top-[221px] left-[182px] w-10 h-10 object-cover"
                  alt="Rectangle"
                  src={rectangle56}
                />
        
                <img
                  className="absolute top-[221px] left-[243px] w-10 h-10 object-cover"
                  alt="Rectangle"
                  src={rectangle57}
                />
        
                <img
                  className="absolute top-[221px] left-[304px] w-10 h-10 object-cover"
                  alt="Rectangle"
                  src={rectangle58}
                />
              </div>
    </div>
  
  );
};
export default EventPage2;
