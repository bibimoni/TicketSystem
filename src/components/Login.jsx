import { X } from "lucide-react";
import logo from "../assets/images/logo.png";
import illu from "../assets/images/illu.png";
import logogg from "../assets/images/gglogo.png";

export default function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[600px] flex animate-in fade-in zoom-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* LEFT */}
                    <div className="flex-1 p-12 flex flex-col justify-center">
                        <div className="max-w-sm mx-auto w-full">
                            <h2 className="font-playwrite text-xl mb-2 mt-4">
                                Xin chào,
                            </h2>
                            <p className="text-xl text-gray-900 mb-6 font-extrabold">
                                Đăng nhập tài khoản
                            </p>

                            <form className="space-y-5">
                                <input
                                    type="text"
                                    placeholder="Số điện thoại / Email / Tên đăng nhập"
                                    className="w-full h-12 px-5 border border-gray-300 rounded-lg focus:border-primary outline-none"
                                    required
                                />

                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Mật khẩu"
                                        className="w-full h-12 px-5 pr-12 border border-gray-300 rounded-lg focus:border-primary outline-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-12 bg-primary hover:bg-red-600 text-white font-bold rounded-lg"
                                >
                                    Đăng nhập
                                </button>
                            </form>

                            <a
                                href="/"
                                className="block text-left text-primary font-semibold mt-3 text-sm hover:underline"
                            >
                                Quên mật khẩu
                            </a>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-white px-4 text-gray-500">
                                        HOẶC
                                    </span>
                                </div>
                            </div>

                            <button className="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:border-gray-400">
                                <img src={logogg} alt="Google" className="w-5 h-5" />
                                <span className="font-medium text-gray-700">
                                    Google
                                </span>
                            </button>

                            <p className="text-center mt-8 text-gray-600">
                                Bạn chưa có tài khoản? <br />
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        document.dispatchEvent(
                                            new CustomEvent("open-register")
                                        );
                                    }}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Đăng ký
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="bg-primary flex-1 relative rounded-r-3xl">
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8">
                            <img src={logo} alt="TickeZ" className="w-60 mb-2" />
                            <p className="text-xl font-bold tracking-wider mb-8">
                                vé liền tay - tickeZ. ngay
                            </p>
                            <img
                                src={illu}
                                alt="Illustration"
                                className="w-[100%] object-contain"
                            />
                        </div>

                        {/* Nút X */}
                        <button
                            onClick={onClose}
                            className="absolute -top-6 -right-6 w-[50px] h-[50px] bg-white rounded-full shadow-2xl border-4 border-white flex items-center justify-center"
                        >
                            <X size={32} className="text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
