import React from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { QlementineIconsMoney16 } from "../../Elements/QlementineIconsMoney16";
import { Calendar } from "../../Elements/Calendar";
import EventSettingsSection from "./EventSettingsSection";
import rectangle7 from "../../Elements/rectangle-7.png";
//import rectangle202 from "./rectangle-20.svg";
// import rectangle212 from "../../Elements/rectangle-21-2.png";
//import rectangle21 from "./rectangle-21.svg";
import rectangle622 from "../../Elements/rectangle-62.png";
import rectangle62 from "../../Elements/rectangle-62.png"; 
import rectangle53 from "../../Elements/rectangle-53.svg";
import rectangle56 from "../../Elements/rectangle-56.svg";
import rectangle57 from "../../Elements/rectangle-57.svg";
import rectangle58 from "../../Elements/rectangle-58.svg";
import ticke12 from "../../Elements/ticke-1-2.png";
import TICKETZ_LOGO from '../../Elements/ticketZ.png';
import OrganizerHeader from "../../information/OrganizerHeader";
import AdminHeader from "../../information/AdminHeader";
import { FiHome } from "react-icons/fi";

export const EventPage3 = ({ isAdmin = false })  => {
  const navigate = useNavigate();
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

  // const handleContinueClick = () => {
  //    if (isAdmin) {
  //       navigate(`/admin/duyet-su-kien/${eventId}/buoc-4`);
  //   }
  //   else {
  //     if (eventId) {
  //       navigate(`/event-edit/${eventId}/buoc-4`);
  //     } else {
  //       navigate('/tao-su-kien/buoc-4');
  //     }
  //   }
    
  // };

  return (
    <div className="bg-[#d9d9d9] overflow-hidden border border-solid border-[#d9d9d9] w-full min-w-[1440px] min-h-[1905px] relative">
    
          {/* Sidebar và Header */}
          <div className="absolute top-[72px] left-[267px] right-0 h-[1439px] bg-[#fff8f7]" />
          <div className="absolute top-0 left-0 w-[272px] h-[1511px] bg-[#f94f2f]" />
          <img className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]" alt="Rectangle" src={rectangle7} />
          

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
      
            


      {isAdmin ? <AdminHeader /> : <OrganizerHeader />}

      {/* Thanh bước */}
      {/* --- BƯỚC 1: Thông tin sự kiện --- */}
      <div className="absolute top-[88px] left-[272px] right-0 flex justify-center z-20">
    
    {/* Khung giới hạn chiều rộng (bằng với chiều rộng Form bên dưới để thẳng hàng) */}
    <div className="w-full max-w-[1112px] flex items-center justify-between px-4">

        {/* --- BƯỚC 1 --- */}
        <div 
            onClick={() => handleStepClick(1)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        >
            <div className="w-[34px] h-8 relative">
                <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200 shadow-sm" />
                <div className="absolute top-2 left-3.5 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center">
                    1
                </div>
            </div>
            <div className="[font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center whitespace-nowrap">
                Thông tin sự kiện
            </div>
        </div>

        {/* --- BƯỚC 2 --- */}
        <div 
            onClick={() => handleStepClick(2)} 
            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        >
            <div className="w-[34px] h-8 relative">
                <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200 shadow-sm" />
                <div className="absolute top-2 left-[13px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center">
                    2
                </div>
            </div>
            <div className="[font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center whitespace-nowrap">
                Thời gian &amp; loại vé
            </div>
        </div>

        {/* --- BƯỚC 3 --- */}
        <div 
            onClick={() => handleStepClick(3)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        >
            <div className="w-[34px] h-8 relative">
                <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200 shadow-sm" />
                <div className="absolute top-2 left-[13px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center">
                    3
                </div>
            </div>
            <div className="[font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center whitespace-nowrap">
                Cài đặt
            </div>
        </div>

        {/* --- BƯỚC 4 --- */}
        <div 
            onClick={() => handleStepClick(4)}
            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
        >
            <div className="w-[34px] h-8 relative">
                <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl border border-gray-200 shadow-sm" />
                <div className="absolute top-2 left-3 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center">
                    4
                </div>
            </div>
            <div className="[font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center whitespace-nowrap">
                Thông tin thanh toán
            </div>
        </div>
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

            
             <div className="p-8">
                <EventSettingsSection isAdmin={isAdmin} />
            </div>
        <div className="absolute top-[1511px] left-0 right-0 h-[581px]">
                  <div className="absolute top-0 left-0 w-full h-full bg-[#5d5c5c]" />
                              
                              <img className="absolute top-[60px] left-[121px] w-[345px] h-[113px] aspect-[3.05]" alt="Ticke" src={ticke12} />
                          
                              {/* === CÁC CỘT NỘI DUNG (Neo phải) === */}
                              
                              {/* CỘT 1: THÔNG TIN (Ngoài cùng bên phải) */}
                              {/* Thay left-[1337px] bằng right-[50px] */}
                              <div className="absolute top-0 right-[200px] w-[100px] h-full">
                                  <div className="absolute top-[60px] w-full [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-xs text-center text-white">THÔNG TIN</div>
                                  <div className="absolute top-[90px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] text-center text-white whitespace-nowrap">Thông báo</div>
                                  <div className="absolute top-[109px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] text-center text-white whitespace-nowrap">About us</div>
                                  <div className="absolute top-32 w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] text-center text-white whitespace-nowrap">FAQs</div>
                                  <div className="absolute top-[147px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] text-center text-white whitespace-nowrap">Góp ý</div>
                              </div>
                          
                              {/* CỘT 2: LIÊN HỆ (Cách phải 180px) */}
                              {/* Thay left-[1217px] bằng right-[180px] */}
                              <div className="absolute top-0 right-[400px] w-[100px] h-full">
                                  <div className="absolute top-[60px] w-full [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center">LIÊN HỆ</div>
                                  <div className="absolute top-[90px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Hotline: 033.33.333</div>
                                  <div className="absolute top-[109px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Chatbot hỗ trợ</div>
                              </div>
                          
                              {/* CỘT 3: QUY ĐỊNH (Cách phải 400px) */}
                              {/* Thay left-[972px] bằng right-[400px] */}
                              <div className="absolute top-0 right-[600px] w-[150px] h-full">
                                  <div className="absolute top-[60px] w-full [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center">QUY ĐỊNH</div>
                                  <div className="absolute top-[90px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Hợp đồng</div>
                                  <div className="absolute top-[109px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Điều khoản &amp; Điều kiện</div>
                                  <div className="absolute top-32 w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Chính sách bảo vệ người dùng</div>
                              </div>
                          
                              {/* CỘT 4: GIỚI THIỆU (Cách phải 600px) */}
                              {/* Thay left-[851px] bằng right-[600px] */}
                              <div className="absolute top-0 right-[800px] w-[100px] h-full">
                                  <div className="absolute top-[60px] w-full [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center">GIỚI THIỆU</div>
                                  <div className="absolute top-[90px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Giới thiệu về TickeZ.</div>
                              </div>
                          
                              {/* Social Icons & Follow Us - Giữ nguyên vị trí Left vì nó nằm bên trái */}
                              <div className="absolute top-[199px] left-[121px] [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center">FOLLOW US</div>
                              <img className="absolute top-[221px] left-[121px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle53} />
                              <img className="absolute top-[221px] left-[182px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle56} />
                              <img className="absolute top-[221px] left-[243px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle57} />
                              <img className="absolute top-[221px] left-[304px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle58} />
                          
                              {/* Dòng Version: Cho nó căn giữa hoặc căn phải dưới cùng */}
                              <p className="absolute top-[309px] left-0 w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap opacity-70">
                              Bạn đang truy cập TickeZ. phiên bản Số 123456789
                          </p>
                          
                          </div>
         {/* Line */}
    <div className="absolute top-[130px] left-[273px] right-0 h-[3px] bg-gray-300 rounded-full opacity-70"></div>

    </div>
  );
};
const MenuItem = ({ text, onClick }) => {
  // Map tên với emoji
  const icons = {
    "Vé của tôi": "🎫",
    "Sự kiện của tôi": "📅",
    "Tài khoản của tôi": "👨‍💻",
    "Đăng xuất": "➔"
  };

  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-3 w-full text-left
        px-4 py-3 text-sm text-gray-700 
        hover:bg-gray-100 hover:text-gray-900
        transition-colors duration-150
        border-none bg-transparent cursor-pointer
      "
    >
      <span className="text-lg w-6 text-center">{icons[text] || '•'}</span>
      <span>{text}</span>
    </button>
  );
};
export default EventPage3;
