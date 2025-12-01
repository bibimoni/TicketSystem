// src/components/Form.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = ({ eventData, selectedTickets }) => {
    const navigate = useNavigate();
    const [termsChecked, setTermsChecked] = useState(false);
    const [consentChecked, setConsentChecked] = useState(false);

    const subtotal = selectedTickets.reduce((sum, ticket) => {
        let priceNumber = ticket.amount || ticket.price; 
        if (typeof priceNumber === 'string') {
            priceNumber = Number(priceNumber.replace(/\D/g, ""));
        }
        return sum + priceNumber * ticket.quantity;
    }, 0);

    const handleContinue = () => {
        navigate(`/pay/${eventData.id}`, { 
            state: { 
                selectedTickets, 
                eventData 
            } 
        });
    }

    return (
        <main className="flex py-9 max-w-7xl mx-auto px-4 relative">
            <div className="grid grid-cols-12 w-full relative">
                {/* CỘT TRÁI - FORM ĐIỀU KHOẢN */}
                <section className="relative col-span-8 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] mr-4">
                    <div className="bg-secondary rounded-[10px] border-none shadow-md">
                        <div className="p-0">
                            <div className="bg-[#d9d9d9] rounded-t-[5px] p-6">
                                <h2 className="font-extrabold text-primary text-xl text-center mb-6">
                                    VUI LÒNG ĐIỀN THÔNG TIN
                                </h2>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex flex-col gap-2">
                                            <p className="font-bold text-secondary text-base">
                                                Bạn đã đọc và hoàn toàn đồng ý "Điều khoản và điều kiện" của chương trình?
                                            </p>

                                            <label htmlFor="terms" className="flex items-center gap-2 cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    id="terms" 
                                                    className="w-4 h-4 mt-0.5 accent-primary" 
                                                    onChange={() => setTermsChecked(!termsChecked)}  
                                                />
                                                <p className="font-semibold text-secondary text-base">
                                                    Tôi đã đọc và đồng ý / Have you read & agree
                                                </p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-b-[5px] p-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex flex-col gap-2">
                                        <p className="font-bold text-secondary text-base">
                                            Tôi đồng ý TickeZ. & BTC sử dụng thông tin đặt vé nhằm mục đích vận hành sự kiện.
                                        </p>

                                        <label htmlFor="consent" className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                id="consent" 
                                                className="w-4 h-4 mt-0.5 accent-primary"
                                                onChange={() => setConsentChecked(!consentChecked)} 
                                            />
                                            <p className="font-semibold text-secondary text-base">
                                                Có/Yes
                                            </p>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CỘT PHẢI - THÔNG TIN VÉ */}
                <aside className="relative col-span-4 animate-fade-in opacity-0 [--animation-delay:400ms]">
                    <div className="bg-white rounded-b-[5px] p-6">
                        <h2 className="font-bold text-black text-xl mb-4">Thông tin vé</h2>
                        <div className="space-y-4 mb-4">
                            {selectedTickets.map((ticket, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-secondary text-base">{ticket.name}</p>
                                        <p className="font-medium italic text-secondary text-sm">
                                            {(ticket.amount || ticket.price).toLocaleString("vi-VN")} đ
                                        </p>
                                    </div>
                                    <span className="font-bold text-primary text-lg">x{ticket.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="h-0.5 bg-secondary opacity-50 my-6" />

                        <div className="flex items-center justify-between mb-6">
                            <span className="font-bold text-black text-base">Tạm tính</span>
                            <span className="font-extrabold text-primary text-xl">
                                {subtotal.toLocaleString("vi-VN")} đ
                            </span>
                        </div>

                        <button
                            onClick={handleContinue}
                            className="w-full h-[50px] bg-primary hover:bg-red-600 rounded-[10px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!termsChecked || !consentChecked}
                        >
                            <span className="font-extrabold text-white text-xl">
                                TIẾP TỤC
                            </span>
                        </button>
                    </div>
                </aside>
            </div>
        </main>
    );
}
export default Form;