// src/App.jsx
import { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Search from "./pages/Search";
import AboutEvent from "./pages/AboutEvent";
import BookingTicket from "./pages/BookingTicket";
import QuestionForm from "./pages/QuestionForm";
import Pay from "./pages/Pay";
import MyProfile from "./pages/MyProfile";
import MyTicket from "./pages/MyTicket";
import GoogleCallback from "./pages/GoogleCallback";

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
    </Routes>
  );
}

export default App;