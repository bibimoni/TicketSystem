import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

// --- CÁC HÀM HELPER GIỮ NGUYÊN ---
const maskPhone = (phone) => {
  if (!phone) return '...';
  if (phone.length < 5) return phone;
  return phone.substring(0, 2) + '********';
};

const maskEmail = (email) => {
  if (!email) return '...';
  const parts = email.split('@');
  if (parts.length < 2) return email;
  return parts[0].charAt(0) + '********' + '@' + parts[1];
};

const formatCurrency = (amount) => {
  if (amount == null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '...';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '...';
  
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

export const OrdersPage = () => {
  const { eventId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // --- HÀM GỌI API ĐÃ SỬA ---
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const response = await axios.get(`${API_BASE_URL}/transaction/event_transactions`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { eventId: eventId } 
        });
        const transactions = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        const allOrderRows = [];

        // 2. Duyệt qua từng Transaction
        transactions.forEach(transaction => {
            const customer = transaction.customer || {};
            const user = customer.user || {}; 

            // Xử lý Voucher
            let voucherCode = 'N/A';
            if (transaction.vouchers && transaction.vouchers.length > 0) {
                voucherCode = transaction.vouchers.map(v => v.code).join(', ');
            }

            // 3. Duyệt qua mảng tickets bên trong Transaction [cite: 274]
            const transactionTickets = transaction.tickets || [];
            
            transactionTickets.forEach(tItem => {
                // Theo Swagger Page 7[cite: 278]: item có trường "ticket"
                const ticketObj = tItem.ticket || {};
                const ticketType = ticketObj.ticket_type || {};
                const event = ticketType.event || {};

                // 4. Lọc đúng Event hiện tại (Quan trọng)
                // Kiểm tra ID của event trong ticket_type [cite: 285]
                if (event.id === eventId || event._id === eventId || ticketType.eventId === eventId) {
                    
                    allOrderRows.push({
                        id: ticketObj.id || Math.random(), // Key unique cho Row
                        
                        // Transaction Info
                        orderId: transaction.id ? transaction.id.substring(0, 8).toUpperCase() : 'N/A',
                        purchaseDate: transaction.time_date || transaction.created_at, // [cite: 268]
                        paymentMethod: transaction.method || "Unknown", // [cite: 269]
                        totalAmount: transaction.total_price || 0, // [cite: 272]
                        discountCode: voucherCode,

                        // Customer Info
                        customerName: user.name || "Khách vãng lai",
                        phone: user.phone_number || "Không có SĐT",
                        email: user.email || "Không có Email",

                        // Ticket Info
                        // Theo Page 5[cite: 169], giá nằm trong ticketType, hoặc lấy từ transaction item
                        ticketPrice: ticketType.price || 0, 
                        ticketType: ticketType.name || "Vé thường", // [cite: 284]
                        seat: ticketObj.seat_info || "GA", // API chưa hiện rõ field ghế, để default hoặc check lại
                        
                        // Check status
                        checkIn: ticketObj.status === 'USED'
                    });
                }
            });
        });

        // Sắp xếp đơn hàng mới nhất lên đầu
        const sortedOrders = allOrderRows.sort((a, b) => 
            new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );

        setOrders(sortedOrders);

      } catch (error) {
        console.error("Lỗi tải danh sách đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [eventId, token]);

  const handleExport = () => {
    if(orders.length === 0) return alert("Không có dữ liệu để xuất!");

    const dataToExport = orders.map((order, index) => ({
      'No.': index + 1,
      'Mã đơn hàng': order.orderId,
      'Họ và tên': order.customerName,
      'Sđt': order.phone,
      'Email': order.email,
      'Hình thức giao dịch': order.paymentMethod,
      'Vị trí': order.seat,
      'Giá vé': order.ticketPrice,
      'Loại vé': order.ticketType,
      'Mã giảm giá': order.discountCode,
      'Tổng số tiền': order.totalAmount,
      'Thời gian mua vé': formatDate(order.purchaseDate),
      'Check in': order.checkIn ? 'Đã check-in' : 'Chưa',
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const colWidths = [
      { wch: 5 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 30 },
      { wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 20 }, { wch: 10 },
    ];
    ws['!cols'] = colWidths;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachDonHang');
    XLSX.writeFile(wb, `BaoCaoDonHang_${eventId}.xlsx`);
  };

  return (
    <div className="w-[1100px] bg-white shadow-md rounded-lg p-6 relative left-[-40px]">
      
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-red-500">
          Danh sách đơn hàng
        </h2>
        <div className="flex gap-4 flex-shrink-0">
          <button 
            onClick={handleExport}
            disabled={loading || orders.length === 0}
            className="border border-red-500 bg-white text-red-500 px-6 py-2 rounded-full font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* === BẢNG DỮ LIỆU ĐƠN HÀNG === */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="min-w-full left-[-10px] table-fixed text-sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr className="text-left text-gray-600 font-semibold">
              <th className="py-3 px-3 w-12">No.</th>
              <th className="py-3 px-3 w-24">Mã đơn hàng</th>
              <th className="py-3 px-3 w-40">Họ và tên</th>
              <th className="py-3 px-3 w-32">Sđt</th>
              <th className="py-3 px-3 w-48">Email</th>
              <th className="py-3 px-3 w-36">Hình thức giao dịch</th>
              <th className="py-3 px-3 w-16">Vị trí</th>
              <th className="py-3 px-3 w-32">Giá vé</th>
              <th className="py-3 px-3 w-24">Loại vé</th>
              <th className="py-3 px-3 w-32">Mã giảm giá</th>
              <th className="py-3 px-3 w-32">Tổng số tiền</th>
              <th className="py-3 px-3 w-36">Thời gian mua vé</th>
              <th className="py-3 px-3 w-20 text-center">Check in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
                <tr>
                    <td colSpan="13" className="text-center py-10 text-gray-500">Đang tải dữ liệu đơn hàng...</td>
                </tr>
            ) : orders.length === 0 ? (
                <tr>
                    <td colSpan="13" className="text-center py-10 text-gray-500">Chưa có đơn hàng nào cho sự kiện này.</td>
                </tr>
            ) : (
                orders.map((order, index) => (
                <tr key={order.id || index} className="hover:bg-gray-50">
                    <td className="py-3 px-3">{index + 1}</td>
                    <td className="py-3 px-3 font-mono text-xs" title={order.orderId}>{order.orderId}</td>
                    <td className="py-3 px-3">{order.customerName}</td>
                    <td className="py-3 px-3">{maskPhone(order.phone)}</td>
                    <td className="py-3 px-3 break-words text-xs">{maskEmail(order.email)}</td>
                    <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold 
                            ${order.paymentMethod === 'CREDIT_CARD' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                            {order.paymentMethod}
                        </span>
                    </td>
                    <td className="py-3 px-3">{order.seat}</td>
                    <td className="py-3 px-3">{formatCurrency(order.ticketPrice)}</td>
                    <td className="py-3 px-3">{order.ticketType}</td>
                    <td className="py-3 px-3 text-gray-400 italic">{order.discountCode}</td>
                    <td className="py-3 px-3 font-semibold text-red-500">
                    {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="py-3 px-3 text-xs">{formatDate(order.purchaseDate)}</td>
                    <td className="py-3 px-3 text-center text-green-600">
                    {order.checkIn ? '✔️' : <span className="text-gray-300">-</span>}
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;