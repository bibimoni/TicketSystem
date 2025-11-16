import { X } from "lucide-react";
import logo from "../assets/images/logo.png";
import illu from "../assets/images/illu.png";
import logogg from "../assets/images/gglogo.png";

export default function RegisterModal({ isOpen, onClose }) {
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
                        <div className="max-w-sm mx-auto">
                            <h2 className="font-playwrite text-xl mb-2 mt-4">
                                Xin chào,
                            </h2>
                            <p className="text-xl text-gray-900 mb-6 font-extrabold">
                                Đăng ký tài khoản
                            </p>

                            <form className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:border-primary outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:border-primary outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:border-primary outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Nhập lại mật khẩu"
                                    className="w-full h-[40px] px-4 border border-gray-300 rounded-lg focus:border-primary outline-none"
                                />

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-red-600 text-white font-semibold py-3 rounded-lg"
                                >
                                    Tạo tài khoản
                                </button>
                            </form>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="bg-white px-4 text-gray-500">
                                        HOẶC
                                    </span>
                                </div>
                            </div>

                            <button className="w-full h-[40px] border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:border-gray-400">
                                <img src={logogg} alt="Google" className="w-5 h-5" />
                                <span className="font-medium">Google</span>
                            </button>

                            <p className="text-center mt-5 text-gray-600">
                                Bạn đã có tài khoản? <br />
                                <button
                                    type="button"
                                    onClick={() => {
                                        
                                    }}
                                    className="text-primary font-bold hover:underline"
                                >
                                    Đăng nhập
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
