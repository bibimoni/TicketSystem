import React, { useState, useEffect } from 'react';
import { BsFileEarmarkText } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from 'axios'; 

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { eventId } = useParams();
  const token = localStorage.getItem("token");

  // --- HÀM GỌI API LẤY DANH SÁCH VOUCHER (LOGIC MỚI) ---
  const fetchVouchers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Gọi API lấy danh sách sự kiện của Customer 
      const response = await axios.get(`${API_BASE_URL}/event/customer_events`, {
         headers: { 'Authorization': `Bearer ${token}` }
      });

      // Tìm sự kiện hiện tại trong danh sách trả về
      const allEvents = Array.isArray(response.data) ? response.data : (response.data.data || []);
      const currentEvent = allEvents.find(e => e.id === eventId || e._id === eventId);

      if (currentEvent && currentEvent.vouchers) {
          // Lấy mảng vouchers từ trong object sự kiện 
          console.log("Vouchers tìm thấy:", currentEvent.vouchers);
          setVouchers(currentEvent.vouchers);
      } else {
          setVouchers([]);
      }

    } catch (error) {
      console.error("Lỗi tải voucher:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [eventId, token]);

  const handleCreateVoucher = () => {
    navigate(`/event/${eventId}/voucher/new`);
  };

  // Hàm helper format
  const formatDiscount = (voucher) => {
    // [cite: 189, 190] Swagger dùng reduce_type và reduce_price
    const type = voucher.reduce_type; 
    const value = voucher.reduce_price;

    if (type === 'FIXED') {
      return `${Number(value).toLocaleString('vi-VN')} ₫`;
    }
    if (type === 'PERCENTAGE') {
      return `${value}%`;
    }
    return value || '0 ₫'; 
  };

  const formatDuration = (voucher) => {
    // [cite: 192, 193] Swagger dùng start_date, end_date
    const startVal = voucher.start_date;
    const endVal = voucher.end_date;

    const formatDate = (dateString) => {
        if (!dateString) return '...';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '...';
        return date.toLocaleDateString('vi-VN');
    };

    return `${formatDate(startVal)} - ${formatDate(endVal)}`;
  }

  // --- XỬ LÝ XÓA (GỌI API POST /voucher/delete) ---
  const handleDelete = async (voucherId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa voucher này không?")) {
      try {
        //  API Xóa là POST /voucher/delete
        // API này thường yêu cầu body chứa id.
        await axios.post(`${API_BASE_URL}/voucher/delete`, 
            { id: voucherId }, 
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        alert("Đã xóa voucher thành công!");
        fetchVouchers(); 

      } catch (error) {
        console.error("Lỗi xóa voucher:", error);
        alert("Có lỗi xảy ra khi xóa. Vui lòng thử lại.");
      }
    }
  };

  // Lưu ý: Swagger không có API "Toggle Status" (Active/Inactive) riêng biệt.
  // Trạng thái thường dựa vào ngày hết hạn (end_date). 
  // Nếu muốn tắt, bạn có thể xóa hoặc sửa ngày kết thúc về quá khứ.
  
  return (
    <div className="w-[1050px] -mt-[60px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Danh sách Voucher</h2>
        <button 
          onClick={handleCreateVoucher}
          className="bg-[#F9614A] text-white px-5 py-2 rounded-md font-semibold text-sm hover:bg-opacity-90 shadow-sm border-none"
        >
          Tạo voucher
        </button>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead className="bg-[#F47B66] text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Tên / Mã</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Mức giảm</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Thời gian</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Hành động</th>
            </tr>
          </thead>

          <tbody className="bg-[#FEF5F3]">
            {loading ? (
                <tr><td colSpan="5" className="text-center py-10 text-gray-500">Đang tải danh sách voucher...</td></tr>
            ) : vouchers.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-24">
                  <div className="flex flex-col items-center text-gray-400">
                    <BsFileEarmarkText size={48} />
                    <span className="mt-4 text-sm font-medium">Chưa có voucher nào cho sự kiện này</span>
                  </div>
                </td>
              </tr>
            ) : (
              vouchers.map((voucher) => {
                const vId = voucher._id || voucher.id;
                return (
                <tr key={vId} className="border-b border-red-100 last:border-b-0 hover:bg-red-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <div className="font-bold">{voucher.code}</div>
                    <div className="text-xs text-gray-500">{voucher.name}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">{formatDiscount(voucher)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDuration(voucher)}</td>
                  
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button 
                      className="p-2 bg-white rounded-md hover:bg-gray-300 shadow-sm border border-gray-200"
                      onClick={() => navigate(`/event/${eventId}/voucher/edit/${vId}`)}
                    >
                       <FaEdit className="text-gray-600"/>
                    </button>
                    <button 
                        className="p-2 bg-[#F94F2F] rounded-md hover:bg-red-600 border-none shadow-sm"
                        onClick={() => handleDelete(vId)}
                    >
                      <FaTrash className="text-white w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VoucherPage;