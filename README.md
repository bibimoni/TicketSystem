# Customer - Frontend
## Cấu trúc thư mục
```
tickez-frontend/
├── public/
│ ├── logo.png
├── src/
│ ├── assets/
│ │ └── images/
│ │ ├── ....
│ ├── components/ # các component được sử dụng trong /pages
│ │ ├── AdvertisingBanner.jsx
│ │ ├── BackButton.jsx
│ │ ├── Booking.jsx
│ │ ├── Breadcrumb.jsx
│ │ ├── CatalogBar.jsx
│ │ ├── Footer.jsx
│ │ ├── Form.jsx
│ │ ├── HeaderBar.jsx
│ │ ├── HeroBanner.jsx
│ │ ├── Info.jsx
│ │ ├── ListEvent.jsx
│ │ ├── MoreEvent.jsx
│ │ ├── Paying.jsx
│ │ ├── SeachEvent.jsx
│ │ └── TicketDetail.jsx
│ │ └── Profile.jsx
│ ├── database/ # mockdata, có thể remove
│ │ ├── Event.js
│ │ ├── Events.js
│ │ └── TrendingEvent.js
│ │ └── User.js
│ ├── pages/ # các trang hiển thị
│ │ ├── AboutEvent.jsx
│ │ ├── BookingTicket.jsx
│ │ ├── Home.jsx
│ │ ├── Pay.jsx
│ │ ├── QuestionForm.jsx
│ │ └── Search.jsx
│ │ └── MyProfile.jsx
│ ├── services/ # cấu hình để call API
│ │ ├── ...
│ ├── App.jsx # Chứa các routes
│ ├── App.css
│ ├── index.css
│ └── index.jsx
├── tailwind.config.js
├── index.html
├── vite.config.js
├── package.json
└── package-lock.json
```

## Cài đặt và chạy Local
1. Cài dependencies

```npm install```

2. Chạy ứng dụng

```npm run dev```

Ứng dụng sẽ chạy ở ```http://localhost:3000/``` vì server chạy ở port này.