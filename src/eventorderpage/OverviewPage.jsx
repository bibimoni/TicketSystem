import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';


// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Component Thanh tiến trình
const ProgressBar = ({ sold, total }) => {
  const percentage = total > 0 ? (sold / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-red-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

// Component Biểu đồ tròn
const DonutChart = ({ percentage, color }) => {
  const safePercentage = isNaN(percentage) ? 0 : percentage;

  let displayValue = '0';
  if (safePercentage > 0 && safePercentage < 1) {
    displayValue = safePercentage.toFixed(2); 
  } else {
    displayValue = safePercentage.toFixed(0);
  }
  const visualValue = (safePercentage > 0 && safePercentage < 1) ? 1 : safePercentage;

  const data = [
    { name: 'Filled', value: visualValue },
    { name: 'Empty', value: 100 - visualValue },
  ];
  const colors = [color, '#FEEBE7'];

  return (
    <div className="relative w-24 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data} 
            dataKey="value" 
            cx="50%" 
            cy="50%"
            innerRadius={30} 
            outerRadius={40}
            startAngle={90} 
            endAngle={-270} 
            stroke="none"
          >
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      {/* Hiển thị số % đã format ở giữa */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-lg font-bold text-gray-700">
          {displayValue}%
        </span>
      </div>
    </div>
  );
};

export const OverviewPage = () => {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
        setLoading(true);

        // --- 1. GỌI API ---
        const [eventRes, transRes] = await Promise.all([
           axios.get(`${API_BASE_URL}/event/customer_events`, { 
               headers: { 'Authorization': `Bearer ${token}` } 
           }),
           axios.get(`${API_BASE_URL}/transaction/event_transactions`, { 
               headers: { 'Authorization': `Bearer ${token}` },
               params: { eventId: eventId }
           })
        ]);

        // Xử lý dữ liệu Sự kiện
        const allEvents = Array.isArray(eventRes.data) ? eventRes.data : (eventRes.data.events || []);
        const currentEvent = allEvents.find(e => (e.id === eventId || e._id === eventId));

        // Xử lý dữ liệu Giao dịch
        const transactions = Array.isArray(transRes.data) ? transRes.data : (transRes.data.data || []);

        if (currentEvent) {
            // --- A. TÍNH DOANH THU THỰC TẾ & BIỂU ĐỒ (Dựa trên Transaction) ---
            let realRevenue = 0;
            let realTicketsSold = 0;
            const statsMap = {};

            transactions.forEach(trans => {
                // 1. Xác định ngày giao dịch
                const dateStr = trans.time_date || trans.created_at; // Swagger: time_date, Code cũ: created_at
                let dayLabel = "N/A";
                let timestamp = 0;

                if (dateStr) {
                    const date = new Date(dateStr);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    dayLabel = `${day}/${month}`;
                    timestamp = date.getTime();
                }

                // Khởi tạo map cho ngày này nếu chưa có
                if (dayLabel !== "N/A" && !statsMap[dayLabel]) {
                    statsMap[dayLabel] = { 
                        day: dayLabel, 
                        revenue: 0, 
                        tickets: 0,
                        timestamp: timestamp
                    };
                }

                // 2. Duyệt sâu vào mảng tickets để lọc đúng event và cộng tiền
                // SỬA QUAN TRỌNG: Dùng `trans.tickets` thay vì `trans.TransactionHasTickets`
                const ticketsList = trans.tickets || [];
                
                ticketsList.forEach(tItem => {
                    const ticket = tItem.ticket || {};
                    const type = ticket.ticket_type || {};
                    const event = type.event || {};

                    // Kiểm tra xem vé này có thuộc Event đang xem không
                    if (event.id === eventId || event._id === eventId || type.eventId === eventId) {
                        // Cộng doanh thu
                        const price = Number(type.price) || 0;
                        realRevenue += price;
                        realTicketsSold += 1;

                        // Cộng vào biểu đồ ngày
                        if (dayLabel !== "N/A") {
                            statsMap[dayLabel].revenue += price;
                            statsMap[dayLabel].tickets += 1;
                        }
                    }
                });
            });

            // Chuyển statsMap thành mảng và sort theo ngày
            let dailyStats = Object.values(statsMap);
            dailyStats.sort((a, b) => a.timestamp - b.timestamp);

            // Fallback: Nếu chưa có dữ liệu ngày nào
            if (dailyStats.length === 0) {
                 const today = new Date();
                 const d = String(today.getDate()).padStart(2, '0');
                 const m = String(today.getMonth() + 1).padStart(2, '0');
                 dailyStats.push({ day: `${d}/${m}`, revenue: 0, tickets: 0 });
            }

            // --- B. CHI TIẾT LOẠI VÉ (Dựa trên Event Info) ---
            // Phần này lấy từ Event definition để biết tổng số vé phát hành
            let totalTicketsAvailable = 0;
            let totalRevenueExpected = 0;

            const ticketTypes = currentEvent.ticketTypes || [];
            
            const ticketDetails = ticketTypes.map(type => {
                const typeId = type.id;
                const name = type.name || "Vé thường";
                
                // Số lượng tổng
                const totalAmount = Number(type.amount) || 0;
                
                // Số lượng còn lại (Lấy từ event info, có thể không realtime bằng transaction nhưng dùng tạm để hiện progress bar)
                const remaining = Number(type.remaining); 
                const soldCount = (totalAmount - (isNaN(remaining) ? totalAmount : remaining));

                // Giá vé
                let price = Number(type.price) || 0;
                if (price === 0 && type.ticketPrice?.price) price = Number(type.ticketPrice.price);

                totalTicketsAvailable += totalAmount;
                totalRevenueExpected += (totalAmount * price);

                return {
                    id: typeId,
                    name: name,
                    price: price,
                    total: totalAmount,
                    sold: soldCount, // Số lượng bán theo Event info
                    revenue: soldCount * price // Doanh thu ước tính theo số lượng bán
                };
            });

            setData({
                eventName: currentEvent.name,
                revenueSummary: {
                    currentRevenue: realRevenue, // Lấy từ Transaction thật
                    totalExpectedRevenue: totalRevenueExpected 
                },
                ticketSummary: {
                    ticketsSold: realTicketsSold, // Lấy từ Transaction thật
                    totalTickets: totalTicketsAvailable
                },
                ticketDetails: ticketDetails,
                dailyStats: dailyStats
            });
        }
      } catch (error) {
        console.error("Lỗi tải tổng quan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [eventId, token]);

  if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Không tìm thấy dữ liệu sự kiện.</div>;

  const revenuePercent = data.revenueSummary.totalExpectedRevenue > 0 
    ? (data.revenueSummary.currentRevenue / data.revenueSummary.totalExpectedRevenue) * 100 
    : 0;
  const ticketPercent = data.ticketSummary.totalTickets > 0 
    ? (data.ticketSummary.ticketsSold / data.ticketSummary.totalTickets) * 100 
    : 0;

  return (
    <div className="w-[1100px] relative left-[-40px] flex flex-col gap-8 pb-10">
      
      <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-[#F94F2F] pl-3">
        Tổng quan: <span className="text-[#F94F2F]">{data.eventName}</span>
      </h2>

      {/* Cards thống kê */}
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-[#FFE8E2] p-6 rounded-lg shadow-sm border border-[#fccac0] flex items-center justify-between">
          <div>
            <div className="text-[#F94F2F] font-semibold mb-1">Doanh thu thực tế</div>
            <div className="text-3xl font-bold text-gray-800">
              {formatCurrency(data.revenueSummary.currentRevenue)}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Dự kiến tối đa: {formatCurrency(data.revenueSummary.totalExpectedRevenue)}
            </div>
          </div>
          <DonutChart percentage={revenuePercent} color="#F94F2F" />
        </div>

        <div className="bg-[#FFE8E2] p-6 rounded-lg shadow-sm border border-[#fccac0] flex items-center justify-between">
          <div>
            <div className="text-[#F94F2F] font-semibold mb-1">Vé đã bán</div>
            <div className="text-3xl font-bold text-gray-800">
              {data.ticketSummary.ticketsSold}
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Tổng phát hành: {data.ticketSummary.totalTickets}
            </div>
          </div>
          <DonutChart percentage={ticketPercent} color="#F94F2F" />
        </div>
      </div>

      {/* Biểu đồ cột */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Biểu đồ bán vé (Theo ngày)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.dailyStats}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
            <Tooltip 
                formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(value) : value, 
                    name === 'revenue' ? 'Doanh thu' : 'Số vé'
                ]} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#F94F2F" name="Doanh thu" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="tickets" fill="#4B5563" name="Số vé" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bảng chi tiết loại vé */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Chi tiết vé bán ra</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 font-semibold text-sm">
                <th className="py-4 px-6">Loại vé</th>
                <th className="py-4 px-6">Giá niêm yết</th>
                <th className="py-4 px-6">Tiến độ bán</th>
                <th className="py-4 px-6 text-right">Doanh thu (Ước tính)</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {data.ticketDetails.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-800">{ticket.name}</td>
                    <td className="py-4 px-6 text-gray-600">{formatCurrency(ticket.price)}</td>
                    <td className="py-4 px-6 w-1/3">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <ProgressBar sold={ticket.sold} total={ticket.total} />
                        </div>
                        <span className="text-xs font-medium text-gray-500 w-16 text-right">
                            {ticket.sold} / {ticket.total}
                        </span>
                    </div>
                    </td>
                    <td className="py-4 px-6 text-right font-bold text-[#F94F2F]">
                        {formatCurrency(ticket.revenue)}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
export default OverviewPage;