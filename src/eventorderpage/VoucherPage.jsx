// eventorderpage/VoucherPage.jsx

import React, { useState, useEffect } from 'react'; // 1. Thêm useEffect
import { BsFileEarmarkText } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const navigate = useNavigate();
  const { eventId } = useParams();

  // 2. Thêm useEffect để tải voucher từ localStorage khi component được tải
  useEffect(() => {
    const storageKey = `eventVouchers_${eventId}`;
    const storedVouchers = JSON.parse(localStorage.getItem(storageKey)) || [];
    setVouchers(storedVouchers);
  }, [eventId]); // Sẽ chạy lại nếu eventId thay đổi

  const handleCreateVoucher = () => {
    navigate(`/event/${eventId}/voucher/new`);
  };

  // Hàm helper để format mức giảm
  const formatDiscount = (voucher) => {
    if (voucher.loaiKhuyenMai === 'so-tien') {
      return `${Number(voucher.mucGiam).toLocaleString('vi-VN')} ₫`;
    }
    if (voucher.loaiKhuyenMai === 'phan-tram') {
      return `${voucher.mucGiam}%`;
    }
    return voucher.mucGiam;
  };

  // Hàm helper để format thời gian
  const formatDuration = (voucher) => {
    return `${voucher.startDate} - ${voucher.endDate}`;
  }

  const handleDelete = (voucherId) => {
    // 1. Hỏi xác nhận
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này không?")) {
      
      // 2. Lấy key và voucher hiện tại
      const storageKey = `eventVouchers_${eventId}`;
      const existingVouchers = JSON.parse(localStorage.getItem(storageKey)) || [];

      // 3. Tạo mảng mới, loại bỏ voucher có id trùng
      const updatedVouchers = existingVouchers.filter(v => v.id !== voucherId);

      // 4. Lưu mảng mới lại vào localStorage
      localStorage.setItem(storageKey, JSON.stringify(updatedVouchers));

      // 5. Cập nhật state để UI tự động render lại
      setVouchers(updatedVouchers);
    }
  };

  const handleToggleStatus = (voucherId, currentStatus) => {
    // 1. Xác định trạng thái mới
    const newStatus = currentStatus === 'Đang hoạt động' ? 'Đã tắt' : 'Đang hoạt động';
    
    // 2. Lấy key và voucher hiện tại
    const storageKey = `eventVouchers_${eventId}`;
    const existingVouchers = JSON.parse(localStorage.getItem(storageKey)) || [];

    // 3. Tạo mảng mới với voucher đã được cập nhật status
    const updatedVouchers = existingVouchers.map(v => 
      v.id === voucherId ? { ...v, status: newStatus } : v
    );

    // 4. Lưu mảng mới lại vào localStorage
    localStorage.setItem(storageKey, JSON.stringify(updatedVouchers));

    // 5. Cập nhật state để UI tự động render lại
    setVouchers(updatedVouchers);
  };

  return (
    <div className="w-[1050px] -mt-[60px]">
      {/* Hàng trên: Tìm kiếm và Nút Tạo */}
      <div className="flex justify-between items-center mb-6">
        {/* Thanh tìm kiếm */}
        <div className="flex items-center bg-white border border-[#F8AE99] rounded-lg shadow-sm">
          <input 
            type="text" 
            placeholder="Tìm kiếm sự kiện"
            className="px-4 py-2 text-sm rounded-l-lg border-none focus:outline-none flex-1 "
          />
          <button className="bg-white text-gray-600 px-4 py-2 text-sm rounded-r-lg hover:bg-gray-50 border-none border-l border-[#F8AE99]">
            Tìm kiếm
          </button>
        </div>

        {/* Nút Tạo Voucher */}
        <button 
          onClick={handleCreateVoucher}
          className="bg-[#F9614A] text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-opacity-90 shadow-sm border-none"
        >
          Tạo voucher
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <table className="w-full">
          {/* Tiêu đề bảng */}
          <thead className="bg-[#F47B66] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tên chương trình khuyến mãi</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Mã voucher</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Mức giảm</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Thời gian áp dụng</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái hoạt động</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>

          {/* Thân bảng */}
          <tbody className="bg-[#FEF5F3]">
            {vouchers.length === 0 ? (
              // Trường hợp không có dữ liệu
              <tr>
                <td colSpan="6" className="text-center py-24">
                  <div className="flex flex-col items-center text-gray-400">
                    <BsFileEarmarkText size={48} />
                    <span className="mt-4 text-sm font-medium">No data</span>
                  </div>
                </td>
              </tr>
            ) : (
              // 3. Khi có dữ liệu, lặp qua và hiển thị
              vouchers.map((voucher) => (
                <tr key={voucher.id} className="border-b border-red-100 last:border-b-0">
                  <td className="px-4 py-3 text-sm text-gray-700">{voucher.tenChuongTrinh}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{voucher.maVoucher}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDiscount(voucher)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDuration(voucher)}</td>
                  <td className="px-4 py-3 text-sm">
                  <td className="px-4 py-3 text-sm">
                  {/* Toggle switch React thuần */}
                  <div
                    onClick={() => handleToggleStatus(voucher.id, voucher.status)}
                    style={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                      width: '44px', // tương đương w-11
                      height: '24px', // tương đương h-6
                      left: '30px',
                      backgroundColor:
                        voucher.status === 'Đang hoạt động' ? '#4ade80' : '#d1d5db', // xanh lá / xám
                      borderRadius: '9999px',
                      transition: 'background-color 300ms ease-in-out',
                    }}
                  >
                    {/* Cục tròn */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '1.6px',
                        left: '2px',
                        width: '18px', // tương đương w-5
                        height: '19px', // tương đương h-5
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '50%',
                        transition: 'transform 300ms ease-in-out',
                        transform:
                          voucher.status === 'Đang hoạt động'
                            ? 'translateX(20px)' // sang phải
                            : 'translateX(0)',   // vị trí gốc
                      }}
                    />
                  </div>
                </td>

                </td>


                  <td className="px-4 py-3 text-sm ">
                    <button 
                      className="p-2 bg-white rounded-md hover:bg-gray-300"
                      onClick={() => navigate(`/event/${eventId}/voucher/edit/${voucher.id}`)} // <-- CẬP NHẬT DÒNG NÀY
                    >
                       <FaEdit />
                    </button>
                    <button 
                    className="p-2 bg-[#F94F2F] rounded-md hover:bg-red-600 border-none ml-[10px]"
                      onClick={() => handleDelete(voucher.id)} // Thêm onClick
                    >
                      <FaTrash className="text-white w-4 h-4" />
                    </button>
                    
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

export default VoucherPage;