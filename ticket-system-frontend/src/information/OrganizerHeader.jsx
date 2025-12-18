import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TICKETZ_LOGO from '../Elements/ticketZ.png';

// --- CẤU HÌNH API ---
const API_BASE_URL = process.env.BACKEND_URL;
const DEFAULT_AVATAR = TICKETZ_LOGO;

const OrganizerHeader = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 1. Lấy token trực tiếp từ localStorage như bạn muốn
    const token = localStorage.getItem("token");

    // State lưu thông tin User
    const [userInfo, setUserInfo] = useState({
        fullName: "Organizer",
        avatar: DEFAULT_AVATAR
    });

    // 2. HÀM ĐĂNG XUẤT (ĐÃ SỬA)
    const handleLogout = () => {
        // Xóa token khỏi bộ nhớ trình duyệt
        localStorage.removeItem("token");
        localStorage.removeItem("userToken");
        navigate('/');
    };

    // GỌI API LẤY PROFILE
    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) return; // Nếu không có token thì thôi
            try {
                const response = await axios.get(`${API_BASE_URL}/customer/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const user = response.data.user || {};

                setUserInfo({
                    fullName: user.name || user.username || "Organizer",
                    avatar: user.avatar || DEFAULT_AVATAR
                });

            } catch (error) {
                console.error("Lỗi tải thông tin Header:", error);
                // Nếu token hết hạn hoặc lỗi, có thể tự động logout luôn nếu muốn:
                // handleLogout();
            }
        };

        fetchProfile();
    }, [token]);

    // Component Menu Item
    const MenuItem = ({ text, onClick }) => {
        const icons = {
            "Vé của tôi": "🎫",
            "Sự kiện của tôi": "📅",
            "Tài khoản của tôi": "👨‍💻",
            "Đăng xuất": "➔"
        };
        return (
            <button onClick={onClick} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
                <span className="text-lg w-6 text-center">{icons[text] || '•'}</span>
                <span>{text}</span>
            </button>
        );
    };

    return (
        <div className="absolute top-0 left-[272px] right-0 h-20 flex gap-[11px] bg-white shadow-[0px_4px_4px_#00000040]">
            {/* NÚT TẠO SỰ KIỆN */}
            <div className="mt-[17px] w-[102px] h-[45px] relative ml-auto mr-8 z-50">
                <button
                    onClick={() => navigate('/tao-su-kien/buoc-1')}
                    className="flex items-center justify-center w-[108px] h-[45px] rounded-full bg-[#FF5331] text-white text-xs font-semibold shadow-md border-none outline-none hover:bg-[#e04020] transition-colors cursor-pointer"
                >
                    Tạo sự kiện
                </button>
            </div>

            {/* THÔNG TIN USER */}
            <div className="relative flex items-center h-full ml-4 z-50">
                <div className="text-right hidden md:block mr-3">
                    <p className="text-sm font-bold text-gray-800 leading-none mb-0.5">
                        {userInfo.fullName}
                    </p>
                    <p className="text-[11px] text-gray-500 leading-none">
                        Organizer
                    </p>
                </div>

                <div className="relative">
                    {/* Avatar Click */}
                    <div onClick={() => setIsMenuOpen(prev => !prev)} className="cursor-pointer">
                        <img
                            src={userInfo.avatar}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = DEFAULT_AVATAR;
                            }}
                        />
                    </div>

                    {/* Menu Dropdown */}
                    {isMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                            <div className="py-1">
                                <MenuItem
                                    text="Vé của tôi"
                                    onClick={() => navigate('/my-ticket')}
                                />
                                <MenuItem
                                    text="Sự kiện của tôi"
                                    onClick={() => navigate('/su-kien-cua-toi')}
                                />
                                <MenuItem
                                    text="Tài khoản của tôi"
                                    onClick={() => navigate('/my-profile')}
                                />
                                <div className="h-px bg-gray-200 my-1" />

                                {/* GỌI HÀM LOGOUT ĐÃ SỬA */}
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

export default OrganizerHeader;
