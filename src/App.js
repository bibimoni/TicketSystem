// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import AboutEvent from "./pages/AboutEvent";
import BookingTicket from "./pages/BookingTicket";
import QuestionForm from "./pages/QuestionForm";
import Pay from "./pages/Pay";
import MyProfile from "./pages/MyProfile";

function App() {
  return (

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/about-event/:eventId" element={<AboutEvent />} />
      <Route path="/booking/:eventId" element={<BookingTicket />} />
      <Route path="/question-form/:eventId" element={<QuestionForm />} />
      <Route path="/pay/:eventId" element={<Pay />} />

      <Route path="/profile" element={<MyProfile />} />
    </Routes>
    
    // <Home />
  );
}

export default App;