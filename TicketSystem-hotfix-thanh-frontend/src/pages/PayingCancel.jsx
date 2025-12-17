// src/pages/PayingCancel.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { XCircle, Loader2, AlertTriangle } from 'lucide-react';
import transactionService from '../services/transactionService';

const PaymentCancel = () => {
    const location = useLocation();
    const effectRan = useRef(false);
    const [status, setStatus] = useState("processing");
    const [debugInfo, setDebugInfo] = useState("");

    useEffect(() => {
        if (effectRan.current === true) return;
        effectRan.current = true;

        const handleCancel = async () => {
            const params = new URLSearchParams(location.search);
            let transactionId = params.get('transactionId');
            let ticketIdsString = params.get('ticketIds');
            let ticketTypeIds = [];

            if (!transactionId) {
                transactionId = sessionStorage.getItem("pendingTransactionId");
                const storedIds = sessionStorage.getItem("pendingTicketIds");
                if (storedIds) {
                    try { ticketTypeIds = JSON.parse(storedIds); } catch (e) {}
                }
            } else {
                ticketTypeIds = ticketIdsString ? ticketIdsString.split(',') : [];
            }
            if (!transactionId) {
                try {
                    const response = await transactionService.getMyTransactions();
                    const transactions = Array.isArray(response) ? response : (response.data || []);

                    const pendingTrans = transactions.find(t => t.status === 'PENDING');

                    if (pendingTrans) {
                        transactionId = pendingTrans.id;

                        if (pendingTrans.tickets && Array.isArray(pendingTrans.tickets)) {
                            ticketTypeIds = pendingTrans.tickets.map(t => {
                                return t.ticket_type_id || t.ticket?.ticket_type?.id || t.ticketTypeId; 
                            }).filter(id => id);
                        }
                    } else {
                        // console.log("Không tìm thấy giao dịch PENDING nào.");
                    }
                } catch (err) {
                    // console.error("Lỗi khi fetch my-transactions:", err);
                }
            }

            if (!transactionId) {
                setDebugInfo("Không tìm thấy giao dịch cần hủy.");
                setStatus("error");
                return;
            }

            try {
                
                await transactionService.cancelPending({
                    transactionId: transactionId,
                    ticketTypeIds: ticketTypeIds 
                });
                
                // console.log("Hủy thành công!");
                setStatus("done");
            } catch (error) {
                setStatus("done"); 
            } finally {
                sessionStorage.removeItem("pendingTransactionId");
                sessionStorage.removeItem("pendingTicketIds");
            }
        };

        handleCancel();
    }, [location]);

    if (status === "processing") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
                <Loader2 className="w-12 h-12 text-gray-500 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">Đang kiểm tra và hủy giao dịch...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md animate-in fade-in zoom-in duration-300">
                {status === "error" ? (
                    <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
                ) : (
                    <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
                )}
                
                <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Thanh toán bị hủy</h1>
                
                <p className="text-gray-600 mb-6">
                    Giao dịch đã được hủy bỏ và vé đã được trả lại kho.
                </p>

                {debugInfo && (
                    <div className="bg-gray-100 p-2 rounded text-xs text-red-500 text-left mb-4 break-all">
                        Note: {debugInfo}
                    </div>
                )}

                <Link to="/" className="bg-gray-800 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-900 transition">
                    Về trang chủ
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancel;