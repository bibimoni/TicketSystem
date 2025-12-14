import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- IMPORT COMPONENT & ASSETS ---
// Lưu ý: Đảm bảo đường dẫn file Calendar đúng với project của bạn
import { Calendar } from "../Elements/Calendar"; 

// Import Icons
import { FiHome, FiDollarSign, FiShoppingBag, FiClock, FiCalendar } from "react-icons/fi";

// Import hình ảnh (Giữ nguyên như file gốc của bạn)
import rectangle7 from "../Elements/rectangle-7.png";
import rectangle622 from "../Elements/rectangle-62.png";
import rectangle62 from "../Elements/rectangle-62.png";
import TICKETZ_LOGO from '../Elements/ticketZ.png';
import ticke12 from "../Elements/ticke-1-2.png";
import rectangle53 from "../Elements/rectangle-53.svg";
import rectangle56 from "../Elements/rectangle-56.svg";
import rectangle57 from "../Elements/rectangle-57.svg";
import rectangle58 from "../Elements/rectangle-58.svg";

// Recharts
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area
} from 'recharts';

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

const handleLogout = () => {
        // 1. Xóa token
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
        
        window.location.href = '/'; 
    };

// --- COMPONENT STAT CARD ---
const StatCard = ({ title, value, subtext, icon, isHighlight }) => (
    <div className={`
        p-5 rounded-lg shadow-sm border transition-transform hover:-translate-y-1 duration-200
        ${isHighlight ? 'bg-[#FFF0E6] border-[#F94F2F]' : 'bg-[#FFF5F0] border-[#FFE0D1]'}
    `}>
        <div className="flex justify-between items-start mb-2">
            <p className="text-[#4A2C00] text-xs font-bold uppercase tracking-wider">{title}</p>
            {icon && <div className="text-[#F94F2F] text-xl opacity-80">{icon}</div>}
        </div>
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

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // State dữ liệu thống kê
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ticketsSold: 0,
    pendingEvents: 0,   // DRAFT
    upcomingEvents: 0,  // PUBLISHED
    cancelledEvents: 0, // CANCELLED
    completedEvents: 0, // COMPLETED
  });

  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [adminInfo, setAdminInfo] = useState({ fullName: "Admin", avatar: TICKETZ_LOGO });

  // Helper: Chuyển đổi số an toàn
  const safeNumber = (val) => {
      const num = Number(val);
      return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    const fetchData = async () => {
        if (!token) return;
        setLoading(true);

        try {
            const profileRes = await axios.get(`${API_BASE_URL}/admin/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const user = profileRes.data.user || {};
            setAdminInfo({
                fullName: user.name || user.username || "Administrator",
                avatar: user.avatar || TICKETZ_LOGO
            });

            // --- 2. ĐẾM SỐ LƯỢNG SỰ KIỆN THEO TRẠNG THÁI  ---
            // API: /event/events-count/{status}
            const getCount = async (status) => {
                try {
                    const res = await axios.get(`${API_BASE_URL}/event/events-count/${status}`, { 
                        headers: { 'Authorization': `Bearer ${token}` } 
                    });
                    // API trả về số trực tiếp hoặc object {count: ...}
                    return safeNumber(res.data) || safeNumber(res.data?.count) || 0;
                } catch (e) {
                    return 0;
                }
            };

            const [draftCount, publishedCount, cancelledCount, completedCount] = await Promise.all([
                getCount('DRAFT'),
                getCount('PUBLISHED'),
                getCount('CANCELLED'),
                getCount('COMPLETED')
            ]);

            // --- 3. LẤY TOÀN BỘ VÉ ĐỂ TÍNH DOANH THU  ---
            // API: /ticket/all-tickets (Admin only)
            let totalRev = 0;
            let totalSold = 0;
            const monthlyStats = Array.from({ length: 12 }, (_, i) => ({ name: `T${i + 1}`, revenue: 0, tickets: 0 }));

            try {
                const ticketsRes = await axios.get(`${API_BASE_URL}/ticket/all-tickets`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // [cite: 209] Response là mảng vé
                const allTickets = Array.isArray(ticketsRes.data) ? ticketsRes.data : (ticketsRes.data.data || []);

                allTickets.forEach(t => {
                    // Chỉ tính vé đã bán (Status = SOLD hoặc USED)
                    // Nếu hệ thống không xóa vé lỗi thì cần check status
                    if (t.status === 'SOLD' || t.status === 'USED') {
                        totalSold++;
                        
                        //  SỬA LỖI: Giá nằm trực tiếp trong ticket_type, không có ticketPrice
                        const ticketType = t.ticket_type || {};
                        const price = safeNumber(ticketType.price) || 0; 
                        
                        totalRev += price;

                        // Tính toán cho biểu đồ tháng
                        // [cite: 213] Dùng created_at của vé
                        const dateStr = t.created_at;
                        if (dateStr) {
                            const date = new Date(dateStr);
                            const monthIndex = date.getMonth(); // 0-11
                            const year = date.getFullYear();
                            const currentYear = new Date().getFullYear();

                            // Chỉ tính năm hiện tại cho biểu đồ tháng
                            if (monthIndex >= 0 && monthIndex < 12 && year === currentYear) {
                                monthlyStats[monthIndex].revenue += price;
                                monthlyStats[monthIndex].tickets += 1;
                            }
                        }
                    }
                });
            } catch (err) {
                console.error("Lỗi lấy danh sách vé:", err);
            }

            // Cập nhật State
            setStats({
                totalRevenue: totalRev,
                ticketsSold: totalSold,
                pendingEvents: draftCount,
                upcomingEvents: publishedCount,
                cancelledEvents: cancelledCount,
                completedEvents: completedCount
            });

            setChartData(monthlyStats);

            // Dữ liệu biểu đồ tròn
            // Chỉ thêm vào mảng nếu giá trị > 0 để biểu đồ đẹp hơn
            const pData = [
                { name: 'Sắp tới', value: publishedCount, color: '#9BCB3C' },
                { name: 'Chờ duyệt', value: draftCount, color: '#F29F3D' },
                { name: 'Bị hủy', value: cancelledCount, color: '#CF3333' },
                { name: 'Đã qua', value: completedCount, color: '#EFF669' }
            ].filter(item => item.value > 0);

            setPieData(pData.length > 0 ? pData : [{ name: 'Trống', value: 1, color: '#E0E0E0' }]);

        } catch (error) {
            console.error("❌ Lỗi tải dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [token]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(safeNumber(value));
  };

  const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex w-full h-screen bg-[#fff8f7] overflow-hidden">
      {/* BACKGROUND & SIDEBAR */}
      <div className="absolute top-[72px] h-[1511px] left-[272px] right-0 bottom-0 bg-[#fff8f7]" />
           <div className="absolute top-0 left-0 w-[272px] h-[2000px] bg-[#f94f2f]" />
      <img className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]" alt="bg" src={rectangle7} />
      
      {/* LOGO */}
      <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
        <img className="absolute top-0 left-0 w-[63px] h-[63px] object-contain" alt="Logo" src={TICKETZ_LOGO} />
      </div>
      <div 
        onClick={() => navigate('/admin/dashboard')}
        className="absolute top-[27px] left-[89px] [font-family:'Moul-Regular',Helvetica] font-normal text-white text-xl text-center cursor-pointer leading-[15px]">
        Admin <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; center
      </div>

      {/* ADMIN INFO & MENU */}
      <div className="absolute top-[40px] right-[60px] z-50 flex items-center gap-4"> 
          <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-[#4A3B32] leading-none mb-1">{adminInfo.fullName}</p>
              <p className="text-[11px] text-gray-500 font-medium leading-none">Administrator</p>
          </div>
          <div className="relative">
              <img 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  src={adminInfo.avatar || TICKETZ_LOGO} 
                  alt="Avatar" 
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                  onError={(e) => { 
                      e.target.onerror = null; 
                      e.target.src = TICKETZ_LOGO; 
                  }}
              />
              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden py-2 animate-fadeIn">
                  <MenuItem text="Tài khoản của tôi" onClick={() => navigate('/admin/tai-khoan-cua-toi')} />
                  <div className="h-px bg-gray-100 my-1 mx-4" />
                  <MenuItem 
                      text="Đăng xuất" 
                      onClick={handleLogout} />
                </div>
              )}
          </div>
      </div>

      {/* SIDEBAR BUTTONS */}
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
      <div className="absolute top-[20px] left-[300px] right-[20px] pb-20">

        
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#4A3B32]">Welcome back, Admin</h1>
            <p className="text-gray-500 text-sm mt-1"> {currentDate}</p>
        </div>

        {/* 4 THẺ THỐNG KÊ */}
        <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard 
                title="TỔNG DOANH THU" 
                value={loading ? "..." : formatCurrency(stats.totalRevenue)} 
                subtext="Toàn thời gian"
                icon={<FiDollarSign />}
                isHighlight={true}
            />
            <StatCard 
                title="VÉ ĐÃ BÁN" 
                value={loading ? "..." : stats.ticketsSold} 
                subtext="Vé đã bán (Sold/Used)"
                icon={<FiShoppingBag />}
            />
            <StatCard 
                title="SỰ KIỆN CHỜ DUYỆT" 
                value={loading ? "..." : stats.pendingEvents} 
                subtext="Trạng thái: DRAFT"
                icon={<FiClock />}
            />
            <StatCard 
                title="SỰ KIỆN SẮP TỚI" 
                value={loading ? "..." : stats.upcomingEvents} 
                subtext="Trạng thái: PUBLISHED"
                icon={<FiCalendar />}
            />
        </div>

        {/* HÀNG BIỂU ĐỒ GIỮA */}
        <div className="grid grid-cols-2 gap-6 mb-20 h-[380px]">
            {/* 1. Biểu đồ Tròn */}
            <div className="bg-[#FFF5F0] rounded-xl p-6 shadow-sm border border-[#FFE0D1]">
                <h3 className="text-[#4A3B32] font-bold text-lg mb-4">Thống kê trạng thái sự kiện</h3>
                {stats.pendingEvents + stats.upcomingEvents + stats.cancelledEvents + stats.completedEvents === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">Chưa có dữ liệu sự kiện</div>
                ) : (
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={100}
                                    paddingAngle={5} dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>

            {/* 2. Biểu đồ Cột */}
            <div className="bg-[#FFF5F0] rounded-xl p-6 shadow-sm border border-[#FFE0D1]">
                <h3 className="text-[#4A3B32] font-bold text-lg mb-4">Số lượng vé bán theo tháng ({new Date().getFullYear()})</h3>
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}} 
                                formatter={(value) => [value, "Số vé"]}
                            />
                            <Bar dataKey="tickets" fill="#F2994A" radius={[4, 4, 0, 0]} barSize={30} name="Số vé" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* 3. Biểu đồ Đường */}
        <div className="bg-[#FFF5F0] rounded-xl p-6 shadow-sm border border-[#FFE0D1] h-[400px]">
            <h3 className="text-[#4A3B32] font-bold text-lg mb-4">Xu hướng doanh thu (Toàn hệ thống)</h3>
            <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                        data={chartData} 
                        // 👇 1. SỬA margin left: 0 -> left: 20 để đẩy biểu đồ sang phải, tránh bị cắt chữ
                        margin={{ top: 10, right: 30, left: 20, bottom: 0 }} 
                    >
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#F94F2F" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#F94F2F" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        
                        {/* 👇 2. SỬA width: Tăng lên 100 hoặc 110 để đủ chỗ cho số tiền lớn */}
                        <YAxis 
                            width={100} 
                            tickFormatter={(value) => new Intl.NumberFormat('vi-VN').format(value)}
                        />
                        
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Area type="monotone" dataKey="revenue" stroke="#F94F2F" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} name="Doanh thu" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

      </div>

      {/* FOOTER */}
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
    </div>
  );
};

export default Dashboard;