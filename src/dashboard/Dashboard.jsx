import React, {useState} from "react";
import { useNavigate } from 'react-router-dom';
// Import Icons
import { StashUserAvatar } from "../Elements/StashUserAvatar";
import { Calendar } from "../Elements/Calendar";
import { FiHome } from "react-icons/fi";
// Import hình ảnh
import rectangle7 from "../Elements/rectangle-7.png";
import rectangle622 from "../Elements/rectangle-62.png";
import rectangle62 from "../Elements/rectangle-62.png";
import rectangle53 from "../Elements/rectangle-53.svg";
import rectangle56 from "../Elements/rectangle-56.svg";
import rectangle57 from "../Elements/rectangle-57.svg";
import rectangle58 from "../Elements/rectangle-58.svg";
import ticke12 from "../Elements/ticke-1-2.png";
import TICKETZ_LOGO from '../Elements/ticketZ.png';
import { mockDashboardData } from '../context/mockDashboardData'; 
import { defaultAdminInfo } from '../context/mockAdminInfo';

// Import Recharts & Mock Data
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from 'recharts';

const getAdminData = () => {
    const savedData = localStorage.getItem("adminProfileData");
    return savedData ? JSON.parse(savedData) : defaultAdminInfo;
  };
  const adminData = getAdminData();

const Dashboard = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  // Format tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-[#d9d9d9] overflow-hidden border border-solid border-[#d9d9d9] w-full min-w-[1440px] min-h-[1905px] relative">

      {/* === BACKGROUND & SIDEBAR === */}
      <div className="absolute top-[0px] left-[267px] w-[1500px] h-[1539px] bg-white  " />
      <div className="absolute top-0 left-0 w-[272px] h-[1511px] bg-[#f94f2f]" />
      <img className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]" alt="bg" src={rectangle7} />
      
      {/* === LOGO === */}
      <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
        <img className="absolute top-0 left-0 w-[63px] h-[63px] object-contain" alt="Logo" src={TICKETZ_LOGO} />
      </div>
      <div 
        onClick={() => navigate('/admin/dashboard')}
        className="absolute top-[27px] left-[89px] [font-family:'Moul-Regular',Helvetica] font-normal text-white text-xl text-center cursor-pointer leading-[15px]">
        Admin <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; center
      </div>

      <div className="absolute top-[40px] right-[60px] z-50 flex items-center gap-4"> 
          
          {/* Text thông tin */}
          <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-[#4A3B32] leading-none mb-1">
                  {adminData.fullName}
              </p>
              <p className="text-[11px] text-gray-500 font-medium leading-none">
                  Administrator
              </p>
          </div>

          {/* Avatar & Menu Dropdown */}
          <div className="relative">
              {/* Nút Avatar - Thêm cursor-pointer và hover effect nhẹ */}
              <img 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  src={adminData.avatar || TICKETZ_LOGO} 
                  alt="Avatar" 
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
              />

              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-2 animate-fadeIn">
                  <MenuItem 
                      text="Tài khoản của tôi" 
                      onClick={() => navigate('/admin/tai-khoan-cua-toi')} 
                  />
                  <div className="h-px bg-gray-100 my-1 mx-4" />
                  <MenuItem 
                      text="Đăng xuất" 
                      onClick={() => { /* Logic logout */ }} 
                  />
                </div>
              )}
          </div>
      </div>


      {/* === SIDEBAR BUTTONS === */}
      <div className="absolute left-[19px] w-60 h-[54px] top-[140px]">
         <div onClick={() => navigate('/admin/dashboard')} className="w-full h-full relative cursor-pointer">
            <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="btn" src={rectangle622} />
            <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs">Dashboard</div>
            <FiHome className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1] text-black" />
         </div>
      </div>
      <div className="absolute w-[238px] h-[54px] left-[19px] top-[223px] flex">
        <div onClick={() => navigate('/admin/danh-sach-su-kien')} className="w-60 h-[54px] relative cursor-pointer">
          <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="btn" src={rectangle62} />
          <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center">Danh sách sự kiện</div>
          <Calendar className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
        </div>
      </div>

      {/* === NỘI DUNG DASHBOARD === */}
      <div className="absolute top-[20px] left-[300px] w-[1150px] pb-20">
        
        {/* Header Text nằm trong nội dung */}
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#4A3B32]">Welcome back, Admin</h1>
            <p className="text-gray-500 text-sm mt-1"> {currentDate}</p>
        </div>

        {/* 4 Thẻ Thống kê */}
        <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="TỔNG DOANH THU" 
                value={formatCurrency(mockDashboardData.summary.totalRevenue)} 
                subtext="Toàn thời gian"
            />
            <StatCard 
                title="VÉ ĐÃ BÁN" 
                value={mockDashboardData.summary.ticketsSold} 
                subtext="Vé đã thanh toán"
            />
            <StatCard 
                title="SỰ KIỆN CHỜ DUYỆT" 
                value={mockDashboardData.summary.pendingEvents} 
                subtext="Cần xử lý ngay"
            />
            <StatCard 
                title="SỰ KIỆN SẮP TỚI" 
                value={mockDashboardData.summary.upcomingEvents} 
                subtext="Đã duyệt & Public"
            />
        </div>

        {/* Hàng Biểu đồ Giữa */}
        <div className="grid grid-cols-2 gap-6 mb-20 h-[380px]">
            {/* Pie Chart */}
            <div className="bg-[#FFF5F0] rounded-xl p-6 shadow-sm border border-[#FFE0D1]">
                <h3 className="text-[#4A3B32] font-bold text-lg mb-4">Thống kê trạng thái sự kiện</h3>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={mockDashboardData.eventStatus}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {mockDashboardData.eventStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-[#FFF5F0] rounded-xl p-6 shadow-sm border border-[#FFE0D1]">
                <h3 className="text-[#4A3B32] font-bold text-lg mb-4">Phân bố theo khu vực</h3>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical" 
                            data={mockDashboardData.locations}
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} style={{ fontSize: '12px', fontWeight: '600' }} />
                            <Tooltip cursor={{fill: 'transparent'}} />
                            <Bar dataKey="count" fill="#F2994A" radius={[0, 4, 4, 0]} barSize={30} name="Số lượng vé" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* Line Chart */}
        <div className="bg-[#FFF5F0] rounded-xl p-6 shadow-sm border border-[#FFE0D1] h-[400px]">
            <h3 className="text-[#4A3B32] font-bold text-lg mb-4">Xu hướng doanh thu vé (12 Tháng)</h3>
            <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockDashboardData.monthlyRevenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F94F2F" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#F94F2F" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#F94F2F" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} name="Doanh thu (Triệu)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* FOOTER */}
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

// --- COMPONENT CON ---
const StatCard = ({ title, value, subtext, isHighlight }) => (
    <div className={`
        p-5 rounded-lg shadow-sm border transition-transform hover:-translate-y-1 duration-200
        ${isHighlight ? 'bg-[#FFF0E6] border-[#F94F2F]' : 'bg-[#FFF5F0] border-[#FFE0D1]'}
    `}>
        <p className="text-[#4A2C00] text-xs font-bold uppercase mb-[-20px] tracking-wider">{title}</p>
        <h4 className={`text-3xl font-bold mb-1 ${isHighlight ? 'text-[#F94F2F]' : 'text-[#FF8C00]'}`}>
            {value}
        </h4>
        <p className="text-gray-500 text-xs">{subtext}</p>
    </div>
);

const MenuItem = ({ text, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
      <span>{text}</span>
    </button>
);

export default Dashboard;