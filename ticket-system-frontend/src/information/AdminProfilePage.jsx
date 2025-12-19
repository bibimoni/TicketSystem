import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Icons
import { FiCamera, FiClipboard, FiCheckSquare, FiClock, FiCalendar, FiHome } from "react-icons/fi";
import { Calendar } from "../Elements/Calendar";

// Import hình ảnh
import rectangle7 from "../Elements/rectangle-7.png";
import rectangle62 from "../Elements/rectangle-62.png";
import TICKETZ_LOGO from '../Elements/ticketZ.png';
import rectangle53 from "../Elements/rectangle-53.svg";
import rectangle56 from "../Elements/rectangle-56.svg";
import rectangle57 from "../Elements/rectangle-57.svg";
import rectangle58 from "../Elements/rectangle-58.svg";
import ticke12 from "../Elements/ticke-1-2.png";

// --- CẤU HÌNH API ---
const API_BASE_URL = process.env.BACKEND_URL;
const DEFAULT_AVATAR = TICKETZ_LOGO;

const COUNTRY_CODES = [
    { code: "+84", flag: "🇻🇳", label: "Vietnam" },
    { code: "+1", flag: "🇺🇸", label: "USA" },
    { code: "+44", flag: "🇬🇧", label: "UK" },
    { code: "+81", flag: "🇯🇵", label: "Japan" },
    { code: "+82", flag: "🇰🇷", label: "Korea" },
    { code: "+86", flag: "🇨🇳", label: "China" },
    { code: "+65", flag: "🇸🇬", label: "Singapore" },
];

const handleLogout = () => {
    // 1. Xóa token
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");

    window.location.href = '/';
};

const uploadImageToBackend = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return {
            url: response.data.url || response.data,
            public_id: response.data.public_id || ""
        };
    } catch (error) {
        console.error("❌ Lỗi upload ảnh:", error);
        return null;
    }
};

const AdminProfilePage = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        phoneCode: "+84",
        phoneNumber: "",
        email: "",
        dob: "",
        gender: "Khác",
        address: "",
        avatar: DEFAULT_AVATAR,
        avatarPublicId: "",
        adminId: "Loading...",
        approvedEvents: 0,
        lastLogin: new Date().toLocaleString('vi-VN'),
        createdAt: "Loading..."
    });

    // --- 1. LẤY DỮ LIỆU PROFILE & TÍNH TỔNG SỰ KIỆN ---
    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                // A. Gọi API lấy Profile
                const profilePromise = axios.get(`${API_BASE_URL}/admin/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // B. Gọi API đếm số lượng cho từng trạng thái đã xử lý
                // PUBLISHED (Đã duyệt) + CANCELLED (Đã hủy/Từ chối) + COMPLETED (Đã xong)
                const statusesToCheck = ['PUBLISHED', 'CANCELLED', 'COMPLETED'];

                const countPromises = statusesToCheck.map(status =>
                    axios.get(`${API_BASE_URL}/event/events-count/${status}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                );

                // Chạy song song tất cả API để tiết kiệm thời gian
                const [profileRes, ...countResponses] = await Promise.all([
                    profilePromise,
                    ...countPromises
                ]);

                // C. Tính tổng số sự kiện đã xử lý
                const totalProcessed = countResponses.reduce((sum, res) => {
                    // API trả về số trực tiếp hoặc { count: 10 } (tùy backend), ta ép kiểu cho chắc
                    const count = Number(res.data) || 0;
                    return sum + count;
                }, 0);

                console.log("📊 Tổng sự kiện đã xử lý:", totalProcessed);

                // D. Cập nhật State
                const user = profileRes.data.user || {};
                let pCode = "+84";
                let pNumber = user.phone_number || "";
                if (pNumber.startsWith('+')) {
                    const foundCode = COUNTRY_CODES.find(c => pNumber.startsWith(c.code));
                    if (foundCode) {
                        pCode = foundCode.code;
                        pNumber = pNumber.slice(pCode.length);
                    }
                }

                setFormData(prev => ({
                    ...prev,
                    fullName: user.name || user.username || "",
                    email: user.email || "",
                    address: user.address || "",
                    gender: user.sex === 'male' ? 'Nam' : (user.sex === 'female' ? 'Nữ' : 'Khác'),
                    dob: user.birth_date ? user.birth_date.substring(0, 10) : "",
                    avatar: user.avatar || DEFAULT_AVATAR,
                    avatarPublicId: user.avatar_public_id || "",
                    phoneCode: pCode,
                    phoneNumber: pNumber,
                    adminId: profileRes.data.user_id || "N/A",
                    createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : "N/A",

                    // --- Cập nhật tổng số ---
                    approvedEvents: totalProcessed
                }));

            } catch (error) {
                console.error("❌ Lỗi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, [token]);

    // --- 2. XỬ LÝ UPLOAD ẢNH ---
    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({ ...prev, avatar: previewUrl }));

            const result = await uploadImageToBackend(file);
            if (result && result.url) {
                setFormData(prev => ({
                    ...prev,
                    avatar: result.url,
                    avatarPublicId: result.public_id
                }));
            }
        }
        e.target.value = null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // --- 3. CẬP NHẬT PROFILE ---
    const handleUpdate = async () => {
        setLoading(true);
        try {
            const payload = {
                name: formData.fullName,
                phone_number: `${formData.phoneCode}${formData.phoneNumber}`,
                address: formData.address,
                sex: formData.gender === 'Nam' ? 'male' : (formData.gender === 'Nữ' ? 'female' : 'other'),
                birth_date: formData.dob ? new Date(formData.dob).toISOString() : null,
                avatar: formData.avatar,
                avatar_public_id: formData.avatarPublicId,
                information: ""
            };

            await axios.patch(`${API_BASE_URL}/admin/profile`, payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            alert("✅ Đã cập nhật hồ sơ thành công!");

        } catch (error) {
            console.error("❌ Lỗi cập nhật:", error);
            const msg = error.response?.data?.message || "Cập nhật thất bại.";
            alert(`❌ Lỗi: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#d9d9d9] overflow-hidden border border-solid border-[#d9d9d9] w-full min-w-[1440px] min-h-[1905px] relative">

            {/* BACKGROUND & SIDEBAR */}
            <div className="absolute top-[72px] left-[267px] right-0 h-[1439px] bg-[#fff8f7]" />
            <div className="absolute top-0 left-0 w-[272px] h-[1511px] bg-[#f94f2f]" />
            <img className="absolute top-[-841px] left-[1484px] w-[203px] h-[45px]" alt="bg" src={rectangle7} />

            <div className="absolute top-2 left-[5px] w-[63px] h-[63px]">
                <img className="absolute top-0 left-0 w-[63px] h-[63px] object-contain" alt="Logo" src={TICKETZ_LOGO} />
            </div>
            <div
                onClick={() => navigate('/admin/dashboard')}
                className="absolute top-[27px] left-[89px] [font-family:'Moul-Regular',Helvetica] font-normal text-white text-xl text-center cursor-pointer leading-[15px]">
                Admin <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; center
            </div>

            {/* HEADER BAR */}
            <div className="absolute top-0 left-[272px] right-0 h-20 flex gap-[11px] bg-white shadow-[0px_4px_4px_#00000040]">
                <div className="absolute top-[15px] right-[40px] flex items-center gap-3">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-bold text-gray-800 leading-none mb-0.5">{formData.fullName || "Admin"}</p>
                        <p className="text-[11px] text-gray-500 leading-none">Administrator</p>
                    </div>
                    <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer relative">
                        <img src={formData.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover mb-1 border border-gray-300" />
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                                <div className="py-1">
                                    <MenuItem text="Tài khoản của tôi" onClick={() => navigate('/admin/tai-khoan-cua-toi')} />
                                    <div className="h-px bg-gray-200 my-1" />
                                    <MenuItem text="Đăng xuất" onClick={handleLogout} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SIDEBAR BUTTONS */}
            <div className="absolute left-[19px] w-60 h-[54px] top-[140px]">
                <div onClick={() => navigate('/admin/dashboard')} className="w-full h-full relative cursor-pointer">
                    <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="btn" src={rectangle62} />
                    <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs">Dashboard</div>
                    <FiHome className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1] text-black" />
                </div>
            </div>
            <div className="absolute w-[238px] h-[54px] left-[19px] top-[223px] flex">
                <div onClick={() => navigate('/admin/danh-sach-su-kien')} className="w-60 h-[54px] relative cursor-pointer">
                    <img className="absolute top-0 left-0 w-[238px] h-[54px]" alt="btn" src={rectangle62} />
                    <div className="absolute top-[19px] left-[47px] [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-black text-xs text-center">Danh sách sự kiện</div>
                    <Calendar className="!absolute !top-[11px] !left-[9px] !w-8 !h-8 !aspect-[1]" />
                </div>
            </div>

            {/* FORM & INFO */}
            <div className="absolute top-0 left-[272px] right-0 bottom-0 overflow-y-auto overflow-x-hidden z-10">

                <div className="relative w-[1112px] mx-auto min-h-screen pb-40">
                    <div className="absolute top-0 left-[-305px] w-full h-full">
                        <div className="absolute top-[120px] left-[320px] w-[1050px] bg-white p-10 rounded-xl shadow-sm">
                            <div className="flex gap-12">

                                {/* CỘT TRÁI: FORM */}
                                <div className="w-2/3 flex flex-col gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">Họ và tên</label>
                                        <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-[650px] bg-[#FFF0EB] border-none rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#F94F2F] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">Số điện thoại</label>
                                        <div className="flex gap-3">
                                            <div className="relative w-30">
                                                <select name="phoneCode" value={formData.phoneCode} onChange={handleChange} className="w-full h-full bg-[#FFF0EB] rounded-md pl-3 pr-8 text-gray-700 font-medium focus:outline-none appearance-none cursor-pointer">
                                                    {COUNTRY_CODES.map((country) => (<option key={country.code} value={country.code}>{country.flag} {country.code}</option>))}
                                                </select>
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">▼</span>
                                            </div>
                                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="flex-1 bg-[#FFF0EB] border-none rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#F94F2F] outline-none" placeholder="Nhập số điện thoại..." />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">Email</label>
                                        <input type="email" name="email" value={formData.email} disabled className="w-[650px] bg-[#FFF0EB] border-none rounded-md px-4 py-3 text-gray-700 opacity-70 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">Ngày sinh</label>
                                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-[650px] bg-[#FFF0EB] border-none rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#F94F2F] outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">Giới tính</label>
                                        <div className="flex gap-8 mt-2">
                                            {['Nam', 'Nữ', 'Khác'].map((gender) => (
                                                <label key={gender} className="flex items-center cursor-pointer gap-2">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender === gender ? 'border-[#F94F2F]' : 'border-gray-400'}`}>
                                                        {formData.gender === gender && <div className="w-2.5 h-2.5 bg-[#F94F2F] rounded-full"></div>}
                                                    </div>
                                                    <input type="radio" name="gender" value={gender} checked={formData.gender === gender} onChange={handleChange} className="hidden" />
                                                    <span className={`font-medium ${formData.gender === gender ? 'text-[#F94F2F]' : 'text-gray-600'}`}>{gender}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">Địa chỉ</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-[650px] bg-[#FFF0EB] border-none rounded-md px-4 py-3 text-gray-700 focus:ring-2 focus:ring-[#F94F2F] outline-none" />
                                    </div>

                                    <button onClick={handleUpdate} disabled={loading} className="cursor-pointer mt-4 w-full bg-[#F94F2F] hover:bg-[#d43d20] text-white font-bold py-3 rounded-md shadow-md transition-all border-none disabled:opacity-50">
                                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                                    </button>
                                </div>

                                {/* CỘT PHẢI: AVATAR & THỐNG KÊ */}
                                <div className="w-1/3 flex flex-col items-center">
                                    <div className="relative mb-8 group">
                                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                            <img src={formData.avatar} alt="Admin Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                        </div>
                                        <button onClick={() => fileInputRef.current.click()} className="absolute bottom-2 right-2 bg-[#F94F2F] text-white p-2 rounded-full border-2 border-white shadow-md hover:bg-[#d43d20] transition-colors">
                                            <FiCamera size={18} />
                                        </button>
                                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                                    </div>

                                    <div className="w-full bg-white border border-[#FFE0D1] rounded-xl p-6 shadow-[0_4px_20px_rgba(249,79,47,0.08)]">
                                        <div className="flex flex-col gap-5">
                                            <InfoItem icon={<FiClipboard size={20} className="text-[#F94F2F]" />} label="Mã Admin:" value={formData.adminId} />

                                            {/* --- HIỂN THỊ TỔNG SỐ SỰ KIỆN ĐÃ XỬ LÝ --- */}
                                            <InfoItem icon={<FiCheckSquare size={20} className="text-[#F94F2F]" />} label="Số sự kiện đã duyệt/xử lý:" value={formData.approvedEvents} />

                                            <InfoItem icon={<FiClock size={20} className="text-[#F94F2F]" />} label="Lần đăng nhập gần nhất:" value={formData.lastLogin} />
                                            <InfoItem icon={<FiCalendar size={20} className="text-[#F94F2F]" />} label="Ngày tạo tài khoản:" value={formData.createdAt} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <div className="absolute top-[1511px] left-0 right-0 h-[581px]">
                <div className="absolute top-0 left-0 w-full h-full bg-[#5d5c5c]" />

                <img className="absolute top-[60px] left-[121px] w-[345px] h-[113px] aspect-[3.05]" alt="Ticke" src={ticke12} />

                {/* === CÁC CỘT NỘI DUNG (Neo phải) === */}

                {/* CỘT 1: THÔNG TIN (Ngoài cùng bên phải) */}
                {/* Thay left-[1337px] bằng right-[50px] */}
                <div className="absolute top-0 right-[200px] w-[100px] h-full">
                    <div className="absolute top-[60px] w-full [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-xs text-center text-white">THÔNG TIN</div>
                    <div className="absolute top-[90px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] text-center text-white whitespace-nowrap">Thông báo</div>
                    <div className="absolute top-[109px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] text-center text-white whitespace-nowrap">About us</div>
                    <div className="absolute top-32 w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] text-center text-white whitespace-nowrap">FAQs</div>
                    <div className="absolute top-[147px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-[10px] text-center text-white whitespace-nowrap">Góp ý</div>
                </div>

                {/* CỘT 2: LIÊN HỆ (Cách phải 180px) */}
                {/* Thay left-[1217px] bằng right-[180px] */}
                <div className="absolute top-0 right-[400px] w-[100px] h-full">
                    <div className="absolute top-[60px] w-full [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center">LIÊN HỆ</div>
                    <div className="absolute top-[90px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Hotline: 033.33.333</div>
                    <div className="absolute top-[109px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Chatbot hỗ trợ</div>
                </div>

                {/* CỘT 3: QUY ĐỊNH (Cách phải 400px) */}
                {/* Thay left-[972px] bằng right-[400px] */}
                <div className="absolute top-0 right-[600px] w-[150px] h-full">
                    <div className="absolute top-[60px] w-full [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center">QUY ĐỊNH</div>
                    <div className="absolute top-[90px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Hợp đồng</div>
                    <div className="absolute top-[109px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Điều khoản &amp; Điều kiện</div>
                    <div className="absolute top-32 w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Chính sách bảo vệ người dùng</div>
                </div>

                {/* CỘT 4: GIỚI THIỆU (Cách phải 600px) */}
                {/* Thay left-[851px] bằng right-[600px] */}
                <div className="absolute top-0 right-[800px] w-[100px] h-full">
                    <div className="absolute top-[60px] w-full [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center">GIỚI THIỆU</div>
                    <div className="absolute top-[90px] w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center whitespace-nowrap">Giới thiệu về TickeZ.</div>
                </div>

                {/* Social Icons & Follow Us - Giữ nguyên vị trí Left vì nó nằm bên trái */}
                <div className="absolute top-[199px] left-[121px] [font-family:'Montserrat-ExtraBold',Helvetica] font-extrabold text-white text-xs text-center">FOLLOW US</div>
                <img className="absolute top-[221px] left-[121px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle53} />
                <img className="absolute top-[221px] left-[182px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle56} />
                <img className="absolute top-[221px] left-[243px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle57} />
                <img className="absolute top-[221px] left-[304px] w-10 h-10 object-cover" alt="Rectangle" src={rectangle58} />

                {/* Dòng Version: Cho nó căn giữa hoặc căn phải dưới cùng */}
                <p className="absolute top-[309px] left-0 w-full [font-family:'Montserrat-SemiBold',Helvetica] font-semibold text-white text-[10px] text-center tracking-[0] leading-[normal] whitespace-nowrap opacity-70">
                    Bạn đang truy cập TickeZ. phiên bản Số 123456789
                </p>

            </div>
        </div>
    );
};

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5">{icon}</div>
        <div>
            <span className="text-[#F94F2F] font-bold text-sm block">{label}</span>
            <span className="text-gray-700 font-semibold text-sm">{value}</span>
        </div>
    </div>
);

const MenuItem = ({ text, onClick }) => {
    const icons = { "Vé của tôi": "🎫", "Sự kiện của tôi": "📅", "Tài khoản của tôi": "👨‍💻", "Đăng xuất": "➔" };
    return (
        <button onClick={onClick} className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-150 border-none bg-transparent cursor-pointer">
            <span className="text-lg w-6 text-center">{icons[text] || '•'}</span>
            <span>{text}</span>
        </button>
    );
};

export default AdminProfilePage;