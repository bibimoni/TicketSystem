import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; 

// --- CẤU HÌNH API ---
const API_BASE_URL = process.env.BACKEND_URL;

// --- HELPER FUNCTIONS ---
const maskPhone = (phone) => {
  if (!phone) return '...';
  if (phone.length < 5) return phone;
  return phone.substring(0, 2) + '********';
};

const maskEmail = (email) => {
  if (!email) return '...';
  const parts = email.split('@');
  if (parts.length < 2) return email;
  return parts[0].charAt(0) + '********@' + parts[1];
};

const formatCurrency = (amount) => {
  if (amount == null) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '...';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '...';
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
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

      try {
        // 1. Gọi API lấy toàn bộ vé
        const response = await axios.get(`${API_BASE_URL}/ticket/all-tickets`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const allTickets = Array.isArray(response.data) ? response.data : (response.data.data || []);

        // --- LOGIC GOM NHÓM (GROUPING) ---
        const groupedMap = {};

        allTickets.forEach(ticket => {
          // Chỉ xử lý vé ĐÃ BÁN (SOLD)
          if (ticket.status !== 'SOLD') return;

          // Truy xuất thông tin
          const tType = ticket.ticket_type || {};

          // Kiểm tra vé có thuộc sự kiện này không
          const isCorrectEvent = String(tType.event_id) === String(eventId) || String(tType.eventId) === String(eventId);
          if (!isCorrectEvent) return;

          // Lấy thông tin giao dịch & khách hàng từ vé
          const transInfo = ticket.transactionHasTicket || {};
          const transaction = transInfo.transaction || {};
          const customer = transaction.customer || {};
          const user = customer.user || {};

          // Tạo KEY để gom nhóm: Cùng 1 Mã GD và Cùng 1 Loại Vé thì gộp chung
          const transId = transaction.id || 'NoTransID';
          const typeId = tType.id || 'NoTypeID';
          const groupKey = `${transId}_${typeId}`;

          // Nếu nhóm này chưa tồn tại, tạo mới
          if (!groupedMap[groupKey]) {
            groupedMap[groupKey] = {
              id: groupKey, // Key React

              // Thông tin hiển thị
              displayCode: transId !== 'NoTransID' ? transId.substring(0, 8).toUpperCase() : 'N/A', // Mã đơn
              customerName: user.name || "N/A",
              phone: user.phone_number || "",
              email: user.email || "",

              paymentMethod: transaction.method || "N/A",
              purchaseDate: transaction.time_date || ticket.updated_at,

              ticketType: tType.name || "Vé thường",
              unitPrice: Number(tType.price) || 0, // Đơn giá

              // Các biến cộng dồn
              quantity: 0,
              totalAmount: 0
            };
          }

          // --- CỘNG DỒN SỐ LIỆU ---
          groupedMap[groupKey].quantity += 1; // Tăng số lượng vé lên 1
          groupedMap[groupKey].totalAmount += (Number(tType.price) || 0); // Cộng dồn thành tiền
        });

        // Chuyển Object thành Mảng để hiển thị
        const finalData = Object.values(groupedMap);

        // Sắp xếp ngày mới nhất lên đầu
        setOrders(finalData.sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate)));

      } catch (error) {
        console.error("Lỗi tải danh sách vé Admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminOrders();
  }, [eventId, token]);

  // --- Export Excel ---
  const handleExport = () => {
    if (orders.length === 0) return alert("Không có dữ liệu!");

    const dataToExport = orders.map((o, i) => ({
      'No.': i + 1,
      'Mã Đơn': o.displayCode,
      'Khách hàng': o.customerName,
      'SĐT': o.phone,
      'Email': o.email,
      'Loại vé': o.ticketType,
      'Số lượng': o.quantity,
      'Đơn giá': o.unitPrice,
      'Thành tiền': o.totalAmount,
      'Ngày mua': formatDate(o.purchaseDate),
      'Thanh toán': o.paymentMethod
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    // Chỉnh độ rộng cột
    ws['!cols'] = [{ wch: 5 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachDonHang');
    XLSX.writeFile(wb, `DonHangAdmin_${eventId}.xlsx`);
  };

  return (
    <div className="w-[1100px] bg-white shadow-md rounded-lg p-6 relative left-[-40px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-red-500">
          Danh sách đơn hàng
        </h2>
        <div className="text-sm text-gray-500">
          Tổng số đơn: <span className="font-bold text-black">{orders.length}</span>
        </div>
        <button onClick={handleExport} disabled={loading || orders.length === 0}
          className="border border-red-500 text-red-500 px-6 py-2 rounded-full font-semibold hover:bg-red-50 disabled:opacity-50 transition-colors">
          Xuất Excel
        </button>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr className="text-left text-gray-600 font-semibold">
              <th className="py-3 px-2 w-10">No.</th>
              <th className="py-3 px-2 w-24">Mã Đơn</th>
              <th className="py-3 px-2 w-32">Khách hàng</th>
              <th className="py-3 px-2 w-24">SĐT</th>
              <th className="py-3 px-2 w-40">Email</th>
              <th className="py-3 px-2 w-24">Loại vé</th>

              {/* CỘT SỐ LƯỢNG */}
              <th className="py-3 px-2 w-16 text-center">SL</th>

              <th className="py-3 px-2 w-24 text-right">Đơn giá</th>
              <th className="py-3 px-2 w-28 text-right">Thành tiền</th>
              <th className="py-3 px-2 w-32 text-right">Ngày mua</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="10" className="text-center py-10 font-bold text-blue-500">Đang xử lý dữ liệu...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="10" className="text-center py-10 text-gray-500">Chưa có đơn hàng nào (đã thanh toán).</td></tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2">{index + 1}</td>
                  <td className="py-3 px-2 font-mono text-xs font-bold text-gray-700" title={order.id}>
                    {order.displayCode}
                  </td>
                  <td className="py-3 px-2 font-medium text-gray-800 truncate" title={order.customerName}>
                    {order.customerName}
                  </td>
                  <td className="py-3 px-2 text-gray-600 text-xs">{maskPhone(order.phone)}</td>
                  <td className="py-3 px-2 text-xs truncate" title={order.email}>
                    {maskEmail(order.email)}
                  </td>
                  <td className="py-3 px-2">{order.ticketType}</td>

                  {/* HIỂN THỊ SỐ LƯỢNG ĐÃ TÍNH TOÁN */}
                  <td className="py-3 px-2 text-center font-bold bg-gray-50 text-gray-800">
                    {order.quantity}
                  </td>

                  <td className="py-3 px-2 text-right text-gray-600">
                    {formatCurrency(order.unitPrice)}
                  </td>

                  {/* HIỂN THỊ TỔNG TIỀN ĐÃ TÍNH TOÁN */}
                  <td className="py-3 px-2 text-right font-semibold text-red-500">
                    {formatCurrency(order.totalAmount)}
                  </td>

                  <td className="py-3 px-2 text-right text-xs text-gray-500">
                    {formatDate(order.purchaseDate)}
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
