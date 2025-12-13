import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

// --- HELPER FUNCTIONS ---
const maskPhone = (phone) => phone && phone.length >= 5 ? phone.substring(0, 2) + '********' : '...';
const maskEmail = (email) => {
    if (!email) return '...';
    const parts = email.split('@');
    return parts.length > 1 ? parts[0].charAt(0) + '********@' + parts[1] : email;
};
const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
const formatDate = (dateString) => {
    if (!dateString) return '...';
    const date = new Date(dateString);
    return isNaN(date) ? '...' : `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

export const OrdersPageAdmin = () => {
  const { eventId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAdminOrders = async () => {
      if (!token) return;
      
      setLoading(true);
      console.log("🚀 FORCED ADMIN MODE: Fetching all tickets...");

      try {
        const response = await axios.get(`${API_BASE_URL}/ticket/all-tickets`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("📦 Raw Data from Admin API:", response.data);

        // Xử lý dữ liệu trả về (Mảng Tickets)
        const allTickets = Array.isArray(response.data) ? response.data : (response.data.data || []);
        
        // 1. Lọc vé thuộc Event hiện tại
        const filteredTickets = allTickets.filter(ticket => {
            const tType = ticket.ticket_type || {};
            // Swagger Page 5[cite: 186]: check event_id
            // So sánh ID (chuyển về string để tránh lỗi type)
            return String(tType.event_id) === String(eventId) || String(tType.eventId) === String(eventId);
        });

        console.log(`🔍 Found ${filteredTickets.length} tickets for Event ID: ${eventId}`);

        // 2. Map dữ liệu để hiển thị
        const formattedData = filteredTickets.map(ticket => {
            // Truy xuất ngược: Ticket -> Transaction -> Customer -> User
            // Swagger Page 5[cite: 194]: ticket có transactionHasTicket
            const transObj = ticket.transactionHasTicket?.transaction || {};
            const customerObj = transObj.customer || {};
            const userObj = customerObj.user || {};
            const tType = ticket.ticket_type || {};

            return {
                id: ticket.id,
                // Ưu tiên Mã vé (Code), nếu ko có thì lấy Mã đơn (Trans ID)
                orderId: ticket.code || transObj.id?.substring(0, 8).toUpperCase() || 'N/A', 
                
                // Customer Info
                customerName: userObj.name || "N/A",
                phone: userObj.phone_number || "",
                email: userObj.email || "",
                
                // Transaction Info
                paymentMethod: transObj.method || "Online",
                purchaseDate: ticket.created_at || transObj.created_at, // [cite: 172]
                
                // Ticket Info
                ticketType: tType.name || "Vé thường", // [cite: 181]
                ticketPrice: tType.price || 0, // [cite: 184]
                seat: tType.benefit_info || "Tự do", // [cite: 185]
                
                // Status
                status: (ticket.status === 'USED' || ticket.status === 'CHECKED_IN') ? 'USED' : 'UNUSED' // [cite: 174]
            };
        });

        // Sắp xếp mới nhất lên đầu
        setOrders(formattedData.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)));

      } catch (error) {
        console.error("❌ Admin API Error:", error);
        if (error.response?.status === 403) {
            alert("Lỗi 403: Tài khoản này không có quyền Admin để gọi /ticket/all-tickets");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOrders();
  }, [eventId, token]);

  // --- Export Excel ---
  const handleExport = () => {
    if(orders.length === 0) return alert("Không có dữ liệu!");
    const data = orders.map((o, i) => ({
        'No.': i + 1, 'Mã Vé': o.orderId, 'Khách hàng': o.customerName, 
        'SĐT': o.phone, 'Email': o.email, 'Loại vé': o.ticketType, 
        'Giá': o.ticketPrice, 'Ngày mua': formatDate(o.purchaseDate), 'Trạng thái': o.status
    }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'AdminData');
    XLSX.writeFile(wb, `Admin_Report_${eventId}.xlsx`);
  };

  return (
    <div className="w-[1100px] bg-white shadow-md rounded-lg p-6 relative left-[-40px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-red-500">
          Danh sách đơn hàng (Admin View)
        </h2>
        <button onClick={handleExport} disabled={loading || orders.length === 0}
            className="border border-red-500 text-red-500 px-6 py-2 rounded-full font-semibold hover:bg-red-50 disabled:opacity-50">
            Xuất Excel
        </button>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr className="text-left text-gray-600 font-semibold">
              <th className="py-3 px-3 w-10">No.</th>
              <th className="py-3 px-3 w-32">Mã Vé</th>
              <th className="py-3 px-3 w-40">Khách hàng</th>
              <th className="py-3 px-3 w-28">SĐT</th>
              <th className="py-3 px-3 w-48">Email</th>
              <th className="py-3 px-3 w-24">Thanh toán</th>
              <th className="py-3 px-3 w-24">Loại vé</th>
              <th className="py-3 px-3 w-24">Giá</th>
              <th className="py-3 px-3 w-32">Ngày mua</th>
              <th className="py-3 px-3 w-20 text-center">TT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
                <tr><td colSpan="10" className="text-center py-10 font-bold text-blue-500">Đang lấy dữ liệu</td></tr>
            ) : orders.length === 0 ? (
                <tr><td colSpan="10" className="text-center py-10 text-gray-500">
                    Sự kiện chưa có đơn hàng nào.
                </td></tr>
            ) : (
                orders.map((order, index) => (
                <tr key={order.id || index} className="hover:bg-gray-50">
                    <td className="py-3 px-3">{index + 1}</td>
                    <td className="py-3 px-3 font-mono text-xs font-bold" title={order.orderId}>{order.orderId}</td>
                    <td className="py-3 px-3">{order.customerName}</td>
                    <td className="py-3 px-3">{maskPhone(order.phone)}</td>
                    <td className="py-3 px-3 text-xs break-words">{maskEmail(order.email)}</td>
                    <td className="py-3 px-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{order.paymentMethod}</span></td>
                    <td className="py-3 px-3">{order.ticketType}</td>
                    <td className="py-3 px-3 font-semibold text-red-500">{formatCurrency(order.ticketPrice)}</td>
                    <td className="py-3 px-3 text-xs">{formatDate(order.purchaseDate)}</td>
                    <td className="py-3 px-3 text-center">
                        {order.status === 'USED' ? <span className="text-green-600 font-bold">✔️</span> : <span className="text-gray-300">-</span>}
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

export default OrdersPageAdmin;