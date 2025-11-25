
import React, { useState, useEffect, useCallback } from "react";
import { CameraIcon, User, Ticket, Calendar } from "lucide-react";

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
        avatar: "/default-avatar.png",
        avatarPublicId: "",
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");

    // --- Fetch profile ---
    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Vui lòng đăng nhập để xem profile!");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/customer/profile", {
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                },
            });
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
                }
                const errData = await res.json();
                throw new Error(errData.message || `Lỗi ${res.status}`);
            }
            const data = await res.json();
            console.log("Raw profile data from GET:", data);

            // Map data từ API (lowercase sex) sang state
            const sexLower = (data.sex || "").toLowerCase();
            setUser({
                name: data.name || data.username || "",
                email: data.email || "",
                phoneCode: data.phone_number?.includes("-") ? data.phone_number.split("-")[0] : "+84",
                phoneNumber: data.phone_number?.includes("-") ? data.phone_number.split("-")[1] : (data.phone_number || ""),
                birthDate: data.birth_date ? new Date(data.birth_date).toISOString().split("T")[0] : "",
                gender: sexLower === "male" ? "nam" : sexLower === "female" ? "nu" : "khac",
                address: data.address || "",
                information: data.information || "",
                avatar: data.avatar || "/default-avatar.png",
                avatarPublicId: data.avatar_public_id || "",
            });
        } catch (err) {
            setError(err.message);
            console.error("Profile load error:", err);
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
    const handleSubmit = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Vui lòng đăng nhập!");
            return;
        }

        if (!user.name) {
            setError("Vui lòng điền đầy đủ họ tên và email!");
            return;
        }

        setUpdating(true);
        setError("");

        try {
            // Build body theo format API
            const body = {
                name: user.name,
                phone_number: user.phoneNumber ? `${user.phoneCode}-${user.phoneNumber}` : undefined,
                sex: user.gender === "nam" ? "Male" : user.gender === "nu" ? "Female" : "Other",
                address: user.address || undefined,
                birth_date: user.birthDate ? new Date(user.birthDate).toISOString() : undefined,
                information: user.information || undefined,
                avatar: user.avatar !== "/default-avatar.png" ? user.avatar : undefined,
                avatar_public_id: user.avatarPublicId || undefined
            };

            // Remove undefined fields
            Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);

            console.log("Sending PATCH body:", body);

            const res = await fetch("/api/customer/profile", {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json", 
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errorText = await res.text();
                let errorData = {};
                try {
                    errorData = errorText ? JSON.parse(errorText) : {};
                } catch (e) {
                    console.error("Error parsing response:", e);
                }
                throw new Error(errorData.message || `Cập nhật thất bại ${res.status}`);
            }

            const data = await res.json();
            console.log("Updated profile from PATCH:", data);

            // Refresh profile để đồng bộ dữ liệu
            await fetchProfile();

            alert("Cập nhật thành công!");
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdating(false);
        }
    }, [user, fetchProfile]);

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

        // TODO: Upload to Cloudinary hoặc backend
        console.log("Avatar preview set – upload cần được implement");
    }, []);

    const category = [
        { label: "Thông tin tài khoản", active: true, icon: User },
        { label: "Vé của tôi", active: false, icon: Ticket },
        { label: "Sự kiện của tôi", active: false, icon: Calendar },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
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
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                    </div>

                    <span className="font-bold text-secondary text-[15px]">
                        {user.name || "Tên người dùng"}
                    </span>

                    <nav className="w-full flex flex-col gap-4">
                        {category.map((item, index) => (
                            <button
                                key={index}
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                                    item.active ? "bg-white/50" : "hover:bg-white/30"
                                }`}
                            >
                                <item.icon className="w-[25px] h-[25px] text-primary" />
                                <span
                                    className={`text-sm ${
                                        item.active ? "font-extrabold" : "font-semibold"
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
                            <div className="flex flex-col gap-2">
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

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6"
                                    required
                                />
                            </div>

                            {/* Ngày sinh */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Ngày sinh</label>
                                <input
                                    type="date"
                                    value={user.birthDate}
                                    onChange={(e) => handleChange("birthDate", e.target.value)}
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6"
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
                                        <div key={g.value} className="flex items-center gap-5">
                                            <input
                                                type="radio"
                                                id={g.value}
                                                name="gender"
                                                value={g.value}
                                                checked={user.gender === g.value}
                                                onChange={(e) => handleChange("gender", e.target.value)}
                                            />
                                            <label htmlFor={g.value} className="font-bold text-base cursor-pointer">
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
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6"
                                />
                            </div>

                            {/* Thông tin thêm */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">Thông tin thêm</label>
                                <textarea
                                    value={user.information}
                                    onChange={(e) => handleChange("information", e.target.value)}
                                    className="h-[100px] bg-white rounded-[5px] font-bold text-secondary text-base px-6 py-3 resize-none"
                                    placeholder="Giới thiệu bản thân..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={updating}
                                className="h-[60px] bg-primary rounded-[5px] font-extrabold text-white text-xl mt-4 hover:opacity-90 disabled:opacity-50"
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