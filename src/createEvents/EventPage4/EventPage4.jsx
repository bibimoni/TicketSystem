import React, { useContext, useState } from 'react';
import { EventContext } from '../../context/EventContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TICKETZ_LOGO from '../../Elements/ticketZ.png';
import PaymentForm from "./PaymentForm";
import rectangle21 from "../../Elements/rectangle-21.svg";
import rectangle7 from "../../Elements/rectangle-7.png";
import AdminHeader from "../../information/AdminHeader";
import OrganizerHeader from "../../information/OrganizerHeader";
import { FiHome } from "react-icons/fi";
import { QlementineIconsMoney16 } from "../../Elements/QlementineIconsMoney16";
import { Calendar } from "../../Elements/Calendar";
import rectangle62 from "../../Elements/rectangle-62.png";
import rectangle622 from "../../Elements/rectangle-62.png";
import ticke12 from "../../Elements/ticke-1-2.png";
import rectangle53 from "../../Elements/rectangle-53.svg";
import rectangle56 from "../../Elements/rectangle-56.svg";
import rectangle57 from "../../Elements/rectangle-57.svg";
import rectangle58 from "../../Elements/rectangle-58.svg";
import { useAuth } from '../../context/AuthContext';

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

const convertToISO = (dateString) => {
    if (!dateString) return new Date().toISOString();
    if (dateString.includes('T') && dateString.includes('+')) {
        return dateString;
    }
    try {
        return new Date(dateString).toISOString();
    } catch (e) {
        return new Date().toISOString();
    }
};

const parseNumber = (val) => {
    if (!val) return 0;
    const cleanVal = String(val).replace(/[^0-9]/g, '');
    return Number(cleanVal);
};

// 3. Hàm Upload ảnh (ĐÃ SỬA THEO SWAGGER MỚI)
const uploadImageToBackend = async (imageData) => {
    // Trường hợp 1: Không có dữ liệu
    if (!imageData) return ""; 

    // Trường hợp 2: Đã là link online (Ví dụ: https://res.cloudinary...) -> Giữ nguyên, không upload lại
    if (typeof imageData === 'string' && imageData.startsWith('http')) {
        return imageData;
    }

    // Trường hợp 3: Là Base64 (Người dùng chọn ảnh mới) -> Upload lên Server
    try {
        const res = await fetch(imageData);
        const blob = await res.blob();
        const file = new File([blob], "image.png", { type: "image/png" });
        const formData = new FormData();
        
        formData.append('file', file);

        const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        console.log("✅ Upload ảnh mới thành công:", response.data);
        return response.data.url || response.data; 
    } catch (error) {
        console.error("❌ Lỗi upload ảnh:", error);
        return ""; // Trả về chuỗi rỗng để không crash, nhưng nên alert cho user biết
    }
};

export const EventPage4 = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { eventData, setEventData } = useContext(EventContext);
  const [isLoading, setIsLoading] = useState(false);
  const { eventId } = useParams();

  const { token } = useAuth();

  const handleStepClick = (step) => {
    if (isAdmin) {
       navigate(`/admin/duyet-su-kien/${eventId}/buoc-${step}`);
    } else if (eventId) {
       navigate(`/event-edit/${eventId}/buoc-${step}`);
    } else {
       navigate(`/tao-su-kien/buoc-${step}`);
    }
  };

  const handleCompleteClick = async () => {
    // 1. VALIDATE
    if (!eventData.tickets || eventData.tickets.length === 0) {
        alert("⚠️ Bạn chưa tạo vé nào! Hãy quay lại Bước 2.");
        return;
    }
    
    // Log kiểm tra dữ liệu trước khi xử lý
    console.log("🔍 Dữ liệu hiện tại trong Context:", eventData);
    if (!eventData.suKienImage) console.warn("⚠️ Cảnh báo: Không tìm thấy ảnh Poster (suKienImage)!");

    setIsLoading(true);
    try {
        if (!token) {
            alert("⚠️ Hết phiên đăng nhập. F5 lại trang!");
            return;
        }

        // 2. UPLOAD ẢNH (Sửa kỹ phần này)
        // Upload Poster (Ảnh dọc)
        const posterUrl = await uploadImageToBackend(eventData.suKienImage);
        
        // Upload Banner (Ảnh ngang)
        const bannerUrl = await uploadImageToBackend(eventData.bannerImage);
        
        // Upload Logo
        const logoUrl = await uploadImageToBackend(eventData.logoImage);
        
        // Fallback: Nếu không có Poster thì lấy Banner đắp vào (để không bị lỗi trắng ảnh)
        // Nhưng ưu tiên PosterURL nếu nó tồn tại
        const finalPoster = posterUrl || bannerUrl; 
        const finalBanner = bannerUrl || posterUrl;

        console.log("📸 Link ảnh sau xử lý:", { finalPoster, finalBanner, logoUrl });

        // Gói Link Banner và Logo vào description
        const description = eventData.description || "";
        const combinedInformation = `${description}\n\n[Banner]: ${finalBanner}\n[suKien]: ${finalPoster}\n[Logo]: ${logoUrl}`;

        // 3. TẠO PAYLOAD
        const basePayload = {
            id: eventId, 
            name: eventData.eventName || "Sự kiện mới",
            
            // --- QUAN TRỌNG: Đây là trường lưu ảnh Poster ---
            event_picture_url: finalPoster, 
            
            organizer_logo: logoUrl,
            information: combinedInformation, 
            
            organizer: eventData.organizerName || "BTC",
            organizer_information: eventData.organizerInfo || "Thông tin BTC",
            
            destination: eventData.eventType === 'OFFLINE' 
                ? [eventData.address, eventData.ward, eventData.district, eventData.province].filter(Boolean).join(", ") 
                : "Online Platform",
            
            format: eventData.eventType ? eventData.eventType.toUpperCase() : "OFFLINE",
            
            eventTicketStart: convertToISO(eventData.startTime),
            eventTicketEnd: convertToISO(eventData.endTime),
            eventTime: convertToISO(eventData.eventDate),
            
            event_custom_slug: eventData.customPath || `evt-${Date.now()}`,
            messages: eventData.confirmationMessage || "Cảm ơn bạn.",

            ticketTypes: eventData.tickets.map(t => ({
                id: (t.id && t.id.length > 10) ? t.id : undefined,
                event_id: t.event_id,
                ticket_price_id: t.ticket_price_id,
                name: t.ticketName,
                amount: parseNumber(t.ticketQuantity),
                remaining: t.remaining !== undefined ? t.remaining : parseNumber(t.ticketQuantity)
            }))
        };
        
        console.log("📦 Payload gửi đi:", basePayload);

        // 4. GỌI API
        const endpoint = eventId ? `${API_BASE_URL}/event/update` : `${API_BASE_URL}/event/create`;
        await axios.post(endpoint, basePayload, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        alert(eventId ? '✅ Cập nhật sự kiện thành công!' : '✅ Tạo sự kiện mới thành công!');
        
        localStorage.removeItem('event_draft');
        setEventData({});
        navigate('/su-kien-cua-toi');

    } catch (error) {
        console.error("❌ Lỗi API:", error);
        alert(`❌ Có lỗi xảy ra: ${error.response?.data?.message || error.message}`);
    } finally {
        setIsLoading(false);
    }
  };

  const handleAdminAction = async (action) => {
    if (!token) return alert("Vui lòng đăng nhập quyền Admin!");
    setIsLoading(true);

    try {
        let statusToSet = "";
        
        if (action === 'approve') {
            statusToSet = "PUBLISHED";
        } else if (action === 'reject') {
            statusToSet = "CANCELLED";
        }

        // --- GỌI ĐÚNG CẤU TRÚC: /event/set-status/{id}/{status} ---
        await axios.get(`${API_BASE_URL}/event/set-status/${eventId}/${statusToSet}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        alert(`✅ Đã cập nhật trạng thái: ${statusToSet}`);
        
        // Reload lại trang danh sách để thấy thay đổi
        window.location.href = '/admin/danh-sach-su-kien';

    } catch (error) {
        console.error("❌ Admin Action Error:", error);
        const msg = error.response?.data?.message || error.message || "Lỗi Server";
        alert(`❌ Không thể thực hiện: ${msg}`);
    } finally {
        setIsLoading(false);
    }
  };
  return (
    <div className="bg-[#d9d9d9] overflow-hidden border border-solid border-[#d9d9d9] w-full min-w-[1440px] min-h-[1905px] relative">
           <div className="absolute top-[72px] left-[267px] w-[1500px] h-[1439px] bg-[#fff8f7]" />
           <div className="absolute top-0 left-0 w-[272px] h-[1511px] bg-[#f94f2f]" />
           <img className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]" alt="Rectangle" src={rectangle7} />

      {!isAdmin ? (
        <div 
            className="absolute top-[85px] left-[1320px] w-[102px] h-[45px] cursor-pointer hover:opacity-80"
            onClick={!isLoading ? handleCompleteClick : null}
          >
            <img className="absolute top-0 -left-1 w-[108px] h-[53px]" alt="Rectangle" src={rectangle21} />
            <div className="absolute top-[15px] left-[40px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
              {isLoading ? "..." : "Lưu"}
            </div>
        </div>
      ) : (
        // NÚT DUYỆT CỦA ADMIN
        <div className="absolute top-[85px] left-[1250px] flex gap-3">
            <button 
                disabled={isLoading}
                onClick={() => handleAdminAction('reject')} 
                className="h-11 rounded-lg bg-white border border-red-500 text-red-500 px-4 py-2 font-bold hover:bg-red-50 text-xs transition cursor-pointer disabled:opacity-50"
            >
                Từ chối ✕
            </button>
            <button 
                disabled={isLoading}
                onClick={() => handleAdminAction('approve')} 
                className="bg-[#f94f2f] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d13a1e] text-xs shadow-md transition border-none cursor-pointer disabled:opacity-50"
            >
                {isLoading ? "Đang xử lý..." : "Duyệt ✓"}
            </button>
        </div>
      )}

      <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
        <img className="absolute top-0 left-0 w-[63px] h-[63px] object-contain" alt="ticketZ Logo" src={TICKETZ_LOGO} />
      </div>
      <div onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/su-kien-cua-toi')} className="absolute top-[27px] left-[89px] [font-family:'Moul-Regular',Helvetica] font-normal text-white text-xl text-center tracking-[0] leading-[15px] cursor-pointer">
        {isAdmin ? "Admin" : "Organizer"} <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; center
      </div>
      
      {!isAdmin && (
          <div className="mt-[17px] w-[102px] h-[45px] relative ml-[989px]">
          <button onClick={() => navigate('/tao-su-kien')} className="flex items-center justify-center w-[108px] h-[45px] rounded-full bg-[#FF5331] text-white text-xs font-semibold shadow-[0_4px_8px_rgba(0,0,0,0.25)] border-none outline-none">
              Tạo sự kiện
          </button>
          </div>
      )}

      {isAdmin ? <AdminHeader /> : <OrganizerHeader />}

      <div onClick={() => handleStepClick(1)} className="absolute top-[88px] left-[286px] w-[148px] h-8 flex gap-1 cursor-pointer hover:opacity-70 transition-opacity">
        <div className="w-[34px] h-8 relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200" />
          <div className="left-3.5 absolute top-2 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">1</div>
        </div>
        <div className="mt-2 w-[108px] h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">Thông tin sự kiện</div>
      </div>

      <div onClick={() => handleStepClick(2)} className="absolute top-[90px] left-[572px] w-[150px] h-8 flex gap-0.5 cursor-pointer hover:opacity-70 transition-opacity">
        <div className="w-[34px] h-8 relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200" />
          <div className="absolute top-2 left-[13px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">2</div>
        </div>
        <p className="mt-2 w-28 h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">Thời gian &amp; loại vé</p>
      </div>

      <div className="absolute top-[90px] left-[827px] w-[334px] h-[34px] flex">
        <div onClick={() => handleStepClick(3)} className="w-[92px] flex gap-3 cursor-pointer hover:opacity-70 transition-opacity">
          <div className="w-[34px] h-8 relative">
            <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200" />
            <div className="absolute top-2 left-[13px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">3</div>
          </div>
          <div className="mt-2 w-11 h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">Cài đặt</div>
        </div>
        <div onClick={() => handleStepClick(4)} className="flex ml-[69px] cursor-pointer hover:opacity-70 transition-opacity">
            <div className="mt-0.5 w-[34px] h-8 relative">
            <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200" />
            <div className="left-3 absolute top-2 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">4</div>
            </div>
            <div className="mt-2.5 w-[132px] h-[15px] ml-[5px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">Thông tin thanh toán</div>
        </div>
      </div>

      <div className={`absolute w-[238px] h-[54px] left-[19px] flex ${isAdmin ? 'top-[223px]' : 'top-[140px]'}`}>
        <div onClick={() => navigate(isAdmin? '/admin/danh-sach-su-kien' : '/su-kien-cua-toi')} className="w-60 h-[54px] relative cursor-pointer">
          <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="Rectangle" src={rectangle62} />
          <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">{isAdmin? "Danh sách sự kiện" : "Sự kiện của tôi"}</div>
          <Calendar className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
        </div>
      </div>
      
      <div className={`absolute left-[19px] w-60 h-[54px] ${isAdmin ? 'top-[140px]' : 'top-[223px]'}`}>
         <div onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dieu-khoan-BTC')} className="w-full h-full relative cursor-pointer">
            <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="Rectangle" src={rectangle622} />
            <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs tracking-[0] leading-[normal]">{isAdmin? "Dashboard" : "Điều khoản BTC"}</div>
            {isAdmin ? <FiHome className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1] text-black" /> : <QlementineIconsMoney16 className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />}
         </div>
      </div>

      <div className="absolute top-[150px] left-[300px] p-8">
          <PaymentForm isAdmin={isAdmin} />
      </div>
      
      <div className="absolute top-[1511px] left-0 w-[1472px] h-[581px]">
         <div className="absolute top-0 left-0 w-[1500px] h-[581px] bg-[#5d5c5c]" />
         <img className="absolute top-[60px] left-[121px] w-[345px] h-[113px] aspect-[3.05]" alt="Ticke" src={ticke12} />
         <div className="absolute top-[199px] left-[121px] [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center tracking-[0] leading-[normal]">FOLLOW US</div>
         <img className="absolute top-[221px] left-[121px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle53} />
         <img className="absolute top-[221px] left-[182px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle56} />
         <img className="absolute top-[221px] left-[243px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle57} />
         <img className="absolute top-[221px] left-[304px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle58} />
      </div>
      <div className="absolute top-[130px] left-[273px] w-[1500px] h-[3px] bg-gray-300 rounded-full opacity-70"></div>
    </div>
  );
};
export default EventPage4;