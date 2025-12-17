import React from "react";
import { useNavigate } from 'react-router-dom';
import { QlementineIconsMoney16 } from "../Elements/QlementineIconsMoney16";
import { StashUserAvatar } from "../Elements/StashUserAvatar";
import { Calendar } from "../Elements/Calendar";
import EventsPage from "./EventsPage";
import rectangle7 from "../Elements/rectangle-7.png";
import rectangle622 from "../Elements/rectangle-62.png";
import rectangle62 from "../Elements/rectangle-62.png";
import rectangle53 from "../Elements/rectangle-53.svg";
import rectangle56 from "../Elements/rectangle-56.svg";
import rectangle57 from "../Elements/rectangle-57.svg";
import rectangle58 from "../Elements/rectangle-58.svg";
import ticke12 from "../Elements/ticke-1-2.png";
import TICKETZ_LOGO from '../Elements/ticketZ.png';
import { FiHome } from "react-icons/fi";
import OrganizerHeader from "../information/OrganizerHeader";
import AdminHeader from "../information/AdminHeader";

export const MyEventsPage = ({ isAdmin = false }) => {
   const navigate = useNavigate();
  
  return (
    <div className="flex w-full h-screen bg-[#fff8f7] overflow-hidden">
      
     {/* Sidebar và Header */}
     
           <div className="absolute top-[29px] left-[306px] w-[203px] [font-family:font-poppins font-extrabold,Helvetica] font-black italic text-[#f94f2f] text-xl text-center tracking-[0] leading-[normal] z-[10]">
            {isAdmin ? "DANH SÁCH SỰ KIỆN" : "SỰ KIỆN CỦA TÔI"}
          </div>
           <div className="absolute top-[72px] h-[1511px] left-[272px] right-0 bottom-0 bg-[#fff8f7]" />
           <div className="absolute top-0 left-0 w-[272px] h-[2000px] bg-[#f94f2f]" />
           <img className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]" alt="Rectangle" src={rectangle7} />
           
      {/* Logo và Sidebar */}
      <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
        <img
          className="absolute top-0 left-0 w-[63px] h-[63px] object-contain"
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
      {/* {!isAdmin && (
          <div className="mt-[17px] w-[102px] h-[45px] relative ml-[989px]">
          <button
              onClick={() => navigate('/tao-su-kien')} 
              className="flex items-center justify-center w-[108px] h-[45px] rounded-full bg-[#FF5331] text-white text-xs font-semibold [font-family:'Montserrat-SemiBold',Helvetica] shadow-[0_4px_8px_rgba(0,0,0,0.25)] border-none outline-none"
          >
              Tạo sự kiện
          </button>
          </div>
      )} */}

      {isAdmin ? <AdminHeader /> : <OrganizerHeader />}

     
      {/* Sidebar buttons */}
      <div 
              className={`absolute w-[238px] h-[54px] left-[19px] flex ${isAdmin ? 'top-[223px]' : 'top-[140px]'}`}
            >
              <div 
                onClick={() => navigate(isAdmin? '/admin/danh-sach-su-kien' : '/su-kien-cua-toi')}
                className="w-60 h-[54px] relative cursor-pointer"
              >
                <img
                  className="absolute top-0 left-0 w-[238px] h-[54px]"
                  alt="Rectangle"
                  src={rectangle62}
                />
      
                <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
                  {isAdmin? "Danh sách sự kiện" : "Sự kiện của tôi"}
                </div>
                
                <Calendar className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
              </div>
            </div>
      
            <div 
              className={`absolute left-[19px] w-60 h-[54px] ${isAdmin ? 'top-[140px]' : 'top-[223px]'}`}
            >
               <div
                  onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dieu-khoan-BTC')}
                  className="w-full h-full relative cursor-pointer"
               >
                  <img
                    className="absolute top-0 left-0 w-[238px] h-[54px]"
                    alt="Rectangle"
                    src={rectangle622}
                  />
      
                  <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs tracking-[0] leading-[normal]">
                    {isAdmin? "Dashboard" : "Điều khoản BTC"}
                  </div>
      
                  {isAdmin ? (
                     <FiHome className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1] text-black" />
                  ) : (
                     <QlementineIconsMoney16 className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
                  )}
               </div>
            </div>

        {/* === KHU VỰC HIỂN THỊ DANH SÁCH SỰ KIỆN (Đã fix tràn viền) === */}
        {/* Thêm w-[1150px] và h-[1350px] cùng với overflow-y-auto để tạo thanh cuộn riêng cho khu vực này */}
        {/* scrollbar-hide là class của tailwind-scrollbar-hide plugin nếu bạn có cài, hoặc dùng CSS ẩn thanh cuộn */}
        <div className="absolute top-[150px] left-[272px] right-0 h-[1350px] overflow-y-auto overflow-x-hidden scrollbar-hide bg-[#fff8f7]">
            <EventsPage isAdmin={isAdmin} />
        </div>
        
        {/* Footer */}
        {/* Container bao ngoài Footer: thêm relative */}
<div className="absolute top-[1511px] left-0 w-full h-[581px]">
    <div className="absolute top-0 left-0 w-full h-full bg-[#5d5c5c]" />
    
    <img className="relative top-[60px] left-[121px] w-[345px] h-[113px] aspect-[3.05]" alt="Ticke" src={ticke12} />

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
export default MyEventsPage;