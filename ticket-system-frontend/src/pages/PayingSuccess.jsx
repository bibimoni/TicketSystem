import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';


const PaymentSuccess = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-extrabold text-primary mb-2">Thanh toán thành công!</h1>
                <p className="text-gray-600 mb-6">
                    Cảm ơn bạn đã mua vé. Vé điện tử đã được gửi vào tài khoản của bạn.
                </p>
                <div className="flex flex-col gap-3">
                    <Link to="/my-ticket" className="bg-primary text-white py-3 px-6 rounded-lg font-bold hover:bg-red-600 transition">
                        Xem vé của tôi
                    </Link>
                    <Link to="/" className="text-primary font-semibold hover:underline">
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default PaymentSuccess;