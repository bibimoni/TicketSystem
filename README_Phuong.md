
# 🌟 Quản lý Sự kiện (Event Organizer)

## Overview (Tổng quan)
Đây là dự án front-end cho một hệ thống quản lý sự kiện, tập trung vào nghiệp vụ của Nhà tổ chức sự kiện (Event Organizer).

Mục tiêu của dự án là cung cấp một giao diện trực quan, cho phép các nhà tổ chức toàn quyền quản lý các sự kiện của mình, từ lúc khởi tạo, bán vé, tạo khuyến mãi, cho đến theo dõi hiệu quả kinh doanh. Admin có thể xem xét duyệt hoặc hủy các sự kiện được tạo và xem báo cáo tổng quan về các sự kiện.

## Tính năng chính (Features)
Dự án hiện thực các luồng nghiệp vụ chính sau:

Đối với event organizer:

Tạo sự kiện: Giao diện wizard (từng bước) để nhập thông tin, tạo vé, và cài đặt sự kiện.

Quản lý sự kiện:

Xem danh sách tất cả sự kiện đã tạo (trang "My Events").

Chỉnh sửa thông tin sự kiện đã tạo.

Bảng điều khiển (Dashboard):

Xem tổng quan (doanh thu, số vé bán) của một sự kiện cụ thể.

Xem danh sách đơn hàng (Orders).

Quản lý Voucher:

Tạo voucher giảm giá mới.

Xem danh sách các voucher đã tạo.

Pháp lý: Xem và đồng ý với các Điều khoản của Ban tổ chức (BTC).

Đối với admin:

Xem thông tin chi tiết sự kiện 

Duyệt hoặc hủy sự kiện

Xem báo cáo tổng quan về các sự kiện trên hệ thống

## Công nghệ sử dụng 
Framework: ReactJS (khởi tạo với Vite)

Styling: Tailwind CSS

Quản lý State: React Context

Lưu trữ tạm (Client): LocalStorage (Dùng để lưu dữ liệu khi tạo/chỉnh sửa sự kiện)

## Cấu trúc project.
```
📦 event-admin-project/
|
+---public
|       dieu-khoan.pdf
|       vite.svg
\---src
    |   App.css
    |   App.jsx -- Route
    |   index.css
    |   main.jsx
    +---assets
    |       react.svg
    +---context -- Chứa dữ liệu
    |       EventContext.jsx -- Localstorage lưu dữ liệu khi tạo
    |       mockAdminInfo.js -- Data của admin
    |       mockDashboard.js -- Data của Dashboard admin
    |       mockEventData.js -- Data của các sự kiện
    |       mockOrderData.js -- Data đơn đặt
    |       mockOrganizerInfo.js -- Data (tên, avatar) của event organizer
    |       mockOverviewData.js -- Data tổng quan ( doanh thu, số vé bán,...)
    |       sample1.png
    |       sample2.png
    +---createEvents -- Tạo sự kiện ( Chỉnh sửa sự kiện )
    |   +---EventPage1
    |   |       EventPage1.jsx
    |   +---EventPage2
    |   |       EventPage2.jsx
    |   |       TicketCreator.jsx
    |   +---EventPage3
    |   |       EventPage3.jsx
    |   |       EventSettingsSection.jsx
    |   \---EventPage4
    |           EventPage4.jsx
    |           PaymentForm.jsx
    +---dashboard
    |       Dashboard.jsx -- Dashboard của Admin
    +---Elements
    +---eventorderpage -- Chi tiết sự kiện ( Tổng quan, Đơn hàng, Chỉnh sửa, Voucher)
    |       CreateVoucherPage.jsx
    |       EventDetailLayout.jsx
    |       OrdersPage.jsx
    |       OverviewPage.jsx
    |       VoucherPage.jsx
    +---information
    |       AdminHeader.jsx
    |       AdminProfilePage.jsx
    |       OrganizerHeader.jsx
    +---myEventsPage -- Sự kiện của tôi
    |       EventsPage.jsx
    |       ghibili.jpg
    |       MyEventsPage.jsx
    \---organizerlayout -- Điều khoản BTC
            BtcTermsPage.jsx
            OrganizerLayout.jsx
```

## Haven't done

- Gửi email

- Tìm kiếm

- Chuyển từ "sắp tới" thành "đã qua" cho các sự kiện

