import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';


const PaymentCancel = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Thanh toán bị hủy</h1>
                <p className="text-gray-600 mb-6">
                    Bạn đã hủy giao dịch hoặc có lỗi xảy ra. Vé chưa được đặt.
                </p>
                <Link to="/" className="bg-gray-800 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-900 transition">
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
};


export default PaymentCancel;