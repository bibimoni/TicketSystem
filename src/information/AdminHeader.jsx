import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TICKETZ_LOGO from '../Elements/ticketZ.png';

const DEFAULT_AVATAR = TICKETZ_LOGO;

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Lấy hàm logout
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const MenuItem = ({ text, onClick }) => (
    <button onClick={onClick} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-none bg-transparent cursor-pointer">
      <span>{text}</span>
    </button>
  );

  return (
    <div className="absolute top-0 left-[272px] w-[1200px] h-20 flex gap-[11px] bg-white shadow-[0px_4px_4px_#00000040]">
         <div className="absolute top-[15px] right-[40px] flex items-center gap-3">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-none mb-0.5">{user?.name}</p>
                <p className="text-[11px] text-gray-500 leading-none">Administrator</p>
            </div>

            <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer relative">
                <img 
                  src={user?.avatar || DEFAULT_AVATAR} 
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
                      
                      {/* NÚT ĐĂNG XUẤT ĐÃ QUAY TRỞ LẠI */}
                      <MenuItem 
                        text="Đăng xuất" 
                        onClick={() => { 
                            logout(); // Gọi hàm này sẽ kích hoạt giao diện Login giả
                            navigate('/'); // (Tùy chọn) Điều hướng về gốc
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

export default AdminHeader;