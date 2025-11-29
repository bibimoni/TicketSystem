import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';

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
  const data = [
    { name: 'Filled', value: safePercentage },
    { name: 'Empty', value: 100 - safePercentage },
  ];
  const colors = [color, '#FEEBE7'];

  return (
    <div className="relative w-24 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data} dataKey="value" cx="50%" cy="50%"
            innerRadius={30} outerRadius={40}
            startAngle={90} endAngle={-270} stroke="none"
          >
            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-lg font-bold text-gray-700">{`${safePercentage.toFixed(0)}%`}</span>
      </div>
    </div>
  );
};

export const OverviewPage = () => {
  const { eventId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
        setLoading(true);

        const [eventRes, ticketRes] = await Promise.all([
           axios.get(`${API_BASE_URL}/event/customer_events`, { headers: { 'Authorization': `Bearer ${token}` } }),
           axios.get(`${API_BASE_URL}/ticket/all-tickets`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        const allEvents = Array.isArray(eventRes.data) ? eventRes.data : (eventRes.data.events || []);
        const currentEvent = allEvents.find(e => (e.id === eventId || e._id === eventId));

        const allTickets = Array.isArray(ticketRes.data) ? ticketRes.data : (ticketRes.data.data || []);
        const soldTickets = allTickets.filter(t => 
            t.ticket_type && (t.ticket_type.event_id === eventId || t.ticket_type.eventId === eventId)
        );

        if (currentEvent) {
            // --- 1. TÍNH DOANH THU THỰC TẾ ---
            const uniqueTransactions = new Map();
            soldTickets.forEach(ticket => {
                const trans = ticket.transactionHasTicket?.transaction;
                if (trans && trans.id && !uniqueTransactions.has(trans.id)) {
                    uniqueTransactions.set(trans.id, trans);
                }
            });
            const realRevenue = Array.from(uniqueTransactions.values()).reduce((sum, trans) => {
                return sum + (Number(trans.total_price) || 0);
            }, 0);

            // --- 2. CHI TIẾT TỪNG LOẠI VÉ ---
            let totalTicketsAvailable = 0;
            let totalRevenueExpected = 0;

            const ticketTypes = currentEvent.ticketTypes || [];
            
            const ticketDetails = ticketTypes.map(type => {
                const typeId = type.id;
                const name = type.name || "Vé thường";
                const totalAmount = Number(type.amount) || 0;
                
                // Logic tìm giá vé
                let price = 0;
                if (type.price) price = Number(type.price);
                else if (type.ticketPrice?.price) price = Number(type.ticketPrice.price);
                
                if (price === 0) {
                    const soldSample = soldTickets.find(t => t.ticket_type?.id === typeId);
                    if (soldSample) {
                        price = Number(soldSample.ticket_type?.ticketPrice?.price) || Number(soldSample.ticketPrice?.price) || 0;
                    }
                }

                const soldCount = soldTickets.filter(t => t.ticket_type?.id === typeId).length;
                totalTicketsAvailable += totalAmount;
                totalRevenueExpected += (totalAmount * price);

                return {
                    id: typeId,
                    name: name,
                    price: price,
                    total: totalAmount,
                    sold: soldCount,
                    revenue: soldCount * price 
                };
            });

            // --- 3. XỬ LÝ BIỂU ĐỒ (HIỂN THỊ NGÀY/THÁNG) ---
            const statsMap = {};
            soldTickets.forEach(t => {
                const dateStr = t.transactionHasTicket?.transaction?.created_at || t.created_at;
                if (dateStr) {
                    const date = new Date(dateStr);
                    
                    // Format: DD/MM (28/11)
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const dayLabel = `${day}/${month}`;
                    
                    if (!statsMap[dayLabel]) {
                        statsMap[dayLabel] = { 
                            day: dayLabel, 
                            revenue: 0, 
                            tickets: 0,
                            timestamp: date.getTime() // Dùng để sort
                        };
                    }
                    
                    statsMap[dayLabel].tickets += 1;
                    const tPrice = Number(t.ticket_type?.ticketPrice?.price) || 0;
                    statsMap[dayLabel].revenue += tPrice;
                }
            });
            
            let dailyStats = Object.values(statsMap);
            // Sắp xếp ngày từ cũ đến mới
            dailyStats.sort((a, b) => a.timestamp - b.timestamp);

            if (dailyStats.length === 0) {
                 const today = new Date();
                 const d = String(today.getDate()).padStart(2, '0');
                 const m = String(today.getMonth() + 1).padStart(2, '0');
                 dailyStats.push({ day: `${d}/${m}`, revenue: 0, tickets: 0 });
            }

            setData({
                eventName: currentEvent.name,
                revenueSummary: {
                    currentRevenue: realRevenue,
                    totalExpectedRevenue: totalRevenueExpected 
                },
                ticketSummary: {
                    ticketsSold: soldTickets.length,
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
  if (!data) return <div className="p-8 text-center text-red-500">Không tìm thấy dữ liệu.</div>;

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

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Biểu đồ bán vé (Theo ngày)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.dailyStats}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888'}} />
            <Tooltip formatter={(value, name) => [name === 'revenue' ? formatCurrency(value) : value, name === 'revenue' ? 'Doanh thu' : 'Số vé']} />
            <Legend />
            <Bar dataKey="revenue" fill="#F94F2F" name="Doanh thu" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="tickets" fill="#4B5563" name="Số vé" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Chi tiết vé bán ra</h3>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 font-semibold text-sm">
                <th className="py-4 px-6">Loại vé</th>
                <th className="py-4 px-6">Giá niêm yết</th>
                <th className="py-4 px-6">Tiến độ bán</th>
                <th className="py-4 px-6 text-right">Doanh thu</th>
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