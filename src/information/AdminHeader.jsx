import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { defaultAdminInfo } from '../context/mockAdminInfo';
import TICKETZ_LOGO from '../Elements/ticketZ.png'; // Hoặc import ảnh mặc định khác

const DEFAULT_AVATAR = TICKETZ_LOGO; // Ảnh fallback

const AdminHeader = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. Lấy thông tin Admin từ LocalStorage (hoặc dùng mặc định)
  const getAdminData = () => {
    const savedData = localStorage.getItem("adminProfileData");
    if (savedData) {
        const parsed = JSON.parse(savedData);
        return {
            fullName: parsed.fullName || defaultAdminInfo.fullName,
            avatar: parsed.avatar || DEFAULT_AVATAR
        };
    }
    return {
        fullName: defaultAdminInfo.fullName,
        avatar: DEFAULT_AVATAR
    };
  };

  const adminData = getAdminData();

  // Component con MenuItem (Để bên trong hoặc tách ra đều được)
  const MenuItem = ({ text, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
      <span>{text}</span>
    </button>
  );

  return (
    <div className="absolute top-0 left-[272px] w-[1200px] h-20 flex gap-[11px] bg-white shadow-[0px_4px_4px_#00000040]">
         <div className="absolute top-[15px] right-[40px] flex items-center gap-3">
            
            {/* Text Thông tin Admin */}
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-none mb-0.5">
                    {adminData.fullName}
                </p>
                <p className="text-[11px] text-gray-500 leading-none">
                    Administrator
                </p>
            </div>

            {/* Avatar & Dropdown */}
            <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer relative">
                <img 
                  src={adminData.avatar} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full object-cover mb-1 border border-gray-300" 
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
                        onClick={() => { /* Logic đăng xuất */ }} 
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