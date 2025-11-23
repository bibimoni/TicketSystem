// src/page/OverviewPage/OverviewPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// 1. IMPORT DỮ LIỆU MẪU
import { mockOverviewData } from '../context/mockOverviewData'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Hàm helper format tiền
const formatCurrency = (amount) => {
  if (amount == null) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Component thanh progress bar
const ProgressBar = ({ sold, total }) => {
  const percentage = total > 0 ? (sold / total) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-red-500 h-2.5 rounded-full" 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const DonutChart = ({ percentage, color }) => {
  // Dữ liệu cho biểu đồ: 1 phần đã lấp, 1 phần còn lại
  const data = [
    { name: 'Filled', value: percentage },
    { name: 'Empty', value: 100 - percentage },
  ];
  
  // Màu cho 2 phần: [Màu chính, Màu nền]
  const colors = [color, '#F8AE99']; // (Bạn có thể đổi màu nền #FEEBE7)

  return (
    // Dùng relative để đặt text vào giữa
    <div className="relative w-24 h-24">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%" // Căn giữa
            cy="50%" // Căn giữa
            innerRadius={30} // Tạo ra lỗ ở giữa (donut)
            outerRadius={40} // Viền ngoài
            startAngle={90} // Bắt đầu ở đỉnh (12h)
            endAngle={-270} // Vẽ 360 độ ngược chiều kim đồng hồ
            paddingAngle={0}
            stroke="none" // Không có viền
          >
            {/* Dùng Cell để tô màu cho từng phần */}
            <Cell key="cell-0" fill={colors[0]} /> 
            <Cell key="cell-1" fill={colors[1]} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Lớp text nằm đè lên chính giữa */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-xl font-bold text-gray-800">
          {`${percentage.toFixed(0)}%`}
        </span>
      </div>
    </div>
  );
};

export const OverviewPage = () => {
  const { eventId } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    setData(mockOverviewData);
  }, [eventId]);

  if (!data) {
    return <div>Đang tải...</div>;
  }

  // Tính toán phần trăm
  const revenuePercent = (data.revenueSummary.currentRevenue / data.revenueSummary.totalExpectedRevenue) * 100;
  const ticketPercent = (data.ticketSummary.ticketsSold / data.ticketSummary.totalTickets) * 100;

  return (
    <div className="w-[1100px] top-[-60px] relative left-[-40px] flex flex-col gap-8">
      
      {/* === TỔNG QUAN === */}
      <h2 className="text-xl font-bold text-red-500">Tổng quan</h2>
      <div className="grid grid-cols-2 gap-8">
        {/* Thẻ Doanh thu */}
        <div className="bg-[#FFE8E2] p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <div className="text-[#F94F2F]">Doanh thu</div>
            <div className="text-3xl font-bold text-gray-800">
              {formatCurrency(data.revenueSummary.currentRevenue)}
            </div>
            <div className="text-[#F94F2F] text-sm">
              Tổng: {formatCurrency(data.revenueSummary.totalExpectedRevenue)}
            </div>
          </div>
          <DonutChart 
            percentage={revenuePercent} 
            color="#F94F2F" // Màu đỏ cam
          />
        </div>

        {/* Thẻ Số vé đã bán */}
        <div className="bg-[#FFE8E2] p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <div className="text-[#F94F2F]">Số vé đã bán</div>
            <div className="text-3xl font-bold text-gray-800">
              {data.ticketSummary.ticketsSold}
            </div>
            <div className="text-[#F94F2F] text-sm">
              Tổng: {data.ticketSummary.totalTickets}
            </div>
          </div>
          <DonutChart 
            percentage={ticketPercent} 
            color="#F94F2F" // Màu đỏ cam
          />
        </div>
      </div>

      {/* === BIỂU ĐỒ === */}
      <div className="bg-white p-6 rounded-lg shadow-md h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.dailyStats}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#4F46E5" name="Doanh thu" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tickets" fill="#6EE7B7" name="Số vé bán" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* === CHI TIẾT VÉ ĐÃ BÁN === */}
      <h2 className="text-xl font-bold text-red-500">Chi tiết</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600 font-semibold text-sm">
              <th className="py-3 px-6">Loại vé</th>
              <th className="py-3 px-6">Giá bán</th>
              <th className="py-3 px-6">Đã bán</th>
              <th className="py-3 px-6">Tỷ lệ bán</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.ticketDetails.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50">
                <td className="py-4 px-6 font-semibold">{ticket.name}</td>
                <td className="py-4 px-6">{formatCurrency(ticket.price)}</td>
                <td className="py-4 px-6">{ticket.sold}/{ticket.total}</td>
                <td className="py-4 px-6 flex items-center gap-4">
                  <ProgressBar sold={ticket.sold} total={ticket.total} />
                  <span>{((ticket.sold / ticket.total) * 100).toFixed(0)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default OverviewPage;