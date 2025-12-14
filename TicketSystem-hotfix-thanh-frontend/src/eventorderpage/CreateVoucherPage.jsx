import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackOutline } from 'react-icons/io5';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

const CreateVoucherPage = () => {
  const navigate = useNavigate();
  const { eventId, voucherId } = useParams();
  
  // Xác định chế độ
  const isEditMode = Boolean(voucherId) && voucherId !== 'new';
  const [loading, setLoading] = useState(false);

  // --- State Form ---
  const [tenChuongTrinh, setTenChuongTrinh] = useState('');
  const [maVoucher, setMaVoucher] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [loaiKhuyenMai, setLoaiKhuyenMai] = useState('so-tien');
  const [mucGiam, setMucGiam] = useState('');
  const [ticketLimit, setTicketLimit] = useState('limited');
  const [tongSoVe, setTongSoVe] = useState('');
  
  const token = localStorage.getItem("token");

  // --- 1. TẢI DỮ LIỆU VOUCHER KHI EDIT ---
  useEffect(() => {
    const loadData = async () => {
        if (isEditMode && token) {
            try {
                // Phải lấy từ customer_events vì không có API get voucher detail public
                const response = await axios.get(`${API_BASE_URL}/event/customer_events`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const allEvents = Array.isArray(response.data) ? response.data : (response.data.events || response.data.data || []);
                const currentEvent = allEvents.find(e => e.id === eventId || e._id === eventId);
                
                if (currentEvent && currentEvent.vouchers) {
                    const voucher = currentEvent.vouchers.find(v => v.id === voucherId || v._id === voucherId || v.code === voucherId);
                    
                    if (voucher) {
                        setTenChuongTrinh(voucher.name || "");
                        setMaVoucher(voucher.code || "");
                        setStartDate(voucher.start_date ? voucher.start_date.substring(0, 10) : '');
                        setEndDate(voucher.end_date ? voucher.end_date.substring(0, 10) : '');
                        setNoiDung(voucher.description || '');
                        
                        // [cite: 189, 190] Mapping dữ liệu từ Swagger
                        setLoaiKhuyenMai(voucher.reduce_type === 'PERCENTAGE' ? 'phan-tram' : 'so-tien');
                        setMucGiam(voucher.reduce_price || '');
                        
                        // Xử lý số lượng
                        const qty = voucher.quantity;
                        if (qty >= 999999) { setTicketLimit('unlimited'); setTongSoVe(''); } 
                        else { setTicketLimit('limited'); setTongSoVe(qty || ''); }
                    }
                }
            } catch (error) {
                console.error("Lỗi tải voucher:", error);
            }
        }
    };
    loadData();
}, [isEditMode, voucherId, token, eventId]);

  const handleCancel = () => {
    navigate(`/event/${eventId}/voucher`);
  };

  // --- 2. XỬ LÝ LƯU (QUAN TRỌNG NHẤT) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (!token) {
          alert("Vui lòng đăng nhập lại!");
          return;
        }

        // [cite: 186-193] Chuẩn bị Payload ĐÚNG CHUẨN Swagger
        const voucherPayload = {
            code: maVoucher,
            reduce_type: loaiKhuyenMai === 'so-tien' ? 'FIXED' : 'PERCENTAGE',
            reduce_price: Number(mucGiam),
            
            // [cite: 191] Swagger yêu cầu field 'price', dù UI không có. Ta gửi 0 hoặc giá trị tượng trưng.
            price: 0, 
            
            // [cite: 192, 193] Ngày tháng bắt buộc ISO String
            start_date: new Date(startDate).toISOString(),
            end_date: new Date(endDate).toISOString(),

            // Các trường bổ sung (Có thể Backend sẽ lưu hoặc bỏ qua)
            name: tenChuongTrinh,
            description: noiDung,
            quantity: ticketLimit === 'unlimited' ? 999999 : Number(tongSoVe),
        };

        // Nếu là Update, thêm ID vào payload [cite: 269]
        if (isEditMode) {
            voucherPayload.id = voucherId;
        }

        console.log("📦 Payload:", voucherPayload);

        // --- CHIA ENDPOINT THEO SWAGGER ---
        let endpoint = "";
        if (isEditMode) {
            //  API Update
            endpoint = `${API_BASE_URL}/event/update-vouchers/${eventId}`;
        } else {
            //  API Create
            endpoint = `${API_BASE_URL}/event/create-vouchers/${eventId}`;
        }

        // Gọi API
        await axios.post(endpoint, voucherPayload, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        alert(isEditMode ? "✅ Cập nhật thành công!" : "✅ Tạo mới thành công!");
        navigate(`/event/${eventId}/voucher`);

    } catch (error) {
        console.error("❌ Lỗi API:", error);
        const msg = error.response?.data?.message || JSON.stringify(error.response?.data) || error.message;
        alert(`Lỗi: ${msg}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-[#FF714B] p-5 rounded-lg shadow-md w-[1050px] mt-[-10px]">
      <div 
        className="flex items-center text-white font-semibold text-lg mb-6 cursor-pointer"
        onClick={handleCancel}
      >
        <IoChevronBackOutline size={22} className="mr-2" />
        {isEditMode ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md w-[990px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* --- Phần 1: Thông tin cơ bản --- */}
          <div>
            <h3 className="font-bold text-gray-800 mb-6">Thông tin cơ bản</h3>
            <div className="space-y-5">
              
              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-2">Tên chương trình:</label>
                <div className="w-3/4">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={tenChuongTrinh}
                    onChange={(e) => setTenChuongTrinh(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-2">Mã voucher:</label>
                <div className="w-3/4">
                  <input
                    type="text"
                    placeholder="VD: GIAMGIA10K"
                    value={maVoucher}
                    onChange={(e) => setMaVoucher(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    minLength={6}
                    maxLength={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    required
                    // [cite: 269] Khi update, thường ID/Code là định danh, nếu backend không cho sửa code thì disable
                    // Tuy nhiên trong Swagger update body vẫn có code, nên cứ để sửa nếu cần.
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700">Thời gian:</label>
                <div className="w-3/4 flex items-center space-x-4">
                  <input
                    type="date"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                  <span>-</span>
                  <input
                    type="date"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-2">Mô tả:</label>
                <div className="w-3/4">
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                  ></textarea>
                </div>
              </div>

            </div>
          </div>
          
          {/* --- Phần 2: Thiết lập giảm giá --- */}
          <div>
            <h3 className="font-bold text-gray-800 mb-6">Mức giảm giá</h3>
            <div className="space-y-5">

              <div className="flex items-center">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700">Loại khuyến mãi:</label>
                <div className="w-3/4 flex space-x-4">
                  <select 
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={loaiKhuyenMai}
                    onChange={(e) => setLoaiKhuyenMai(e.target.value)}
                  >
                    <option value="so-tien">Số tiền (VND)</option>
                    <option value="phan-tram">Phần trăm (%)</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Nhập giá trị giảm"
                    className="w-2/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={mucGiam}
                    onChange={(e) => setMucGiam(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-2">Số lượng:</label>
                <div className="w-3/4">
                  <div className="flex items-center space-x-6 mb-2">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" className="form-radio text-[#F9614A]" 
                        checked={ticketLimit === 'limited'}
                        onChange={() => setTicketLimit('limited')}
                      />
                      <span className="ml-2 text-sm">Giới hạn</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" className="form-radio text-[#F9614A]" 
                        checked={ticketLimit === 'unlimited'}
                        onChange={() => setTicketLimit('unlimited')}
                      />
                      <span className="ml-2 text-sm">Không giới hạn</span>
                    </label>
                  </div>
                  {ticketLimit === 'limited' && (
                    <input
                        type="number"
                        placeholder="Nhập tổng số voucher"
                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                        value={tongSoVe}
                        onChange={(e) => setTongSoVe(e.target.value)}
                    />
                  )}
                </div>
              </div>

            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 bg-white border-none rounded-md text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#F9614A] border border-transparent rounded-md text-sm font-semibold text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
    
        </form>
      </div>
    </div>
  );
};

export default CreateVoucherPage;