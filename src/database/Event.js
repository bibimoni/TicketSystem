// database/Event.js
import image from "../assets/images/org.png";
import bannerNgang from "../assets/images/atvncg-ngang.jpg";
import bannerDoc from "../assets/images/atvncg-doc.jpg";

const eventsData = [
  {
    id: "concert-atvng-2025",
    title: "Concert Anh Trai Vượt Ngàn Chông Gai 2025",
    date: "2025-06-15",
    location: "The Global City, TP. Hồ Chí Minh",
    bannerLandscape: bannerNgang,
    bannerPortrait: bannerDoc,
    description:
      "Concert Anh trai vượt ngàn chông gai là chuỗi sự kiện âm nhạc cuối năm 2024 đầu năm 2025, quy tụ 33 nghệ sĩ, vận động viên từ chương trình truyền hình cùng tên. Sự kiện này không chỉ mang đến những màn trình diễn hoành tráng mà còn lan tỏa các giá trị tốt đẹp thông qua các dự án cộng đồng, tôn vinh văn hóa dân tộc.Concert Anh trai vượt ngàn chông gai là chuỗi sự kiện âm nhạc cuối năm 2024 đầu năm 2025, quy tụ 33 nghệ sĩ, vận động viên từ chương trình truyền hình cùng tên. Sự kiện này không chỉ mang đến những màn trình diễn hoành tráng mà còn lan tỏa các giá trị tốt đẹp thông qua các dự án cộng đồng, tôn vinh văn hóa dân tộc.",
    organizationLogo: image,
    organizationName: "YEAH 1 PRODUCTION",
    organizationDesc: "Công ty Cổ phần Tập đoàn Yeah1.",
    ticketCategories: [
      {
        id: "sieu-sao",
        name: "Siêu sao (X-VIP)",
        price: "8.000.000 đ",
        soldOut: true,
        hasDetails: true,
        details: [
          "GHẾ VIP GẦN SÂN KHẤU NHẤT",
          "LỐI VÀO RIÊNG CHO KHU X-VIP",
          "01 vòng đeo tay cao cấp",
          "01 lightstick X-VIP",
          "Bộ quà tặng đặc biệt giới hạn",
        ],
        quantity: 2,
      },
      {
        id: "dinh-noc",
        name: "Đỉnh nóc & Kịch trần",
        price: "4.000.000 đ",
        soldOut: true,
        hasDetails: true,
        details: [
          "GHẾ KHU ĐỈNH NÓC / KỊCH TRẦN",
          "01 vòng đeo tay",
          "01 lightstick",
          "Ưu tiên check-in nhanh",
        ],
        quantity: 0,
      },
      {
        id: "gia-toc",
        name: "Gia tộc",
        price: "3.500.000 đ",
        soldOut: false,
        hasDetails: true,
        details: [
          "KHU VỰC DÀNH CHO KHÁN GIẢ TRÊN 13 TUỔI",
          "01 vé vào cổng khu vực 'Gia tộc'",
          "01 vòng đeo tay",
          "01 lightstick",
          "01 dây đeo thẻ ATVNCG",
        ],
        quantity: 0,
      },
      {
        id: "anh-tai",
        name: "Anh Tài",
        price: "3.000.000 đ",
        soldOut: false,
        hasDetails: true,
        details: [
          "KHU VỰC DÀNH CHO KHÁN GIẢ TRÊN 13 TUỔI",
          "01 vé vào cổng khu vực 'Anh Tài'",
          "01 vòng đeo tay",
          "01 lightstick",
          "01 dây đeo thẻ ATVNCG",
        ],
        quantity: 0,
      },
      {
        id: "toan-nang",
        name: "Toàn năng",
        price: "2.000.000 đ",
        soldOut: false,
        hasDetails: true,
        details: [
          "GHẾ KHU TOÀN NĂNG",
          "01 vòng đeo tay",
          "01 lightstick cơ bản",
        ],
        quantity: 1,
      },
      {
        id: "mua-he",
        name: "Mùa Hè rực rỡ",
        price: "1.000.000 đ",
        soldOut: true,
        hasDetails: true,
        details: [
          "GHẾ KHU MÙA HÈ RỰC RỠ",
          "01 vòng đeo tay",
        ],
        quantity: 0,
      },
      {
        id: "vuot-chong-gai",
        name: "Vượt chông gai",
        price: "800.000 đ",
        soldOut: false,
        hasDetails: true,
        details: [
          "GHẾ KHU VƯỢT CHÔNG GAI",
          "01 vòng đeo tay cơ bản",
        ],
        quantity: 1,
      },
    ],
  },

  // Bạn có thể thêm nhiều sự kiện khác ở đây
];

export default eventsData;
