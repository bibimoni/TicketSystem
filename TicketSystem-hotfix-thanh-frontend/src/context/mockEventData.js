// Đây là file context/mockEventData.js

// 1. IMPORT hình ảnh (giữ nguyên)
import SAMPLE_IMAGE_1 from './sample1.png';
import SAMPLE_IMAGE_2 from './sample2.png';

// 2. Cập nhật cấu trúc dữ liệu cho defaultEvents
export const defaultEvents = [
  // === SỰ KIỆN MẪU A (OFFLINE) ===
  {
    // --- Step 1 (EventPage1.jsx) ---
    id: "mock-event-1",
    eventName: "Sự kiện Mẫu A (Từ File)",
    suKienImage: SAMPLE_IMAGE_1, 
    bannerImage: SAMPLE_IMAGE_1, // Thêm trường này
    logoImage: SAMPLE_IMAGE_1, // Thêm trường này
    eventType: "offline", // Thêm trường này
    eventDate: "20/12/2025",
    // Địa chỉ (vì là offline)
    address: "Nhà hát Bến Thành",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    province: "TP. Hồ Chí Minh",
    // Thông tin BTC
    organizerName: "BTC Mẫu A", // Thêm trường này
    description: "Đây là mô tả chi tiết và điều khoản cho Sự kiện Mẫu A. Sự kiện này là một buổi hòa nhạc...", // Thêm trường này
    
    // --- Step 2 (EventPage2.jsx) ---
    startTime: "09:00 19/12/2025", // Thêm trường này
    endTime: "17:00 20/12/2025", // Thêm trường này
    tickets: [ // Thêm mảng tickets
      {
        id: "t1a",
        ticketName: "Vé Thường (Mock)",
        ticketPrice: "500000",
        ticketQuantity: "100",
        minTickets: "1",
        maxTickets: "5",
        ticketInfo: "Vé khu vực A, không hoàn hủy.",
      },
      {
        id: "t1b",
        ticketName: "Vé VIP (Mock)",
        ticketPrice: "1500000",
        ticketQuantity: "50",
        minTickets: "1",
        maxTickets: "2",
        ticketInfo: "Vé khu VIP, bao gồm đồ uống.",
      }
    ],

    // --- Step 3 (EventPage3.jsx) ---
    customPath: "su-kien-mau-a", // Thêm trường này
    confirmationMessage: "Cảm ơn bạn đã đăng ký Sự kiện Mẫu A! Vui lòng kiểm tra email.", // Thêm trường này

    // --- Step 4 (EventPage4.jsx) ---
    paymentInfo: { // Thêm object này
      accountHolder: "Nguyễn Văn A",
      accountNumber: "0123456789",
      bankName: "Vietcombank",
      branch: "Chi nhánh TP.HCM",
      businessType: "Cá nhân",
      companyName: "",
      companyAddress: "",
      taxCode: "",
    },
    
    // --- Trạng thái (EventsPage.jsx) ---
    status: "Sắp tới"
  },

  // === SỰ KIỆN MẪU B (ONLINE) ===
  {
    // --- Step 1 (EventPage1.jsx) ---
    id: "mock-event-2",
    eventName: "Sự kiện Mẫu B - Workshop Online",
    suKienImage: SAMPLE_IMAGE_2, 
    bannerImage: SAMPLE_IMAGE_2, 
    logoImage: SAMPLE_IMAGE_2, 
    eventType: "online", // Loại sự kiện online
    eventDate: "30/12/2025",
    // Địa chỉ (để trống vì là online)
    address: "",
    ward: "",
    district: "",
    province: "",
    // Thông tin BTC
    organizerName: "Công Ty Mẫu B",
    description: "Workshop online về kỹ năng thiết kế UI/UX.",
    
    // --- Step 2 (EventPage2.jsx) ---
    startTime: "19:00 30/12/2025",
    endTime: "21:00 30/12/2025",
    tickets: [
      {
        id: "t2a",
        ticketName: "Vé Tham Gia Online",
        ticketPrice: "100000",
        ticketQuantity: "500",
        minTickets: "1",
        maxTickets: "1",
        ticketInfo: "Vé bao gồm link tham gia Zoom.",
      }
    ],

    // --- Step 3 (EventPage3.jsx) ---
    customPath: "workshop-online-b",
    confirmationMessage: "Xác nhận đăng ký workshop! Link Zoom sẽ được gửi trước 1 ngày.",

    // --- Step 4 (EventPage4.jsx) ---
    paymentInfo: {
      accountHolder: "Trần Thị B",
      accountNumber: "9876543210",
      bankName: "Techcombank",
      branch: "Chi nhánh Hà Nội",
      businessType: "Doanh nghiệp",
      companyName: "Công Ty TNHH Mẫu B",
      companyAddress: "123 Ba Đình, Hà Nội",
      taxCode: "0100123456",
    },
    
    // --- Trạng thái (EventsPage.jsx) ---
    status: "Chờ duyệt"
  }
];