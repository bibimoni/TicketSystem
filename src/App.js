// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import AboutEvent from "./pages/AboutEvent";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/about-event" element={<AboutEvent />} />
    </Routes>
    // <Home />
  );
}

export default App;