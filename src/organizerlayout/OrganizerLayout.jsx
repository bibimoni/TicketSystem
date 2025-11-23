import React from "react";
import { useNavigate, Outlet } from 'react-router-dom';
import { QlementineIconsMoney16 } from "../Elements/QlementineIconsMoney16";
import { Calendar } from "../Elements/Calendar";
// import EventsPage from "./EventsPage";
// import BtcTermsPage from "./BtcTermsPage";
import rectangle7 from "../Elements/rectangle-7.png";
import rectangle622 from "../Elements/rectangle-62.png";
import rectangle62 from "../Elements/rectangle-62.png";
import rectangle53 from "../Elements/rectangle-53.svg";
import rectangle56 from "../Elements/rectangle-56.svg";
import rectangle57 from "../Elements/rectangle-57.svg";
import rectangle58 from "../Elements/rectangle-58.svg";
import ticke12 from "../Elements/ticke-1-2.png";
import TICKETZ_LOGO from '../Elements/ticketZ.png';
import OrganizerHeader from "../information/OrganizerHeader";
import AdminHeader from "../information/AdminHeader";

export const OrganizerLayout = ({ isAdmin = false }) => {
   const navigate = useNavigate();
   
  // const handleContinueClick = () => {
  //   navigate('/su-kien-cua-toi');
  // };

  return (
    <div className="bg-[#d9d9d9] overflow-hidden border border-solid border-[#d9d9d9] w-full min-w-[1440px] min-h-[1905px] relative">

     {/* Sidebar và Header */}
     
           <div className="absolute top-[29px] left-[306px] w-[203px] [font-family:font-poppins font-extrabold,Helvetica] font-black italic text-[#f94f2f] text-xl text-center tracking-[0] leading-[normal] z-[10]">
            ĐIỀU KHOẢN BAN TỔ CHỨC
          </div>
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
      {/* <div 
            className="absolute top-[85px] left-[1320px] w-[102px] h-[45px] cursor-pointer" // Thêm cursor-pointer
            onClick={handleContinueClick} // Gán sự kiện onClick vào đây
          >
            <img className="absolute top-0 -left-1 w-[108px] h-[53px]" alt="Rectangle" src={rectangle202} />
        <img className="absolute top-0 -left-1 w-[108px] h-[53px]" alt="Rectangle" src={rectangle21} />
        <div className="absolute top-[15px] left-[38px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
          Lưu
        </div>
      </div> */}

      {/* Logo và Sidebar */}
      <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
              <img
                className="absolute top-0 left-0 w-[63px] h-[63px] object-contain" // <-- Điều chỉnh lại class
                alt="ticketZ Logo"
                src={TICKETZ_LOGO}
              />
            </div>
      
            <div 
              onClick={() => navigate('/su-kien-cua-toi')}
              className="absolute top-[27px] left-[89px] [font-family:'Moul-Regular',Helvetica] font-normal text-white text-xl text-center tracking-[0] leading-[15px]">
              Organizer <br />
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

     
      {/* Sidebar buttons */}
      <div className="absolute top-[223px] left-[19px] w-60 h-[54px]">
              <img
                className="absolute top-0 left-0 w-[238px] h-[54px]"
                alt="Rectangle"
                src={rectangle622}
              />
      
              <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs tracking-[0] leading-[normal]">
                Điều khoản BTC
              </div>
      
              <QlementineIconsMoney16 className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
            </div>

            <div className="absolute w-[238px] h-[54px] top-[140px] left-[19px] flex">
              <div
                onClick={() => navigate('/su-kien-cua-toi')}
                className="
                  w-60 h-[54px] relative cursor-pointer
                  overflow-hidden transform
                  transition-all duration-150
                  active:scale-95
                  shadow-md hover:shadow-lg active:shadow-sm
                "
              >
                <img
                  className="absolute top-0 left-0 w-[238px] h-[54px]"
                  alt="Rectangle"
                  src={rectangle62}
                />

                <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
                  Sự kiện của tôi
                </div>
                <Calendar className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
              </div>
            </div>



        
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
              <div className="absolute top-[100px] left-[310px]"> 
                  <Outlet />
              </div>

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
export default OrganizerLayout;
