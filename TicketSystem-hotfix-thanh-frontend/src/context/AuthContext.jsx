import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Cấu hình API
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

// Tài khoản mặc định để tự động đăng nhập
const AUTO_LOGIN_CREDENTIALS = {
    "username": "Korey.Bechtelar18_19",
  "password": "Pass@1234"
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [user, setUser] = useState({ name: "Loading...", avatar: "" });
  const [isReady, setIsReady] = useState(false); // Biến này để biết đã load xong chưa

  // --- HÀM LẤY THÔNG TIN USER (Dùng chung) ---
  const fetchUserProfile = async (currentToken) => {
      try {
          const response = await axios.get(`${API_BASE_URL}/customer/profile`, {
              headers: { 'Authorization': `Bearer ${currentToken}` }
          });
          const userData = response.data.user || {};
          
          setUser({
              name: userData.name || userData.username || "Admin",
              avatar: userData.avatar || "",
              role: "Administrator" 
          });
      } catch (error) {
          console.error("⚠️ Không lấy được thông tin user:", error);
      }
  };

  // --- LOGIC TỰ ĐỘNG ĐĂNG NHẬP ---
  useEffect(() => {
      const initAuth = async () => {
          try {
              console.log("🔄 Đang tự động lấy Token mới...");
              
              // 1. Gọi API Login
              const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, AUTO_LOGIN_CREDENTIALS);
              const newToken = loginRes.data.access_token;

              // 2. Lưu Token
              setToken(newToken);
              localStorage.setItem('accessToken', newToken);
              console.log("✅ Token đã cập nhật!");

              // 3. Gọi tiếp API lấy thông tin User (để hiển thị lên Header)
              await fetchUserProfile(newToken);

          } catch (error) {
              console.error("❌ Lỗi Auto Login:", error);
              // Nếu lỗi quá nặng thì có thể fallback về token cũ trong localStorage (nếu có)
          } finally {
              setIsReady(true); // Đánh dấu là đã xử lý xong (dù thành công hay thất bại)
          }
      };

      initAuth();
  }, []);

  // Context cung cấp: token, user info, và hàm reload profile (dùng khi update)
  return (
    <AuthContext.Provider value={{ token, user, fetchUserProfile }}>
      {/* Chỉ hiển thị App khi đã có Token (hoặc đã chạy xong logic login) */}
      {isReady ? children : (
          <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
              Đang khởi tạo hệ thống...
          </div>
      )}
    </AuthContext.Provider>
  );
};