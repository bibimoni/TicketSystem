// src/components/Profile.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CameraIcon, User, Ticket, Calendar } from "lucide-react";
import { toast } from "react-toastify";

import userService from "../services/userService";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        phoneCode: "+84",
        phoneNumber: "",
        birthDate: "",
        gender: "nam",
        address: "",
        information: "",
        avatar: "/logo.png",
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // --- Fetch profile ---
    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const data = await userService.getProfile();

            const profile = data.user || data;

            let genderRadio = "khac";
            if (profile.sex?.toLowerCase() === "male") genderRadio = "nam";
            else if (profile.sex?.toLowerCase() === "female") genderRadio = "nu";

            let formattedBirthDate = "";
            if (profile.birth_date) {
                formattedBirthDate = new Date(profile.birth_date).toISOString().split("T")[0];
            }

            let phoneCode = "+84";
            let phoneNumber = profile.phone_number || "";

            if (phoneNumber.includes("-")) {
                const parts = phoneNumber.split("-");
                if (parts.length === 2) {
                    phoneCode = parts[0];
                    phoneNumber = parts[1];
                }
            } else if (phoneNumber.startsWith("+")) {
                phoneCode = phoneNumber.substring(0, 3);
                phoneNumber = phoneNumber.substring(3);
            }

            setUser({
                name: profile.name || profile.username || "",
                email: profile.email || "",
                gender: genderRadio,
                phoneCode: phoneCode,
                phoneNumber: phoneNumber,
                birthDate: formattedBirthDate,
                address: profile.address || "",
                information: profile.information || "",
                avatar: profile.avatar || "/logo.png",
            });

            setError("");
        } catch (err) {
            // console.error(err);
            if (err.response && err.response.status === 401) {
                toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
                localStorage.removeItem("token");
                navigate("/");
            } else {
                setError(err.response?.data?.message || "Lấy thông tin thất bại");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    const handleChange = useCallback((field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
        setError("");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError("");

        try {
            const fullPhoneNumber = `${user.phoneCode}-${user.phoneNumber}`;
            
            let apiGender = "other";
            if (user.gender === "nam") apiGender = "male";
            if (user.gender === "nu") apiGender = "female";

            const body = {
                name: user.name,
                phone_number: fullPhoneNumber,
                sex: apiGender,
                address: user.address,
                birth_date: user.birthDate,
                information: user.information,
                avatar: user.avatar 
            };

            await userService.updateProfile(body);
            await fetchProfile(); 
            toast.success("Cập nhật thành công!");
        } catch (err) {
            // console.error(err);
            if (err.response && err.response.status === 401) {
                toast.error("Phiên đăng nhập hết hạn.");
                localStorage.removeItem("token");
                navigate("/");
            } else {
                const errorMsg = err.response?.data?.message || "Cập nhật thất bại";
                setError(errorMsg);
                toast.error(errorMsg);
            }
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUser(prev => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);

        try {
            setIsUploadingAvatar(true); 
            const response = await userService.uploadImage(file);
            const serverUrl = response.url; 

            if (serverUrl) {
                setUser(prev => ({ ...prev, avatar: serverUrl }));
            }

        } catch (err) {
            // console.error("Lỗi upload ảnh:", err);
            if (err.response && err.response.status === 401) {
                toast.error("Phiên đăng nhập hết hạn.");
                localStorage.removeItem("token");
                navigate("/");
            } else {
                toast.error("Upload ảnh thất bại!");
            }
        } finally {
            setIsUploadingAvatar(false);
        }
    }, [navigate]);

    const category = [
        { label: "Thông tin tài khoản", active: true, icon: User, href: "/my-profile" },
        { label: "Vé của tôi", active: false, icon: Ticket, href: "/my-ticket" },
        { label: "Sự kiện của tôi", active: false, icon: Calendar, href: "/su-kien-cua-toi" },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-lg text-primary font-bold">
            Đang tải thông tin...
        </div>
    );

    if (error && !user.name) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-primary mb-4">{error}</p>
                <button
                    onClick={fetchProfile}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/75"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="flex px-10 py-8 gap-8">
                {/* Sidebar */}
                <aside className="w-[300px] flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
                        <img 
                            src={user.avatar} 
                            alt="avatar" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.src = "/logo.png" }}
                        />
                    </div>

                    <span className="font-bold text-secondary text-[15px]">
                        {user.name || user.email || "Người dùng"}
                    </span>

                    <nav className="w-full flex flex-col gap-4">
                        {category.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => navigate(item.href)} 
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors w-full text-left ${
                                    item.active ? "bg-white/50 shadow-sm" : "hover:bg-white/30"
                                }`}
                            >
                                <item.icon className="w-[25px] h-[25px] text-primary" />
                                <span
                                    className={`text-sm ${item.active ? "font-extrabold" : "font-semibold"} text-primary`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                <div className="w-[2px] bg-black/20" />

                {/* Main section */}
                <section className="flex-1 flex flex-col">
                    <h1 className="font-bold text-primary text-[32px] mb-4">
                        THÔNG TIN TÀI KHOẢN
                    </h1>

                    <div className="mb-8 w-full h-[4px] bg-white" />

                    <div className="flex w-full justify-between items-start px-8">
                        {/* FORM */}
                        <form
                            className="flex flex-col gap-6 max-w-[600px] w-full flex-1"
                            onSubmit={handleSubmit}
                        >
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                            {/* Họ tên */}
                            <div className="flex flex-col gap-2 ">
                                <label className="font-bold text-black text-base">Họ và tên</label>
                                <input
                                    value={user.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 outline-none focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Số điện thoại</label>
                                <div className="flex gap-4">
                                    <select
                                        value={user.phoneCode}
                                        onChange={(e) => handleChange("phoneCode", e.target.value)}
                                        className="w-[162px] h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 outline-none"
                                    >
                                        <option value="+84">+84</option>
                                        <option value="+1">+1</option>
                                        <option value="+44">+44</option>
                                    </select>

                                    <input
                                        value={user.phoneNumber}
                                        onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                        className="flex-1 h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 outline-none focus:ring-1 focus:ring-primary"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email - không cho sửa */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    className="h-[50px] bg-gray-200 rounded-[5px] font-bold text-secondary text-base px-6 outline-none cursor-not-allowed"
                                />
                            </div>

                            {/* Ngày sinh */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Ngày sinh</label>
                                <input
                                    type="date"
                                    value={user.birthDate}
                                    onChange={(e) => handleChange("birthDate", e.target.value)}
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            {/* Giới tính */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Giới tính</label>
                                <div className="flex gap-8">
                                    {[
                                        { value: "nam", label: "Nam" },
                                        { value: "nu", label: "Nữ" },
                                        { value: "khac", label: "Khác" },
                                    ].map((g) => (
                                        <div key={g.value} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                id={g.value}
                                                name="gender"
                                                value={g.value}
                                                checked={user.gender === g.value}
                                                onChange={(e) => handleChange("gender", e.target.value)}
                                                className="w-5 h-5 accent-primary cursor-pointer"
                                            />
                                            <label htmlFor={g.value} className="font-bold text-base cursor-pointer select-none">
                                                {g.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Địa chỉ</label>
                                <input
                                    value={user.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>

                            {/* Thông tin thêm */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Thông tin thêm</label>
                                <textarea
                                    value={user.information}
                                    onChange={(e) => handleChange("information", e.target.value)}
                                    className="h-[100px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 py-3 resize-none outline-none focus:ring-1 focus:ring-primary"
                                    placeholder="Giới thiệu bản thân..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={updating}
                                className="h-[60px] bg-primary rounded-[5px] font-extrabold text-white text-xl mt-4 hover:bg-red-600 disabled:opacity-50 transition-all"
                            >
                                {updating ? "ĐANG CẬP NHẬT.." : "CẬP NHẬT"}
                            </button>
                        </form>

                        {/* AVATAR */}
                        <div className="flex flex-col items-center mx-8">
                            <div className="relative w-[200px] h-[200px] rounded-full border-2 border-white shadow-md">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="w-full h-full object-cover rounded-full"
                                    onError={(e) => { e.target.src = "/logo.png" }}
                                />

                                {/* Nút camera */}
                                <button
                                    onClick={() => document.getElementById("avatarInput").click()}
                                    disabled={isUploadingAvatar}
                                    className="absolute bottom-0 right-0 w-12 h-12 bg-primary hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                                >
                                    {isUploadingAvatar ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <CameraIcon className="w-6 h-6 text-white" />
                                    )}
                                </button>
                            </div>

                            {/* Input file ẩn */}
                            <input
                                type="file"
                                accept="image/*"
                                id="avatarInput"
                                className="hidden"
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Profile;