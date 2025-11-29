import React, { useState, useEffect, useCallback } from "react";
import { CameraIcon, User, Ticket, Calendar } from "lucide-react";
import userService from "../services/userService";

function Profile() {
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
            console.log("Profile Data:", data); // Log để kiểm tra cấu trúc

            // Tùy vào cấu trúc API trả về, có thể là data.user hoặc data
            const profile = data.user || data;

            // Xử lý giới tính (Backend trả về English -> Frontend hiển thị Tiếng Việt)
            let genderRadio = "khac";
            if (profile.sex?.toLowerCase() === "male") genderRadio = "nam";
            else if (profile.sex?.toLowerCase() === "female") genderRadio = "nu";

            // Xử lý ngày sinh (Chuyển về format yyyy-MM-dd cho input type="date")
            let formattedBirthDate = "";
            if (profile.birth_date) {
                formattedBirthDate = new Date(profile.birth_date).toISOString().split("T")[0];
            }

            // Xử lý số điện thoại (Tách mã vùng nếu có)
            // Giả sử backend lưu dạng: "+84-909123456" hoặc "0909123456"
            let phoneCode = "+84";
            let phoneNumber = profile.phone_number || "";

            if (phoneNumber.includes("-")) {
                const parts = phoneNumber.split("-");
                if (parts.length === 2) {
                    phoneCode = parts[0];
                    phoneNumber = parts[1];
                }
            } else if (phoneNumber.startsWith("+")) {
                // Logic tách tạm thời nếu không có dấu gạch ngang
                phoneCode = phoneNumber.substring(0, 3);
                phoneNumber = phoneNumber.substring(3);
            }

            setUser({
                name: profile.name || profile.username || "", // Ưu tiên name
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
            console.error(err);
            setError(err.response?.data?.message || "Lấy thông tin thất bại");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);

    // --- Handle field change ---
    const handleChange = useCallback((field, value) => {
        setUser(prev => ({ ...prev, [field]: value }));
        setError("");
    }, []);

    // --- Handle submit ---
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

            console.log("Sending update:", body); 

            await userService.updateProfile(body);
            await fetchProfile();
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Cập nhật thất bại");
        } finally {
            setUpdating(false);
        }
    };

    // --- Handle avatar change ---
    const handleAvatarChange = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview local
        const reader = new FileReader();
        reader.onloadend = () => {
            setUser(prev => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);

        try {
            setIsUploadingAvatar(true); 
            console.log("Đang upload ảnh...");
            const response = await userService.uploadImage(file);
            console.log("Upload thành công:", response);
            const serverUrl = response.url; 

            if (serverUrl) {
                setUser(prev => ({ ...prev, avatar: serverUrl }));
            }

        } catch (err) {
            console.error("Lỗi upload ảnh:", err);
            alert("Upload ảnh thất bại!");
        } finally {
            setIsUploadingAvatar(false);
        }
    }, []);

    // Catogory 
    const category = [
        { label: "Thông tin tài khoản", active: true, icon: User },
        { label: "Vé của tôi", active: false, icon: Ticket },
        { label: "Sự kiện của tôi", active: false, icon: Calendar },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-lg text-primary">
            Đang tải thông tin...
        </div>
    );

    if (error && user.name) return (
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
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover"
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
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${item.active ? "bg-white/50" : "hover:bg-white/30"
                                    }`}
                            >
                                <item.icon className="w-[25px] h-[25px] text-primary" />
                                <span
                                    className={`text-sm ${item.active ? "font-extrabold" : "font-semibold"
                                        } text-primary`}
                                >
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Separator */}
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
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6"
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
                                        className="w-[162px] h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6"
                                    >
                                        <option value="+84">+84</option>
                                        <option value="+1">+1</option>
                                        <option value="+44">+44</option>
                                        <option value="+81">+81</option>
                                        <option value="+82">+82</option>
                                    </select>

                                    <input
                                        value={user.phoneNumber}
                                        onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                        className="flex-1 h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6"
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
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 outline-none"
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
                                                className="w-5 h-5 accent-primary"
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
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 outline-none focus:border-primary border border-transparent"
                                />
                            </div>

                            {/* Thông tin thêm */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Thông tin thêm</label>
                                <textarea
                                    value={user.information}
                                    onChange={(e) => handleChange("information", e.target.value)}
                                    className="h-[100px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 py-3 resize-none outline-none focus:border-primary border border-transparent"
                                    placeholder="Giới thiệu bản thân..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={updating}
                                className="h-[60px] bg-primary rounded-[5px] font-extrabold text-white text-xl mt-4 hover:opacity-80 disabled:opacity-50 transition-opacity"
                            >
                                {updating ? "Đang cập nhật..." : "Cập nhật"}
                            </button>
                        </form>

                        {/* AVATAR */}
                        <div className="flex flex-col items-center mx-8">
                            <div className="relative w-[200px] h-[200px] rounded-full">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="w-full h-full object-cover rounded-full"
                                />

                                {/* Nút camera */}
                                <button
                                    onClick={() => document.getElementById("avatarInput").click()}
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <CameraIcon className="w-6 h-6 text-white" />
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