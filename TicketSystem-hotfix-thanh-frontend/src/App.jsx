// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { EventFormProvider } from './context/EventContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import Search from "./pages/Search";
import AboutEvent from "./pages/AboutEvent";
import BookingTicket from "./pages/BookingTicket";
import QuestionForm from "./pages/QuestionForm";
import Pay from "./pages/Pay";
import MyProfile from "./pages/MyProfile";
import MyTicket from "./pages/MyTicket";
import GoogleCallback from "./pages/GoogleCallback";
import PayingSuccess from "./pages/PayingSuccess";
import PayingCancel from "./pages/PayingCancel";

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
import OrdersPageAdmin from './eventorderpage/OrdersPageAdmin.jsx';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const token = params.get("access_token");

    if (token) {
      // console.log("Google Login Success, Token:", token);

      localStorage.setItem("token", token);

      window.history.replaceState({}, document.title, window.location.pathname);

      window.location.reload(); // Reload để cập nhật Header

    }
  }, [location, navigate]);
  return (
    <EventFormProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/about-event/:eventId" element={<AboutEvent />} />
        <Route path="/booking/:eventId" element={<BookingTicket />} />
        <Route path="/question-form/:eventId" element={<QuestionForm />} />
        <Route path="/pay/:eventId" element={<Pay />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-ticket" element={<MyTicket />} />
        <Route path="/checkout/success" element={<PayingSuccess />} />
        <Route path="/checkout/cancel" element={<PayingCancel />} />

        {/* === ROUTE CỦA USER=== */}
        <Route path="/tao-su-kien/buoc-1" element={<EventPage1 />} />
        <Route path="/tao-su-kien/buoc-2" element={<EventPage2 />} />
        <Route path="/tao-su-kien/buoc-3" element={<EventPage3 />} />
        <Route path="/tao-su-kien/buoc-4" element={<EventPage4 />} />

        <Route path="/su-kien-cua-toi" element={<MyEventsPage />} />
        <Route path="/ve-cua-toi" element={<MyTicket />} />
        <Route path="/tai-khoan-cua-toi" element={<MyProfile />} />

        <Route path="/event-edit/:eventId/buoc-1" element={<EventPage1 />} />
        <Route path="/event-edit/:eventId/buoc-2" element={<EventPage2 />} />
        <Route path="/event-edit/:eventId/buoc-3" element={<EventPage3 />} />
        <Route path="/event-edit/:eventId/buoc-4" element={<EventPage4 />} />

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
          <Route path="orders" element={<OrdersPageAdmin />} />
        </Route>

        <Route path="/admin/dashboard" element={<DashBoard />} />
        <Route path="/admin/tai-khoan-cua-toi" element={<AdminProfilePage />} />
      </Routes>
    </EventFormProvider>

  );
}

export default App;