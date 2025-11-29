import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'; // <--- NHỚ IMPORT AXIOS
import { EventContext } from '../../context/EventContext';
import TICKETZ_LOGO from '../../Elements/ticketZ.png';
import rectangle7 from "../../Elements/rectangle-7.png";
import rectangle212 from "../../Elements/rectangle-21-2.png";
import rectangle622 from "../../Elements/rectangle-62.png";
import rectangle62 from "../../Elements/rectangle-62.png";
import ticke12 from "../../Elements/ticke-1-2.png";
import { FiHome } from "react-icons/fi";
import { Calendar } from "../../Elements/Calendar";
import { QlementineIconsMoney16 } from "../../Elements/QlementineIconsMoney16";
import OrganizerHeader from "../../information/OrganizerHeader";
import AdminHeader from "../../information/AdminHeader";
import rectangle53 from "../../Elements/rectangle-53.svg";
import rectangle56 from "../../Elements/rectangle-56.svg";
import rectangle57 from "../../Elements/rectangle-57.svg";
import rectangle58 from "../../Elements/rectangle-58.svg";
import { useAuth } from '../../context/AuthContext';

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

// Helper: Tách link ảnh từ description
const extractLink = (text, key) => {
  if (!text) return null;
  const regex = new RegExp(`\\[${key}\\]:\\s*([^\\s]+)`);
  const match = text.match(regex);
  return (match && !match[1].includes("Không")) ? match[1] : null;
};

export const EventPage1 = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { eventData, setEventData } = useContext(EventContext);
  const { eventId } = useParams();
  const { token } = useAuth();

  // --- HÀM XỬ LÝ CHUYỂN BƯỚC ---
  const handleStepClick = (step) => {
    if (isAdmin) navigate(`/admin/duyet-su-kien/${eventId}/buoc-${step}`);
    else if (eventId) navigate(`/event-edit/${eventId}/buoc-${step}`);
    else navigate(`/tao-su-kien/buoc-${step}`);
  };

  const handleContinueClick = () => {
    // Validate đơn giản
    if (!eventData.eventName) return alert("Vui lòng nhập tên sự kiện!");
    handleStepClick(2); // Sang bước 2
  };

  // --- LOGIC TẢI DỮ LIỆU KHI VÀO TRANG ---
  useEffect(() => {
    const loadEventData = async () => {
      if (eventId) {
        try {
          if (!token) return;
          const endpoint = isAdmin 
              ? `${API_BASE_URL}/event/all_events` 
              : `${API_BASE_URL}/event/customer_events`;

          console.log(`🚀 Đang tải dữ liệu từ: ${endpoint}`); // Log để kiểm tra

          const response = await axios.get(endpoint, {
             headers: { 'Authorization': `Bearer ${token}` }
          });

          let allEvents = [];
          if (Array.isArray(response.data)) allEvents = response.data;
          else if (response.data.events) allEvents = response.data.events;
          else if (response.data.data) allEvents = response.data.data;

          // Tìm sự kiện
          const foundEvent = allEvents.find(e => (e.id === eventId || e._id === eventId));

          if (foundEvent) {
              console.log("✅ Dữ liệu sự kiện gốc:", foundEvent); // Debug xem API trả gì
              const data = foundEvent;
              
              // Xử lý description: Nếu description cũ có chứa link ảnh (do code cũ), hãy lọc bỏ nó đi cho sạch
              let cleanDescription = data.information || "";
              if (cleanDescription.includes('[Banner]:')) {
                  cleanDescription = cleanDescription.split('[Banner]:')[0].trim();
              }

              setEventData({
                id: data.id || data._id,
                eventName: data.name,
                organizerName: data.organizer,
                description: cleanDescription,
                eventType: data.format?.toUpperCase() || 'OFFLINE',
                eventDate: data.eventTime,
                
                // --- SỬA LỖI 1: Lấy ảnh trực tiếp từ trường API (Không dùng regex extractLink nữa) ---
                bannerImage: data.event_picture_url || extractLink(data.information, 'Banner') || "", 
    
                logoImage: data.organizer_logo || extractLink(data.information, 'Logo') || "",
                
                suKienImage: data.event_picture_url || extractLink(data.information, 'suKien') || extractLink(data.information, 'Banner') || "",
                
                address: data.destination, 
                // Nếu backend không trả riêng từng trường địa chỉ, ta để trống để user nhập lại hoặc tự parse
                province: '', district: '', ward: '',
                
                startTime: data.eventTicketStart,
                endTime: data.eventTicketEnd,
                customPath: data.event_custom_slug,
                confirmationMessage: data.messages,

                // --- SỬA LỖI 2: Load vé từ ticketTypes (Cấu trúc phẳng) ---
                tickets: (data.ticketTypes && data.ticketTypes.length > 0)
    ? data.ticketTypes.map(ticketType => ({
        id: ticketType.id,
        
        // GIỮ LẠI CÁC TRƯỜNG BẮT BUỘC ĐỂ GỬI LẠI KHI UPDATE
        event_id: ticketType.event_id || ticketType.eventId, 
        remaining: ticketType.remaining, // <--- QUAN TRỌNG: Backend cần cái này
        
        ticketName: ticketType.name,
        ticketQuantity: ticketType.amount,
        ticketPrice: ticketType.price || 0,
        ticketInfo: ticketType.benefit_info || "Vé sự kiện"
    })) 
    : [],
              });
          } else {
              console.error("❌ Không tìm thấy ID trong danh sách");
              alert("Không tìm thấy sự kiện này!");
              navigate('/su-kien-cua-toi');
          }

        } catch (error) {
          console.error("❌ Lỗi tải sự kiện:", error);
          alert("Lỗi kết nối Server!");
        }
      } 
      // Logic tạo mới (Giữ nguyên)
      else {
        const hasData = eventData && Object.keys(eventData).length > 0;
        if (!hasData) {
           const draft = localStorage.getItem('event_draft');
           if (draft) setEventData(JSON.parse(draft));
           else setEventData({});
        }
      }
    };

    loadEventData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, token]); 


  // --- HÀM XỬ LÝ ẢNH ---
const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // --- 2. BA HÀM XỬ LÝ CHO 3 LOẠI ẢNH ---
  const handleImageChange = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const base64String = await readFileAsBase64(file);
      setEventData(prev => ({ ...prev, [field]: base64String }));
    }
    e.target.value = null;
  };

  // --- THÊM 3 HÀM NÀY ĐỂ FIX LỖI "NOT DEFINED" ---
  const handleSuKienChange = (e) => handleImageChange(e, 'suKienImage');
  const handleLogoChange = (e) => handleImageChange(e, 'logoImage');
  const handleBannerChange = (e) => handleImageChange(e, 'bannerImage');
  // ------------------------------------------------

  const suKienPreview = eventData.suKienImage;
  const bannerPreview = eventData.bannerImage;
  const logoPreview = eventData.logoImage;

  
  return (
    <div className={`
      bg-[#d9d9d9] overflow-hidden border border-solid border-[#d9d9d9] w-full min-w-[1500px] 
      ${eventData.eventType === 'OFFLINE' ? 'min-h-[1905px]' : 'min-h-[1775px]'}
      relative transition-all duration-300 ease-in-out
    `}>
      
      <div className={`
        absolute top-[72px] left-[267px] w-[1500px] bg-[#fff8f7]
        ${eventData.eventType === 'OFFLINE' ? 'h-[1439px]' : 'h-[1309px]'}
        transition-all duration-300 ease-in-out
      `} />

      <div className={`
        absolute top-0 left-0 w-[272px] bg-[#f94f2f]
        ${eventData.eventType === 'OFFLINE' ? 'h-[1511px]' : 'h-[1381px]'}
        transition-all duration-300 ease-in-out
      `} />

      <img
        className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]"
        alt="Rectangle"
        src={rectangle7}
      />

      <div className={`
        absolute left-0 w-[1472px] h-[581px]
        ${eventData.eventType === 'OFFLINE' ? 'top-[1511px]' : 'top-[1381px]'}
        transition-all duration-300 ease-in-out
      `}>
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

      {/* <img
        className="absolute top-[1770px] left-[924px] w-[140px] h-10" // Vị trí này có vẻ không còn đúng, nhưng để tạm
        alt="Rectangle"
        src={rectangle55}
      /> */}

    {/* Nút Tiếp Tục */}
    <div 
      className="absolute top-[85px] left-[1320px] w-[102px] h-[45px] cursor-pointer"
      onClick={handleContinueClick}
    >
      <img
        className="absolute top-0 -left-1 w-[108px] h-[53px]"
        alt="Rectangle"
        src={rectangle212} 
      />
      <div className="absolute top-[15px] left-[25px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#ffffff] text-xs text-center tracking-[0] leading-[normal]">
        Tiếp tục
      </div>
      
    </div>

      {/* Sidebar Logo */}
      <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
        <img
          className="absolute top-0 left-0 w-[63px] h-[63px] object-contain" // <-- Điều chỉnh lại class
          alt="ticketZ Logo"
          src={TICKETZ_LOGO}
        />
      </div>

      {/* Sidebar Title */}
      <div 
        onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/su-kien-cua-toi')} 
        className="absolute top-[27px] left-[89px] [font-family:'Moul-Regular',Helvetica] font-normal text-white text-xl text-center tracking-[0] leading-[15px] cursor-pointer">
        {isAdmin ? "Admin" : "Organizer"} <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; center
      </div>

      {/* Sidebar Menu */}
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

      {/* Thanh Bước (Step bar) */}
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

      <div className="absolute top-[147px] left-7 w-9 h-9 bg-[url(/uil-schedule.svg)] bg-[100%_100%]" />
      {/* Line */}
    <div className="absolute top-[130px] left-[273px] w-[1500px] h-[3px] bg-gray-300 rounded-full opacity-70"></div>

    {/* (Toàn bộ phần còn lại của form: upload ảnh, input...) */}
      <div className="absolute top-[156px] left-[305px] w-[1112px] h-[437px] bg-[#ffe8e2] rounded-[var(--shape-corner-extra-small)]" />

      <div 
        className={`
          absolute top-[601px] left-[305px] w-[1112px] 
          bg-[#ffe8e2] rounded-[var(--shape-corner-extra-small)]
          ${eventData.eventType === 'OFFLINE' ? 'h-[242px]' : 'h-28'}
          transition-all duration-300 ease-in-out
        `} 
      />

      <div className={`
        absolute left-[306px] w-[1112px] h-[242px] bg-[#ffe8e2] rounded-[var(--shape-corner-extra-small)]
        ${eventData.eventType === 'OFFLINE' ? 'top-[851px]' : 'top-[721px]'}
        transition-all duration-300 ease-in-out
      `} />

      <div className={`
        absolute left-[306px] w-[1112px] h-[249px] bg-[#ffe8e2] rounded-[var(--shape-corner-extra-small)]
        ${eventData.eventType === 'OFFLINE' ? 'top-[1101px]' : 'top-[971px]'}
        transition-all duration-300 ease-in-out
      `} />

    <div className="absolute top-[198px] left-[366px] w-[211px] h-[290px]">
      <label 
        htmlFor={!isAdmin ? "su-kien-upload" : undefined}
        className="absolute -top-px -left-px w-[211px] h-[292px] bg-white rounded-[10px] border border-dashed border-[#f7ad99] cursor-pointer flex items-center justify-center overflow-hidden"
      >
        {suKienPreview ? (
          <img src={suKienPreview} alt="Sự kiện" className="w-full h-full object-cover" />
        ) : (
          <p className="absolute top-[120px] w-full [font-family:'Montserrat-Light',Helvetica] font-light text-[#6e6e6e] text-xs text-center tracking-[0] leading-[normal]">
            Thêm sự kiện:
          </p>
        )}
      </label>
      <input 
        id="su-kien-upload"
        type="file" 
        disabled={isAdmin}
        accept="image/*" 
        onChange={handleSuKienChange} 
        className="hidden" 
      />
    </div>

    <div className={`
      absolute left-[341px] w-[174px] h-[188px]
      ${eventData.eventType === 'OFFLINE' ? 'top-[1118px]' : 'top-[988px]'}
      transition-all duration-300 ease-in-out
    `}>
      <label 
        htmlFor={!isAdmin ? "logo-upload" : undefined}
        className="w-[174px] h-[190px] border-[#f7ad99] absolute -top-px -left-px bg-white rounded-[10px] border border-dashed cursor-pointer flex items-center justify-center overflow-hidden"
      >
        {logoPreview ? (
          <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute top-[70px] left-[37px] w-[99px] [font-family:'Montserrat-Light',Helvetica] font-light text-[#6e6e6e] text-xs text-center tracking-[0] leading-[normal]">
            Logo BTC
          </div>
        )}
      </label>
      <input 
        id="logo-upload"
        type="file"
        disabled={isAdmin}
        accept="image/*"
        onChange={handleLogoChange} 
        className="hidden"
      />
    </div>

    <div className="absolute top-[198px] left-[604px] w-[747px] h-[290px]">
      <label 
        htmlFor={!isAdmin ? "banner-upload" : undefined}
        className="w-[747px] h-[292px] border-[#fad9d0] absolute -top-px -left-px bg-white rounded-[10px] border border-dashed cursor-pointer flex items-center justify-center overflow-hidden"
      >
        {bannerPreview ? (
          <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <p className="absolute top-[120px] left-[162px] w-[429px] [font-family:'Montserrat-Light',Helvetica] font-light text-[#6e6e6e] text-xs text-center tracking-[0] leading-[normal]">
            Thêm sự kiện để hiển thị ở vị trí khác
          </p>
        )}
      </label>
      <input 
        id="banner-upload"
        type="file"
        disabled={isAdmin}
        accept="image/*"
        onChange={handleBannerChange}
        className="hidden"
      />
    </div>

      <div className="absolute top-[165px] left-[366px] w-[86px] h-7">
        <div className="absolute top-0 left-0 w-[84px] h-7 bg-white rounded-[var(--shape-corner-large-increased)]" />

        <div className="absolute top-1.5 left-[5px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Upload ảnh
        </div>
      </div>

      <div className="absolute top-[499px] left-[366px] w-[86px] h-7">
        <div className="absolute top-0 left-0 w-[84px] h-7 bg-white rounded-[var(--shape-corner-large-increased)]" />

        <div className="absolute top-1.5 left-1.5 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Tên sự kiện
        </div>
      </div>

      <div className="absolute top-[609px] left-[339px] w-[173px] h-[29px]">
        <div className="left-[22px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />

        <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Hình thức sự kiện
        </div>
      </div>

      <div className="absolute top-[609px] left-[854px] w-[173px] h-[29px]">
        <div className="left-[18px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />

        <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Ngày tổ chức
        </div>
      </div>

      <div className={`
        absolute left-[339px] w-[173px] h-[29px]
        ${eventData.eventType === 'OFFLINE' ? 'top-[868px]' : 'top-[738px]'}
        transition-all duration-300 ease-in-out
      `}>
        <div className="left-[22px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />

        <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Thông tin sự kiện
        </div>
      </div>

      <div className={`
        absolute left-[513px] w-[173px] h-[29px]
        ${eventData.eventType === 'OFFLINE' ? 'top-[1216px]' : 'top-[1086px]'}
        transition-all duration-300 ease-in-out
      `}>
        {/* <div className="left-[22px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />

        <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Thông tin BTC
        </div> */}
      </div>

      <div className={`
        absolute left-[492px] w-[175px] h-[29px]
        ${eventData.eventType === 'OFFLINE' ? 'top-[1124px]' : 'top-[994px]'}
        transition-all duration-300 ease-in-out
      `}>
        <div className="left-[43px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />

        <div className="absolute top-[7px] left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Tên BTC
        </div>
      </div>

      <div className="absolute top-[535px] left-[366px] w-[992px] h-[31px] bg-white rounded-[var(--shape-corner-small)]" />

      <div className="absolute top-[644px] left-[872px] w-[481px] h-[31px] bg-white rounded-[var(--shape-corner-small)]" />

      <div className={`
        absolute left-[535px] w-[724px] h-[31px] bg-white rounded-[var(--shape-corner-small)]
        ${eventData.eventType === 'OFFLINE' ? 'top-[1169px]' : 'top-[1039px]'}
        transition-all duration-300 ease-in-out
      `} />
      <div className={`
  absolute left-[530px] w-[740px] h-[40px] bg-[#ffe8e2] z-50
  ${eventData.eventType === 'OFFLINE' ? 'top-[1255px]' : 'top-[1125px]'}
  transition-all duration-300 ease-in-out
`} />

      <div className={`
        absolute left-[535px] w-[724px] h-[31px] bg-white rounded-[var(--shape-corner-small)]
        ${eventData.eventType === 'OFFLINE' ? 'top-[1261px]' : 'top-[1131px]'}
        transition-all duration-300 ease-in-out
      `} />

    <div className={`
      absolute left-[361px] w-[972px] h-[130px] bg-white rounded-[var(--shape-corner-small)] p-3
      ${eventData.eventType === 'OFFLINE' ? 'top-[905px]' : 'top-[775px]'}
      transition-all duration-300 ease-in-out
    `}>
      <textarea 
        disabled={isAdmin}
        value={eventData.description || ''} // Map với biến description trong Context
        onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
        className="w-full h-full border-none focus:ring-0 outline-none resize-none [font-family:'Montserrat-Regular',Helvetica] text-sm"
        placeholder="Nhập Giới thiệu, Chi tiết, và Điều khoản sự kiện tại đây..."
      />
    </div>
      
      {/* Input "Ngày tổ chức" NẰM NGOÀI điều kiện, luôn hiển thị */}
      <input
        type="datetime-local"
        disabled={isAdmin}
        value={eventData.eventDate ? eventData.eventDate.substring(0, 16) : ''} 
        onChange={(e) => {
          const fullDateString = e.target.value + ":00+07:00";
          setEventData({ ...eventData, eventDate: fullDateString });
        }}
        className="absolute top-[643px] left-[872px] w-[450px] h-[31px] rounded-md border border-gray-300 px-4 text-xs [font-family:'Montserrat-Light',Helvetica] text-black placeholder:text-[#6e6e6e] bg-white"
      />

      {/* Bọc tất cả các trường địa chỉ trong khối điều kiện này */}
      {eventData.eventType === 'OFFLINE' && (
        <>
          {/* Tỉnh / Thành */}
          <div className="absolute top-[682px] left-[339px] w-[457px] h-[68px] flex flex-col gap-2">
            <div className="w-[173px] h-[29px] relative">
              <div className="left-[22px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />
              <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
                Tỉnh / Thành
              </div>
            </div>
            <div className="ml-[22px] w-[435px] h-[31px] bg-white rounded-[var(--shape-corner-small)]" />
          </div>

          {/* Phường / Xã */}
          <div className="absolute top-[761px] left-[339px] w-[457px] h-[68px] flex flex-col gap-2">
            <div className="w-[173px] h-[29px] relative">
              <div className="left-[22px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />
              <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
                Phường / Xã
              </div>
            </div>
            <div className="ml-[22px] w-[435px] h-[31px] bg-white rounded-[var(--shape-corner-small)]" />
          </div>

          {/* Số nhà, đường */}
          <div className="absolute top-[764px] left-[850px] w-[457px] h-[68px] flex flex-col gap-2">
            <div className="w-[173px] h-[29px] relative">
              <div className="left-[22px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />
              <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
                Số nhà, đường
              </div>
            </div>
            <div className="ml-[22px] w-[435px] h-[31px] bg-white rounded-[var(--shape-corner-small)]" />
          </div>

          {/* Quận / Huyện */}
          <div className="absolute top-[682px] left-[850px] w-[457px] h-[68px] flex flex-col gap-2">
            <div className="w-[173px] h-[29px] relative">
              <div className="left-[22px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />
              <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
                Quận / Huyện
              </div>
            </div>
            <div className="ml-[22px] w-[435px] h-[31px] bg-white rounded-[var(--shape-corner-small)]" />
          </div>
          
          {/* Input Tỉnh / Thành */}
          <input
            type="text"
            disabled={isAdmin}
            value={eventData.province || ''}
            onChange={(e) => setEventData({ ...eventData, province: e.target.value })}
            placeholder="Tỉnh / Thành"
            className="absolute top-[719px] left-[361px] w-[450px] h-[31px] rounded-md border border-gray-300 px-4 text-xs [font-family:'Montserrat-Light',Helvetica] text-black placeholder:text-[#6e6e6e] bg-white"
          />
          
          {/* Input Quận / Huyện */}
          <input
            type="text"
            disabled={isAdmin}
            value={eventData.district || ''}
            onChange={(e) => setEventData({ ...eventData, district: e.target.value })}
            placeholder="Quận / Huyện"
            className="absolute top-[719px] left-[872px] w-[450px] h-[31px] rounded-md border border-gray-300 px-4 text-xs [font-family:'Montserrat-Light',Helvetica] text-black placeholder:text-[#6e6e6e] bg-white"
          />
          
          {/* Input Số nhà, đường */}
          <input
            type="text"
            disabled={isAdmin}
            value={eventData.address || ''}
            onChange={(e) => setEventData({ ...eventData, address: e.target.value })}
            placeholder="Số nhà, đường"
            className="absolute top-[799px] left-[872px] w-[450px] h-[31px] rounded-md border border-gray-300 px-4 text-xs [font-family:'Montserrat-Light',Helvetica] text-black placeholder:text-[#6e6e6e] bg-white"
          />
          
          {/* Input Phường / Xã */}
          <input
            type="text"
            disabled={isAdmin}
            value={eventData.ward || ''}
            onChange={(e) => setEventData({ ...eventData, ward: e.target.value })}
            placeholder="Phường / Xã"
            className="absolute top-[799px] left-[361px] w-[450px] h-[31px] rounded-md border border-gray-300 px-4 text-xs [font-family:'Montserrat-Light',Helvetica] text-black placeholder:text-[#6e6e6e] bg-white"
          />
        </>
      )}
      
      <input
        type="text"
        disabled={isAdmin}
        value={eventData.eventName || ''}
        onChange={(e) => setEventData({ ...eventData, eventName: e.target.value })}
        placeholder="Tên sự kiện"
        className="absolute top-[535px] left-[366px] w-[992px] h-[31px] rounded-md border border-gray-300 px-4 text-xs [font-family:'Montserrat-Light',Helvetica] text-black placeholder:text-[#6e6e6e] bg-white"
      />
      
      <input
        type="text"
        disabled={isAdmin}
        value={eventData.organizerName || ''}
        onChange={(e) => setEventData({ ...eventData, organizerName: e.target.value })}
        placeholder="Tên BTC"
        className={`
          absolute left-[535px] w-[785px] h-[31px] rounded-md border border-gray-300 px-4 text-xs 
          [font-family:'Montserrat-Light',Helvetica] text-black placeholder:text-[#6e6e6e] bg-white
          ${eventData.eventType === 'OFFLINE' ? 'top-[1167px]' : 'top-[1037px]'}
          transition-all duration-300 ease-in-out
        `}
      />
      {/* <input
        type="text"
        disabled={isAdmin}
        value={eventData.organizerInfo || ''}
        onChange={(e) => setEventData({ ...eventData, organizerInfo: e.target.value })}
        placeholder="Thông tin BTC"
        className={`
          absolute left-[535px] w-[785px] h-[31px] rounded-md border border-gray-300 px-4 text-xs 
          [font-family:'Montserrat-Light',Helvetica] text-black placeholder:text-[#6e6e6e] bg-white
          ${eventData.eventType === 'OFFLINE' ? 'top-[1259px]' : 'top-[1129px]'}
          transition-all duration-300 ease-in-out
        `}
      /> */}

      <div className="absolute top-[646px] left-[366px] w-5 h-5 bg-white rounded-[10px]" />

      <div className="absolute top-[646px] left-[542px] w-5 h-5 bg-white rounded-[10px]" />

      <div 
          className={`
             absolute top-[646px] left-[366px] flex items-center
             ${isAdmin ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} 
          `}
          onClick={() => !isAdmin && setEventData({ ...eventData, eventType: 'OFFLINE' })}
      >
          {/* Vòng tròn radio */}
          <div className="w-5 h-5 flex items-center justify-center bg-white rounded-full">
              {eventData.eventType === 'OFFLINE' && (
                  <div className="w-3.5 h-3.5 bg-[#f94f2f] rounded-full" />
              )}
          </div>
          {/* Nhãn */}
          <div className={`
              w-auto ml-[7px] [font-family:'Montserrat-Bold',Helvetica] font-bold text-xs 
              ${eventData.eventType === 'OFFLINE' ? 'text-[#f94f2f]' : 'text-black'}
          `}>
              Sự kiện OFFLINE
          </div>
      </div>

      <div 
          className={`
             absolute top-[646px] left-[542px] flex items-center
             ${isAdmin ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'} 
          `}
          onClick={() => !isAdmin && setEventData({ ...eventData, eventType: 'ONLINE' })}
      >
          {/* Vòng tròn radio */}
          <div className="w-5 h-5 flex items-center justify-center bg-white rounded-full">
              {eventData.eventType === 'ONLINE' && (
                  <div className="w-3.5 h-3.5 bg-[#f94f2f] rounded-full" />
              )}
          </div>
          {/* Nhãn */}
          <div className={`
              w-auto ml-[7px] [font-family:'Montserrat-Bold',Helvetica] font-bold text-xs 
              ${eventData.eventType === 'ONLINE' ? 'text-[#f94f2f]' : 'text-black'}
          `}>
              Sự kiện ONLINE
          </div>
      </div>

      <div className="absolute top-[174px] left-[1798px] w-[173px] h-[29px]">
        <div className="left-[22px] absolute top-0 w-[131px] h-[29px] bg-white rounded-[var(--shape-corner-large-increased)]" />

        <div className="absolute top-1.5 left-0 w-[171px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Hình thức sự kiện
        </div>
      </div>

      {/* Khối div bên ngoài bị lồng đã bị xóa */}
      {!isAdmin && (
          <div className="mt-[17px] w-[102px] h-[45px] relative ml-[989px]">
          <button
            onClick={() => { setEventData({}); navigate('/')} }
              className="flex items-center justify-center w-[108px] h-[45px] rounded-full bg-[#FF5331] text-white text-xs font-semibold [font-family:'Montserrat-SemiBold',Helvetica] shadow-[0_4px_8px_rgba(0,0,0,0.25)] border-none outline-none"
          >
              Tạo sự kiện
          </button>
          </div>
      )}

      {isAdmin ? <AdminHeader /> : <OrganizerHeader />}
    </div>
  );
};
export default EventPage1;