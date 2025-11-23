import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { StashUserAvatar } from "../Elements/StashUserAvatar"; // Hoặc dùng ảnh thật nếu có
import TICKETZ_LOGO from '../Elements/ticketZ.png';

// Import dữ liệu mẫu
import { defaultOrganizerInfo } from '../context/mockOrganizerInfo';

const DEFAULT_AVATAR = TICKETZ_LOGO;

const OrganizerHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. Lấy thông tin User từ LocalStorage (Giả lập)
  const getUserData = () => {
    const savedData = localStorage.getItem("organizerProfileData");
    if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
            fullName: parsed.fullName || defaultOrganizerInfo.fullName,
            avatar: parsed.avatar || DEFAULT_AVATAR
        };
    }
    return {
        fullName: defaultOrganizerInfo.fullName,
        avatar: DEFAULT_AVATAR
    };
  };

  const userData = getUserData();

  // Component con cho Menu Item
  const MenuItem = ({ text, onClick }) => {
    // Map icon tương ứng
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
    <div className="absolute top-0 left-[272px] w-[1200px] h-20 flex gap-[11px] bg-white shadow-[0px_4px_4px_#00000040]">
        
        {/* 1. NÚT TẠO SỰ KIỆN (Chỉ có ở User) */}
        <div className="mt-[17px] w-[102px] h-[45px] relative ml-[800px]">
          <button
            onClick={() => navigate('/')} 
            className="flex items-center justify-center w-[108px] h-[45px] rounded-full bg-[#FF5331] text-white text-xs font-semibold shadow-md border-none outline-none hover:bg-[#e04020] transition-colors cursor-pointer"
          >
            Tạo sự kiện
          </button>
        </div>

        {/* 2. THÔNG TIN USER & AVATAR */}
        <div className="relative flex items-center h-full ml-4"> 
             {/* Text Thông tin (Ẩn trên mobile, hiện trên desktop) */}
             <div className="text-right hidden md:block mr-3">
                <p className="text-sm font-bold text-gray-800 leading-none mb-0.5">
                    {userData.fullName}
                </p>
                <p className="text-[11px] text-gray-500 leading-none">
                    Organizer
                </p>
            </div>

            <div className="relative"> 
                {/* Click vào Avatar để mở menu */}
                <div onClick={() => setIsMenuOpen(prev => !prev)} className="cursor-pointer">
                    <img 
                        src={userData.avatar} 
                        alt="User Avatar" 
                        className="w-10 h-10 rounded-full object-cover border border-gray-300" 
                    />
                </div>

                {/* Menu Dropdown */}
                {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="py-1">
                        <MenuItem 
                            text="Vé của tôi" 
                            onClick={() => navigate('/ve-cua-toi')} 
                        />
                        <MenuItem 
                            text="Sự kiện của tôi" 
                            onClick={() => navigate('/su-kien-cua-toi')} 
                        />
                        <MenuItem 
                            text="Tài khoản của tôi" 
                            onClick={() => navigate('/tai-khoan-cua-toi')} // Đường dẫn User
                        />
                        <div className="h-px bg-gray-200 my-1" />
                        <MenuItem 
                            text="Đăng xuất" 
                            onClick={() => { 
                                // Logic đăng xuất
                                navigate('/login'); 
                            }} 
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