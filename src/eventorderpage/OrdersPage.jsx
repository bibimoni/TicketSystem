import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockOrderData } from '../context/mockOrderData.js'; 
import * as XLSX from 'xlsx';

const maskPhone = (phone) => {
  if (!phone) return '';
  return phone.substring(0, 2) + '********';
};
const maskEmail = (email) => {
  if (!email) return '';
  const [user, domain] = email.split('@');
  return user.charAt(0) + '********' + '@' + domain;
};
const formatCurrency = (amount) => {
  if (amount == null) return 'N/A';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const hours = date.getUTCHours();
  const ampm = hours >= 12 ? 'pm' : 'am';
  const displayHours = hours % 12 || 12;
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${displayHours}${ampm} ${day}/${month}/${year}`;
};

export const OrdersPage = () => {
  const { eventId } = useParams(); // Lấy ID để biết đang xem đơn hàng của sự kiện nào
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Trong tương lai, bạn sẽ gọi API: fetch(`/api/events/${eventId}/orders`)
    // Hiện tại, chúng ta dùng data mẫu
    setOrders(mockOrderData);
  }, [eventId]);

const handleExport = () => {
    // 2a. Định dạng lại dữ liệu cho file Excel
    // Chúng ta sẽ dùng dữ liệu GỐC (chưa bị che) để xuất
    const dataToExport = orders.map((order, index) => ({
      'No.': index + 1,
      'Mã đơn hàng': order.orderId,
      'Họ và tên': order.customerName,
      'Sđt': order.phone, // <-- Xuất SĐT đầy đủ
      'Email': order.email, // <-- Xuất Email đầy đủ
      'Hình thức giao dịch': order.paymentMethod,
      'Vị trí': order.seat,
      'Giá vé': order.ticketPrice, // <-- Xuất dạng SỐ
      'Loại vé': order.ticketType,
      'Mã giảm giá': order.discountCode || 'N/A',
      'Tổng số tiền': order.totalAmount, // <-- Xuất dạng SỐ
      'Thời gian mua vé': formatDate(order.purchaseDate),
      'Check in': order.checkIn ? 'Đã check-in' : 'Chưa',
    }));

    // 2b. Tạo worksheet (trang tính) từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(dataToExport);

    // (Tùy chọn) Điều chỉnh độ rộng cột
    const colWidths = [
      { wch: 5 },  // No.
      { wch: 15 }, // Mã đơn hàng
      { wch: 25 }, // Họ và tên
      { wch: 15 }, // Sđt
      { wch: 30 }, // Email
      { wch: 20 }, // Hình thức
      { wch: 10 }, // Vị trí
      { wch: 15 }, // Giá vé
      { wch: 15 }, // Loại vé
      { wch: 15 }, // Mã giảm giá
      { wch: 15 }, // Tổng số tiền
      { wch: 20 }, // Thời gian mua
      { wch: 10 }, // Check in
    ];
    ws['!cols'] = colWidths;

    // 2c. Tạo workbook (sổ tay) và thêm trang tính vào
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachDonHang'); // Tên của sheet

    // 2d. Xuất file
    XLSX.writeFile(wb, 'BaoCaoDonHang.xlsx'); // Tên của file Excel
  };

  return (
    // Cái div này sẽ nằm gọn bên trong <Outlet /> của EventDetailLayout
    <div className="w-[1100px] bg-white shadow-md rounded-lg p-6 relative left-[-40px]">
      
      {/* Tiêu đề */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-red-500">
          Danh sách đơn hàng
        </h2>
        <div className="flex gap-4 flex-shrink-0">
          <button 
          onClick={handleExport}
          className="border border-red-500 bg-white text-red-500 px-6 py-2 rounded-full font-semibold hover:bg-red-50 transition-colors">
            Xuất báo cáo
          </button>
          <button className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition-colors border-none">
            Gửi mail
          </button>
        </div>
      </div>

      {/* === BẢNG DỮ LIỆU ĐƠN HÀNG === */}
      <div className="overflow-x-auto">
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
            {orders.map((order, index) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-3 px-3">{index + 1}</td>
                <td className="py-3 px-3">{order.orderId}</td>
                <td className="py-3 px-3">{order.customerName}</td>
                <td className="py-3 px-3">{maskPhone(order.phone)}</td>
                <td className="py-3 px-3">{maskEmail(order.email)}</td>
                <td className="py-3 px-3">{order.paymentMethod}</td>
                <td className="py-3 px-3">{order.seat}</td>
                <td className="py-3 px-3">{formatCurrency(order.ticketPrice)}</td>
                <td className="py-3 px-3">{order.ticketType}</td>
                <td className="py-3 px-3">{order.discountCode || 'N/A'}</td>
                <td className="py-3 px-3 font-semibold text-red-500">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="py-3 px-3">{formatDate(order.purchaseDate)}</td>
                <td className="py-3 px-3 text-center text-green-600">
                  {order.checkIn ? '✔️' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;