// src/context/mockOverviewData.js

export const mockOverviewData = {
  // 1. Dữ liệu cho 2 thẻ "Tổng quan"
  revenueSummary: {
    currentRevenue: 200000000,
    totalExpectedRevenue: 1000000000, // 200M là 20% của 1B
  },
  ticketSummary: {
    ticketsSold: 300,
    totalTickets: 400, // 300 là 75% của 400
  },

  // 2. Dữ liệu cho Biểu đồ cột "Doanh thu & Số vé bán"
  dailyStats: [
    { day: 0, revenue: 580, tickets: 700 },
    { day: 1, revenue: 680, tickets: 600 },
    { day: 2, revenue: 200, tickets: 850 },
    { day: 3, revenue: 950, tickets: 400 },
    { day: 4, revenue: 800, tickets: 300 },
    { day: 5, revenue: 100, tickets: 750 },
    { day: 6, revenue: 850, tickets: 450 },
    { day: 7, revenue: 300, tickets: 820 },
    { day: 8, revenue: 750, tickets: 500 },
    { day: 9, revenue: 300, tickets: 600 },
    { day: 10, revenue: 500, tickets: 800 },
    { day: 11, revenue: 150, tickets: 450 },
    { day: 12, revenue: 850, tickets: 550 },
    { day: 13, revenue: 600, tickets: 800 },
    { day: 14, revenue: 780, tickets: 820 },
    { day: 15, revenue: 300, tickets: 700 },
    { day: 16, revenue: 550, tickets: 900 },
    { day: 17, revenue: 820, tickets: 750 },
    { day: 18, revenue: 450, tickets: 800 },
    { day: 19, revenue: 700, tickets: 600 },
    { day: 20, revenue: 300, tickets: 750 },
    { day: 21, revenue: 600, tickets: 450 },
    { day: 22, revenue: 100, tickets: 850 },
    { day: 23, revenue: 750, tickets: 500 },
    { day: 24, revenue: 200, tickets: 450 },
    { day: 25, revenue: 780, tickets: 600 },
    { day: 26, revenue: 450, tickets: 700 },
    { day: 27, revenue: 600, tickets: 850 },
    { day: 28, revenue: 200, tickets: 350 },
    { day: 29, revenue: 850, tickets: 250 },
    { day: 30, revenue: 350, tickets: 200 },
  ],

  // 3. Dữ liệu cho bảng "Chi tiết vé đã bán"
  ticketDetails: [
    {
      id: 't1',
      name: 'Siêu sao (X-VIP)',
      price: 8000000,
      sold: 10,
      total: 10,
    },
    {
      id: 't2',
      name: 'Đỉnh nóc & Kịch trần',
      price: 4000000,
      sold: 20,
      total: 20,
    },
    {
      id: 't3',
      name: 'Gia tộc',
      price: 3500000,
      sold: 20,
      total: 50,
    },
    {
      id: 't4',
      name: 'Anh Tài',
      price: 3000000,
      sold: 70,
      total: 70,
    },
    {
      id: 't5',
      name: 'Toàn năng',
      price: 2000000,
      sold: 70,
      total: 70,
    },
    {
      id: 't6',
      name: 'Mùa Hè rực rỡ',
      price: 1000000,
      sold: 40,
      total: 80, // 50%
    },
    {
      id: 't7',
      name: 'Vượt chông gai',
      price: 800000,
      sold: 60,
      total: 90, // 66.67%
    },
  ],
};