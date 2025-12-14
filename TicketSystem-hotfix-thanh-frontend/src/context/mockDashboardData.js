// context/mockDashboardData.js

export const mockDashboardData = {
  // 1. Số liệu 4 ô trên cùng
  summary: {
    totalRevenue: 1250000000, // 1.25 Tỷ
    ticketsSold: 3500,
    pendingEvents: 12,
    upcomingEvents: 45,
  },

  // 2. Dữ liệu Pie Chart (Trạng thái sự kiện)
  eventStatus: [
    { name: 'Sắp tới / Đang diễn ra', value: 256, color: '#669F86' }, // Xanh rêu
    { name: 'Chờ duyệt', value: 55, color: '#F2994A' }, // Cam
    { name: 'Đã hủy', value: 31, color: '#EB5757' }, // Đỏ
  ],

  // 3. Dữ liệu Bar Chart (Địa điểm tổ chức - Horizontal Bar)
  locations: [
    { name: 'TP. Hồ Chí Minh', count: 12450 },
    { name: 'Hà Nội', count: 9830 },
    { name: 'Đà Nẵng', count: 6720 },
    { name: 'Cần Thơ', count: 4580 },
    { name: 'Nha Trang', count: 3940 },
  ],

  // 4. Dữ liệu Line Chart (Doanh thu theo 12 tháng)
  monthlyRevenue: [
    { month: 'T1', revenue: 450 },
    { month: 'T2', revenue: 520 },
    { month: 'T3', revenue: 480 },
    { month: 'T4', revenue: 610 },
    { month: 'T5', revenue: 580 },
    { month: 'T6', revenue: 650 },
    { month: 'T7', revenue: 620 },
    { month: 'T8', revenue: 720 },
    { month: 'T9', revenue: 690 },
    { month: 'T10', revenue: 780 },
    { month: 'T11', revenue: 820 },
    { month: 'T12', revenue: 850 },
  ]
};