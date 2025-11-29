import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EventFormProvider } from './context/EventContext'; 

import EventPage1 from './createEvents/EventPage1/EventPage1.jsx'; 
import EventPage2 from './createEvents/EventPage2/EventPage2.jsx';
import EventPage3 from './createEvents/EventPage3/EventPage3.jsx';
import EventPage4 from './createEvents/EventPage4/EventPage4.jsx';
import MyEventsPage from './myEventsPage/MyEventsPage.jsx';
import EventDetailLayout from './eventorderpage/EventDetailLayout.jsx';
import OrdersPage from './eventorderpage/OrdersPage.jsx'
import OverviewPage from './eventorderpage/OverviewPage.jsx';
import OrganizerLayout from './organizerlayout/OrganizerLayout.jsx';
import BtcTermsPage from './organizerlayout/BtcTermsPage.jsx';
import VoucherPage from './eventorderpage/VoucherPage.jsx';
import CreateVoucherPage from './eventorderpage/CreateVoucherPage.jsx';
import DashBoard from './dashboard/Dashboard.jsx'
import AdminProfilePage from './information/AdminProfilePage.jsx';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
    <EventFormProvider>
      <Routes>
      {/* === ROUTE CỦA USER=== */}
        <Route path="/tao-su-kien/buoc-1" element={<EventPage1 />} />
        <Route path="/tao-su-kien/buoc-2" element={<EventPage2 />} />
        <Route path="/tao-su-kien/buoc-3" element={<EventPage3 />} />
        <Route path="/tao-su-kien/buoc-4" element={<EventPage4 />} />

        <Route path="/su-kien-cua-toi" element={<MyEventsPage />} />
        <Route path="/ve-cua-toi" element={<div>Vé của tôi</div>} />
        <Route path="/tai-khoan-cua-toi" element={<div>Tài Khoản của tôi </div> } />

        <Route path="/event-edit/:eventId/buoc-1" element={<EventPage1 />} />
        <Route path="/event-edit/:eventId/buoc-2" element={<EventPage2 />} />
        <Route path="/event-edit/:eventId/buoc-3" element={<EventPage3 />} />
        <Route path="/event-edit/:eventId/buoc-4" element={<EventPage4 />} />

        {/* --- SỬA ĐOẠN NÀY: Dùng đường dẫn tương đối (Relative Path) --- */}
        <Route path="/event/:eventId" element={<EventDetailLayout />}>
          {/* Mặc định vào Overview */}
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="orders" element={<OrdersPage />} />

          {/* Danh sách Voucher: /event/:id/voucher */}
          <Route path="voucher" element={<VoucherPage />} />
          
          {/* Tạo mới: /event/:id/voucher/new */}
          <Route path="voucher/new" element={<CreateVoucherPage />} />
          
          {/* Chỉnh sửa: /event/:id/voucher/edit/:vid */}
          <Route path="voucher/edit/:voucherId" element={<CreateVoucherPage />} />
        </Route>
        
        <Route element={<OrganizerLayout />}>
          <Route path="/dieu-khoan-BTC" element={<BtcTermsPage />} />
        </Route>

      {/* === ROUTE CỦA ADMIN === */}
        <Route path="/admin/danh-sach-su-kien" element={<MyEventsPage isAdmin={true} />} />
        <Route path="/admin/duyet-su-kien/:eventId/buoc-1" element={<EventPage1 isAdmin={true} />} />
        <Route path="/admin/duyet-su-kien/:eventId/buoc-2" element={<EventPage2 isAdmin={true} />} />
        <Route path="/admin/duyet-su-kien/:eventId/buoc-3" element={<EventPage3 isAdmin={true} />} />
        <Route path="/admin/duyet-su-kien/:eventId/buoc-4" element={<EventPage4 isAdmin={true} />} />
        
        <Route path="/admin/event-detail/:eventId" element={<EventDetailLayout isAdmin={true} />}>
          <Route path="overview" element={<OverviewPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
 
        <Route path="/admin/dashboard" element={<DashBoard />} />
        <Route path="/admin/tai-khoan-cua-toi" element={<AdminProfilePage />} />
      </Routes>
    </EventFormProvider>
    </AuthProvider>
  );
}

export default App;