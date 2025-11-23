import React, { useContext} from 'react'; 
import { EventContext } from '../../context/EventContext'; // 2. Import "giỏ hàng" Context
import { useNavigate } from 'react-router-dom';
import { QlementineIconsMoney16 } from "../../Elements/QlementineIconsMoney16";
import { Calendar } from "../../Elements/Calendar";
import PaymentForm from "./PaymentForm";
import { v4 as uuidv4 } from 'uuid';
import rectangle7 from "../../Elements/rectangle-7.png";
// import rectangle202 from "./rectangle-20.svg";
import rectangle21 from "../../Elements/rectangle-21.svg";
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

export const EventPage4 = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const { eventData, setEventData } = useContext(EventContext);

  



  const handleCompleteClick = () => {
    // 1. Lấy danh sách sự kiện cũ
    const storedEvents = JSON.parse(localStorage.getItem('myEvents')) || [];
    
    let updatedEvents;
    
    // 2. Kiểm tra xem đây là "Tạo mới" hay "Chỉnh sửa"
    if (eventData.id) {
      // TRƯỜNG HỢP 1: CHỈNH SỬA (Sự kiện đã có ID)
      // Dùng map để tìm và thay thế sự kiện cũ bằng eventData mới
      updatedEvents = storedEvents.map(event => 
        event.id === eventData.id ? eventData : event
      );
      alert('Đã cập nhật sự kiện thành công!');

    } else {
      // TRƯỜNG HỢP 2: TẠO MỚI (Sự kiện chưa có ID)
      // Tạo một sự kiện mới với ID duy nhất và trạng thái "Chờ duyệt"
      const newEvent = { 
        ...eventData, 
        id: uuidv4(), // <--- Gán ID duy nhất
        status: 'Chờ duyệt' // Gán trạng thái
      };
      
      // Thêm sự kiện mới vào danh sách
      updatedEvents = [...storedEvents, newEvent];
      alert('Đã tạo mới sự kiện thành công!');
    }

    // 3. Lưu danh sách đã cập nhật vào localStorage
    localStorage.setItem('myEvents', JSON.stringify(updatedEvents));

    // 4. Xóa "giỏ hàng" (Context) để chuẩn bị cho lần tạo mới tiếp theo
    setEventData({});

    // 5. Điều hướng về trang "Sự kiện của tôi"
    
    navigate('/su-kien-cua-toi');
  };


  // Duyệt / Hủy của Admin
  const handleAdminAction = (action) => {
    // 1. Lấy danh sách hiện tại từ localStorage
    let storedEvents = JSON.parse(localStorage.getItem('myEvents')) || [];
    
    // 2. Kiểm tra xem sự kiện này đã có trong localStorage chưa
    const existingIndex = storedEvents.findIndex(e => e.id === eventData.id);

    const newStatus = action === 'approve' ? 'Sắp tới' : 'Bị hủy';

    if (existingIndex !== -1) {
      // TRƯỜNG HỢP 1: Đã có trong DB -> Cập nhật (Update)
      console.log("Sự kiện đã có trong DB, đang cập nhật...");
      storedEvents[existingIndex] = {
        ...storedEvents[existingIndex],
        status: newStatus
      };
    } else {
      // TRƯỜNG HỢP 2: Chưa có trong DB (Là Mock Data) -> Thêm mới (Insert)
      console.log("Sự kiện Mock chưa có trong DB, đang thêm mới...");
      
      // Tạo bản ghi mới dựa trên dữ liệu hiện tại (eventData)
      const newEventRecord = {
        ...eventData,       // Lấy toàn bộ thông tin (ảnh, tên, vé...)
        status: newStatus   // Ghi đè trạng thái mới
      };
      
      storedEvents.push(newEventRecord);
    }

    // 3. Lưu ngược lại vào localStorage
    localStorage.setItem('myEvents', JSON.stringify(storedEvents));
    
    // 4. Thông báo và chuyển trang
    alert(`Đã xử lý thành công! Trạng thái chuyển thành: "${newStatus}"`);
    navigate('/admin/danh-sach-su-kien'); 
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

      {/* Nút Lưu */}
      {!isAdmin ? (
        // --- NÚT CỦA USER ---
        <div 
            className="absolute top-[85px] left-[1320px] w-[102px] h-[45px] cursor-pointer"
            onClick={handleCompleteClick}
          >
            <img className="absolute top-0 -left-1 w-[108px] h-[53px]" alt="Rectangle" src={rectangle21} />
            <div className="absolute top-[15px] left-[40px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[#f94f2f] text-xs text-center tracking-[0] leading-[normal]">
              Lưu
            </div>
        </div>
      ) : (
        // --- NÚT CỦA ADMIN ---
        <div className="absolute top-[85px] left-[1250px] flex gap-3">
            <button 
                onClick={() => handleAdminAction('reject')}
                className="h-11 rounded-lg bg-white border border-red-500 text-red-500 px-4 py-2 font-bold hover:bg-red-50 text-xs transition"
            >
                Từ chối ✕
            </button>
            <button 
              
                onClick={() => handleAdminAction('approve')}
                className="bg-[#f94f2f] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d13a1e] text-xs shadow-md transition border-none"
                // img className="absolute top-0 -left-1 w-[108px] h-[53px]" alt="Rectangle" src={rectangle21}
            >
                Duyệt ✓
            </button>
        </div>
      )}

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
      <div className="absolute top-[88px] left-[286px] w-[148px] h-8 flex gap-1 ">
        <div className="w-[34px] h-8 relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl" />

          <div className="left-3.5 absolute top-2 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            1
          </div>
        </div>

        <div className="mt-2 w-[108px] h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
          Thông tin sự kiện
        </div>
      </div>

      <div className="absolute top-[90px] left-[572px] w-[150px] h-8 flex gap-0.5">
        <div className="w-[34px] h-8 relative">
          <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl" />

          <div className="absolute top-2 left-[13px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            2
          </div>
        </div>

        <p className="mt-2 w-28 h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
          Thời gian &amp; loại vé
        </p>
      </div>

      <div className="absolute top-[90px] left-[827px] w-[334px] h-[34px] flex">
        <div className="w-[92px] flex gap-3">
          <div className="w-[34px] h-8 relative">
            <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl" />

            <div className="absolute top-2 left-[13px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
              3
            </div>
          </div>

          <div className="mt-2 w-11 h-[15px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            Cài đặt
          </div>
        </div>

        <div className="mt-0.5 w-[34px] h-8 relative ml-[69px]">
          <div className="absolute top-0 left-0 w-8 h-8 bg-white rounded-2xl" />

          <div className="left-3 absolute top-2 [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
            4
          </div>
        </div>

        <div className="mt-2.5 w-[132px] h-[15px] ml-[5px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center tracking-[0] leading-[normal]">
          Thông tin thanh toán
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

        <div className="absolute top-[150px] left-[300px] p-8">
            <PaymentForm isAdmin={isAdmin} />
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
         {/* Line */}
    <div className="absolute top-[130px] left-[273px] w-[1500px] h-[3px] bg-gray-300 rounded-full opacity-70"></div>

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
export default EventPage4;
