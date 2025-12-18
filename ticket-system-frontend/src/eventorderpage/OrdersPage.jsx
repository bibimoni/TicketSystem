import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; 

const API_BASE_URL = process.env.BACKEND_URL;

// --- HELPER FUNCTIONS ---
const maskPhone = (phone) => {
  if (!phone) return '...'; // JSON của bạn không có sđt, hàm này sẽ trả về ...
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
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const response = await axios.get(`${API_BASE_URL}/transaction/event_transactions`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { eventId: eventId }
        });

        // Dữ liệu trả về là mảng trực tiếp [cite: 1]
        const transactions = Array.isArray(response.data) ? response.data : (response.data.data || []);
        const groupedRows = [];

        transactions.forEach(transaction => {
          const customer = transaction.customer || {};
          const user = customer.user || {}; // JSON: user nằm trong customer [cite: 25]

          // Xử lý Voucher
          let voucherCode = 'N/A';
          if (transaction.vouchers && transaction.vouchers.length > 0) {
            // JSON: vouchers là mảng object chứa voucher con 
            voucherCode = transaction.vouchers.map(v => v.voucher?.code || 'VOUCHER').join(', ');
          }

          // --- LOGIC GỘP VÉ (GROUPING) ---
          // Mục tiêu: Gộp các vé cùng loại trong 1 đơn hàng lại
          const ticketGroups = {};
          const transactionTickets = transaction.tickets || []; // 

          transactionTickets.forEach(tItem => {
            // tItem chính là object chứa { id, amount, ticket: {...} } [cite: 14]
            const ticketObj = tItem.ticket || {};
            const ticketType = ticketObj.ticket_type || {};
            const event = ticketType.event || {};

            // 1. Kiểm tra đúng Event ID (quan trọng vì API trả về tất cả)
            const isCorrectEvent =
              String(event.id) === String(eventId) ||
              String(ticketType.eventId) === String(eventId);

            if (isCorrectEvent) {
              const typeId = ticketType.id; // Dùng ID loại vé để nhóm

              if (!ticketGroups[typeId]) {
                // Khởi tạo nhóm vé này
                ticketGroups[typeId] = {
                  id: ticketObj.id, // ID đại diện để làm key React

                  // Transaction Info
                  orderId: transaction.id ? transaction.id.substring(0, 8).toUpperCase() : 'N/A',
                  purchaseDate: transaction.time_date || transaction.created_at,
                  paymentMethod: transaction.method || "Unknown",

                  // Customer Info
                  customerName: user.name || "N/A",
                  phone: user.phone_number || "",
                  email: user.email || "",

                  // Ticket Info
                  ticketType: ticketType.name || "Vé thường",
                  ticketPrice: ticketType.price || 0,
                  seat: ticketType.benefit_info || "GA", // Lấy benefit làm thông tin chỗ ngồi [cite: 23]
                  discountCode: voucherCode,

                  // Counter
                  quantity: 0, // Sẽ cộng dồn
                  usedCount: 0
                };
              }

              // 2. CỘNG DỒN SỐ LƯỢNG (AMOUNT)
              const itemAmount = tItem.amount || 1;
              ticketGroups[typeId].quantity += itemAmount;

              // Kiểm tra check-in
              if (ticketObj.status === 'USED' || ticketObj.status === 'CHECKED_IN') {
                ticketGroups[typeId].usedCount += 1;
              }
            }
          });

          // Đẩy các nhóm vé đã gộp vào mảng hiển thị
          Object.values(ticketGroups).forEach(group => {
            groupedRows.push({
              ...group,
              // Tính tổng tiền hiển thị = Giá vé * Số lượng
              totalAmount: group.ticketPrice * group.quantity
            });
          });
        });

        // Sắp xếp đơn hàng mới nhất lên đầu
        const sortedOrders = groupedRows.sort((a, b) =>
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

  // --- Export Excel ---
  const handleExport = () => {
    if (orders.length === 0) return alert("Không có dữ liệu!");

    const dataToExport = orders.map((order, index) => ({
      'No.': index + 1,
      'Mã đơn': order.orderId,
      'Khách hàng': order.customerName,
      'Email': order.email,
      'Loại vé': order.ticketType,
      'Số lượng': order.quantity, // <--- Cột Amount bạn cần
      'Đơn giá': order.ticketPrice,
      'Thành tiền': order.totalAmount,
      'Ngày mua': formatDate(order.purchaseDate),
      'Trạng thái': `${order.usedCount}/${order.quantity} Check-in`
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, `Orders_Event_${eventId}.xlsx`);
  };

  return (
    <div className="w-[1100px] bg-white shadow-md rounded-lg p-6 relative left-[-40px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-red-500">Quản lý Đơn hàng</h2>
        <button onClick={handleExport} disabled={loading || orders.length === 0}
          className="border border-red-500 text-red-500 px-6 py-2 rounded-full font-semibold hover:bg-red-50 disabled:opacity-50">
          Xuất Excel
        </button>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr className="text-left text-gray-600 font-semibold">
              <th className="py-3 px-2 w-10">No.</th>
              <th className="py-3 px-2 w-24">Mã đơn</th>
              <th className="py-3 px-2 w-32">Khách hàng</th>
              <th className="py-3 px-2 w-48">Email</th>
              <th className="py-3 px-2 w-24">Loại vé</th>

              {/* CỘT SỐ LƯỢNG (AMOUNT) */}
              <th className="py-3 px-2 w-16 text-center">SL</th>

              <th className="py-3 px-2 w-24">Đơn giá</th>
              <th className="py-3 px-2 w-28 text-right">Thành tiền</th>
              <th className="py-3 px-2 w-32">Ngày mua</th>
              <th className="py-3 px-2 w-24 text-center">Check-in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="10" className="text-center py-10">Đang tải...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-10 text-gray-500">Chưa có đơn hàng.</td></tr>
            ) : (
              orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2 font-mono text-xs font-bold">{order.orderId}</td>
                  <td className="py-3 px-2 truncate">{order.customerName}</td>
                  <td className="py-3 px-2 text-xs truncate">{maskEmail(order.email)}</td>
                  <td className="py-3 px-2">{order.ticketType}</td>

                  {/* HIỂN THỊ SỐ LƯỢNG */}
                  <td className="py-3 px-2 text-center font-bold bg-gray-50">
                    {order.quantity}
                  </td>

                  <td className="py-3 px-2">{formatCurrency(order.ticketPrice)}</td>
                  <td className="py-3 px-2 text-right font-semibold text-red-500">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="py-3 px-2 text-xs">{formatDate(order.purchaseDate)}</td>
                  <td className="py-3 px-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${order.usedCount === order.quantity ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {order.usedCount}/{order.quantity}
                    </span>
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
