import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // 1. Import axios
import TICKETZ_LOGO from '../Elements/ticketZ.png';

// --- CẤU HÌNH API ---
const API_BASE_URL = process.env.BACKEND_URL;
const DEFAULT_AVATAR = TICKETZ_LOGO;

const AdminHeader = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 2. State riêng cho Admin Header (để không phụ thuộc vào Context đang bị lỗi)
  const [adminInfo, setAdminInfo] = useState({
    name: "Administrator",
    avatar: DEFAULT_AVATAR
  });

  const handleLogout = () => {
    // 1. Xóa token
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");

    window.location.href = '/';
  };

  // 3. Gọi API lấy thông tin Admin khi Header được load
  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!token) return;
      try {
        // GỌI ĐÚNG API CỦA ADMIN (Theo Swagger Page 3)
        const response = await axios.get(`${API_BASE_URL}/admin/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Admin API thường trả về object trực tiếp (theo Swagger)
        // hoặc bọc trong user. Ta kiểm tra cả 2 cho chắc.
        const data = response.data.user || response.data || {};

        setAdminInfo({
          name: data.name || data.username || "Administrator",
          avatar: data.avatar || DEFAULT_AVATAR
        });

      } catch (error) {
        console.warn("⚠️ AdminHeader: Không lấy được thông tin Admin:", error);
        // Nếu lỗi, giữ nguyên mặc định là "Administrator" và Logo
      }
    };

    fetchAdminProfile();
  }, [token]);

  const MenuItem = ({ text, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
      <span>{text}</span>
    </button>
  );

  return (
    <div className="absolute top-0 left-[272px] right-0 h-20 flex gap-[11px] bg-white shadow-[0px_4px_4px_#00000040]">

      <div className="absolute top-[15px] right-[40px] flex items-center gap-3">
        <div className="text-right hidden md:block">
          {/* HIỂN THỊ TÊN TỪ STATE RIÊNG */}
          <p className="text-sm font-bold text-gray-800 leading-none mb-0.5">
            {adminInfo.name}
          </p>
          <p className="text-[11px] text-gray-500 leading-none">Administrator</p>
        </div>

        <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer relative">
          <img
            // HIỂN THỊ AVATAR TỪ STATE RIÊNG
            src={adminInfo.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover mb-1 border border-gray-300"
            onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_AVATAR; }}
          />

          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
              <div className="py-1">
                <MenuItem
                  text="Tài khoản của tôi"
                  onClick={() => navigate('/admin/tai-khoan-cua-toi')}
                />
                <div className="h-px bg-gray-200 my-1" />

                <MenuItem
                  text="Đăng xuất"
                  onClick={handleLogout}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;