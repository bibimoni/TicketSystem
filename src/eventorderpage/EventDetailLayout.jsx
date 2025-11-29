import React, { useState, useEffect } from "react";
import { FiPieChart, FiFileText, FiEdit } from 'react-icons/fi';
import { RiCouponLine } from 'react-icons/ri';
import { useParams, useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios'; // <--- THÊM AXIOS
import rectangle7 from "../Elements/rectangle-7.png";
import rectangle622 from "../Elements/rectangle-62.png";
import rectangle62 from "../Elements/rectangle-62.png";
import ticke12 from "../Elements/ticke-1-2.png";
import TICKETZ_LOGO from '../Elements/ticketZ.png';
import rectangle53 from "../Elements/rectangle-53.svg";
import rectangle56 from "../Elements/rectangle-56.svg";
import rectangle57 from "../Elements/rectangle-57.svg";
import rectangle58 from "../Elements/rectangle-58.svg";
import OrganizerHeader from "../information/OrganizerHeader";
import AdminHeader from "../information/AdminHeader";

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

export const EventDetailLayout = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { eventId } = useParams(); 
  const [event, setEvent] = useState(null); 

  const basePath = isAdmin ? `/admin/event-detail/${eventId}` : `/event/${eventId}`;

  useEffect(() => {
    const fetchEventHeader = async () => {
      try {
        // 1. Token cứng (Lấy từ các bước trước)
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZTc0YzBlMWQ1ZmIzZGY3MWQwMGJkZCIsInVzZXJuYW1lIjoiY3Jpc3RpYW5vIG1lc3NpIiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzYzOTk5MDcyLCJleHAiOjE3NjQ2MDM4NzJ9.FoE9wjyiqvJI0PZ6KrxNQRtM1vZS00F9lRbRBQynVNo";
        
        // 2. Gọi API lấy danh sách để tìm tên sự kiện (Workaround vì không có API get detail)
        const response = await axios.get(`${API_BASE_URL}/event/customer_events`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });

        let allEvents = [];
        if (Array.isArray(response.data)) allEvents = response.data;
        else if (response.data.events) allEvents = response.data.events;
        else if (response.data.data) allEvents = response.data.data;

        // 3. Tìm sự kiện hiện tại
        const foundEvent = allEvents.find(e => (e.id === eventId || e._id === eventId));

        if (foundEvent) {
            // Map dữ liệu API vào state (API trả về 'name', UI cần 'eventName')
            setEvent({
                ...foundEvent,
                eventName: foundEvent.name 
            });
        } else {
            setEvent({ eventName: "Không tìm thấy sự kiện" });
        }

      } catch (error) {
        console.error("Lỗi tải header sự kiện:", error);
        // Fallback: Nếu lỗi API thì thử tìm trong localStorage vớt vát
        const storedEvents = JSON.parse(localStorage.getItem('myEvents')) || [];
        const localFound = storedEvents.find(e => e.id === eventId);
        if (localFound) setEvent(localFound);
        else setEvent({ eventName: "Đang tải..." });
      }
    };

    fetchEventHeader();
  }, [eventId]);

  return (
    <div className="bg-[#d9d9d9] overflow-hidden border border-solid border-[#d9d9d9] w-full min-w-[1440px] min-h-[1905px] relative">

      {/* Tiêu đề sự kiện - Đã lấy từ API */}
      <div className="absolute top-[29px] left-[306px] w-auto min-w-[203px] [font-family:font-poppins font-extrabold,Helvetica] font-black italic text-[#f94f2f] text-xl text-center tracking-[0] leading-[normal] z-[10]">
        {event ? event.eventName : 'Đang tải...'}
      </div>
      
      <div className="absolute top-[72px] left-[267px] w-[1500px] h-[1439px] bg-[#fff8f7]" />
      <div className="absolute top-0 left-0 w-[272px] h-[1511px] bg-[#f94f2f]" />
      <img className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]" alt="Rectangle" src={rectangle7} />
           
      {/* Logo và Sidebar */}
      <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
        <img
          className="absolute top-0 left-0 w-[63px] h-[63px] object-contain"
          alt="ticketZ Logo"
          src={TICKETZ_LOGO}
        />
      </div>
      
      {/* Nút quay lại (Dashboard) */}
      <div 
        // 3. Điều hướng thông minh: Admin về Admin Dashboard, User về User Dashboard
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

      {/* === SIDEBAR BUTTONS === */}
      
      {/* 1. Nút Tổng quan (Hiện cho cả 2) */}
      <div 
        onClick={() => {
            if (isAdmin) {
                // ADMIN: Bấm vào đây sẽ về trang "Duyệt sự kiện" (Form 4 bước)
                navigate(`/admin/duyet-su-kien/${eventId}`);
            } else {
                // USER: Bấm vào đây xem Thống kê (OverviewPage)
                navigate(`${basePath}/overview`);
            }
        }} 
        className="absolute w-[243px] h-[54px] top-[140px] left-[19px] flex cursor-pointer"
      >
        <div className="w-60 h-[54px] relative">
          <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="Rectangle" src={rectangle62} />
          
          {/* Đổi tên nút cho Admin dễ hiểu hơn */}
          <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            {isAdmin ? "Thông tin & Duyệt" : "Tổng quan"}
          </div>
          
          <FiPieChart className="absolute top-[11px] left-[9px] w-8 h-8 text-black" />
        </div>
      </div>
      
      {/* 2. Nút Danh sách đơn hàng (Hiện cho cả 2) */}
      <div 
        onClick={() => navigate(`${basePath}/orders`)} // Dùng basePath
        className="absolute top-[223px] left-[19px] w-60 h-[54px] cursor-pointer">
        <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="Rectangle" src={rectangle622} />
        <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs tracking-[0] leading-[normal]">
          Danh sách đơn hàng
        </div>
        <FiFileText className="absolute top-[11px] left-[9px] w-8 h-8 text-black" />
      </div>
      
      {/* 3. Nút Chỉnh sửa (CHỈ HIỆN VỚI USER) */}
      {!isAdmin && (
        <div 
            onClick={() => navigate(`/event-edit/${eventId}/buoc-1`)} 
            className="absolute w-[243px] h-[54px] top-[306px] left-[19px] flex cursor-pointer">
            <div className="w-60 h-[54px] relative">
            <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="Rectangle" src={rectangle62} />
            <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
                Chỉnh sửa
            </div>
            <FiEdit className="absolute top-[11px] left-[9px] w-8 h-8 text-black" />
            </div>
        </div>
      )}

      {/* 4. Nút Voucher (CHỈ HIỆN VỚI USER) */}
      {!isAdmin && (
          <div 
            onClick={() => navigate(`/event/${eventId}/voucher`)} 
            className="absolute w-[243px] h-[54px] top-[389px] left-[19px] flex cursor-pointer">
            <div className="w-60 h-[54px] relative">
            <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="Rectangle" src={rectangle62} />
            
            {/* Đổi tên: Tạo voucher -> Mã giảm giá */}
            <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
                Mã giảm giá
            </div>
            
            <RiCouponLine className="absolute top-[11px] left-[9px] w-8 h-8 text-black" />
            </div>
        </div>
      )}
        
      {/* Footer (Giữ nguyên) */}
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

      {/* Nơi hiển thị nội dung con (OverviewPage, OrdersPage) */}
      <div className="absolute top-[150px] left-[300px] p-8">
          <Outlet /> 
      </div>

    </div>
  );
};

export default EventDetailLayout;