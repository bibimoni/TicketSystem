import React, { useState } from "react";
import { CameraIcon, User, Ticket, Calendar } from "lucide-react";
import userData from "../database/User";

function Profile() {
    const [user, setUser] = useState(userData);

    const handleChange = (field, value) => {
        setUser({ ...user, [field]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Cập nhật user:", user);
        alert("Cập nhật thành công!");
    };

    const category = [
        { label: "Thông tin tài khoản", active: true, icon: User },
        { label: "Vé của tôi", active: false, icon: Ticket },
        { label: "Sự kiện của tôi", active: false, icon: Calendar },
    ];

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setUser((prev) => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <main className="flex px-10 py-8 gap-8">
                {/* Sidebar */}
                <aside className="w-[300px] flex flex-col items-center gap-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img src={user.avatar} alt="avatar" className="w-full h-full" />
                    </div>

                    <span className="font-bold text-secondary text-[15px]">
                        {user.name}
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
                            {/* Họ tên */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">
                                    Họ và tên
                                </label>
                                <input
                                    value={user.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    className="h-[50px] bg-white rounded-[5px] font-bold text-secondary text-base px-6"
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">
                                    Số điện thoại
                                </label>
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
                                />
                            </div>

                            {/* Ngày sinh */}
                            <div className="flex flex-col gap-2">
                                <label className="font-bold text-black text-base">
                                    Ngày sinh
                                </label>
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
                                                onChange={(e) =>
                                                    handleChange("gender", e.target.value)
                                                }
                                            />
                                            <label
                                                htmlFor={g.value}
                                                className="font-bold text-base cursor-pointer"
                                            >
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

                            {/* Submit */}
                            <button
                                type="submit"
                                className="h-[60px] bg-primary rounded-[5px] font-extrabold text-white text-xl mt-4 hover:opacity-90"
                            >
                                Cập nhật
                            </button>
                        </form>

                        {/* AVATAR */}
                        <div className="flex flex-col items-center mx-8">
                            <div className="relative w-[200px] h-[200px] rounded-full">
                                <img
                                    src={user.avatar}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />

                                {/* Nút camera */}
                                <button
                                    onClick={() => document.getElementById("avatarInput").click()}
                                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center"
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
