// eventorderpage/CreateVoucherPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBackOutline, IoCalendarOutline } from 'react-icons/io5';

const CreateVoucherPage = () => {
  const navigate = useNavigate();
  const { eventId, voucherId } = useParams(); // Lấy thêm voucherId từ URL
  
  // Xác định chế độ: Nếu có voucherId -> Chế độ Sửa (True), ngược lại là Tạo mới
  const isEditMode = Boolean(voucherId);

  // --- State cho form ---
  const [tenChuongTrinh, setTenChuongTrinh] = useState('');
  const [maVoucher, setMaVoucher] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [noiDung, setNoiDung] = useState('');
  const [thietLapHienThi, setThietLapHienThi] = useState('cong-khai');
  
  const [loaiKhuyenMai, setLoaiKhuyenMai] = useState('so-tien');
  const [mucGiam, setMucGiam] = useState('');
  
  const [ticketLimit, setTicketLimit] = useState('limited');
  const [tongSoVe, setTongSoVe] = useState('');
  
  const [soDonHangToiDa, setSoDonHangToiDa] = useState('');
  const [soLuongVeToiThieu, setSoLuongVeToiThieu] = useState('');
  const [soLuongVeToiDa, setSoLuongVeToiDa] = useState('');
  
  // Giữ lại status cũ khi sửa (mặc định là 'Đang hoạt động' khi tạo mới)
  const [status, setStatus] = useState('Đang hoạt động'); 

  // --- 1. USE EFFECT: Tự động điền dữ liệu khi ở chế độ Sửa ---
  useEffect(() => {
    if (isEditMode) {
      const storageKey = `eventVouchers_${eventId}`;
      const existingVouchers = JSON.parse(localStorage.getItem(storageKey)) || [];
      
      // Tìm voucher cần sửa
      const voucherToEdit = existingVouchers.find(v => v.id === voucherId);

      if (voucherToEdit) {
        // Đổ dữ liệu vào state
        setTenChuongTrinh(voucherToEdit.tenChuongTrinh);
        setMaVoucher(voucherToEdit.maVoucher);
        setStartDate(voucherToEdit.startDate);
        setEndDate(voucherToEdit.endDate);
        setNoiDung(voucherToEdit.noiDung);
        setThietLapHienThi(voucherToEdit.thietLapHienThi);
        setLoaiKhuyenMai(voucherToEdit.loaiKhuyenMai);
        setMucGiam(voucherToEdit.mucGiam);
        
        // Xử lý logic ticketLimit
        if (voucherToEdit.tongSoVe === 'Không giới hạn') {
            setTicketLimit('unlimited');
            setTongSoVe('');
        } else {
            setTicketLimit('limited');
            setTongSoVe(voucherToEdit.tongSoVe);
        }

        setSoDonHangToiDa(voucherToEdit.soDonHangToiDa);
        setSoLuongVeToiThieu(voucherToEdit.soLuongVeToiThieu);
        setSoLuongVeToiDa(voucherToEdit.soLuongVeToiDa);
        setStatus(voucherToEdit.status);
      }
    }
  }, [isEditMode, eventId, voucherId]);


  const handleCancel = () => {
    navigate(`/event/${eventId}/voucher`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const storageKey = `eventVouchers_${eventId}`;
    const existingVouchers = JSON.parse(localStorage.getItem(storageKey)) || [];

    const formData = {
      tenChuongTrinh,
      maVoucher,
      startDate,
      endDate,
      noiDung,
      thietLapHienThi,
      loaiKhuyenMai,
      mucGiam,
      tongSoVe: ticketLimit === 'unlimited' ? 'Không giới hạn' : tongSoVe,
      soDonHangToiDa,
      soLuongVeToiThieu,
      soLuongVeToiDa,
      status: status // Giữ nguyên status (không reset về 'Đang hoạt động')
    };

    let updatedVouchers;

    if (isEditMode) {
        // --- LOGIC SỬA ---
        // Tìm và cập nhật voucher cũ, giữ nguyên ID cũ
        updatedVouchers = existingVouchers.map(v => 
            v.id === voucherId ? { ...v, ...formData } : v
        );
        console.log("Đã cập nhật voucher:", voucherId);
    } else {
        // --- LOGIC TẠO MỚI ---
        const newVoucher = {
            id: Date.now().toString(), // Tạo ID mới
            ...formData,
            status: 'Đang hoạt động' // Mặc định khi mới tạo
        };
        updatedVouchers = [...existingVouchers, newVoucher];
        console.log("Đã tạo voucher mới");
    }

    // Lưu và quay lại
    localStorage.setItem(storageKey, JSON.stringify(updatedVouchers));
    navigate(`/event/${eventId}/voucher`);
  };

  return (
    <div className="bg-[#FF714B] p-5 rounded-lg shadow-md w-[1050px] mt-[-10px]">
      
      <div 
        className="flex items-center text-white font-semibold text-lg mb-6 cursor-pointer"
        onClick={handleCancel}
      >
        <IoChevronBackOutline size={22} className="mr-2" />
        {/* Đổi tiêu đề linh hoạt */}
        {isEditMode ? 'Chỉnh sửa voucher' : 'Tạo voucher mới'}
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md w-[990px]">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Phần 1: Thông tin cơ bản */}
          <div>
            <h3 className="font-bold text-gray-800 mb-6">Thông tin cơ bản</h3>
            <div className="space-y-5">
              
              {/* Tên chương trình */}
              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-2">Tên chương trình khuyến mãi:</label>
                <div className="w-3/4">
                  <input
                    type="text"
                    placeholder="Nhập tên chương trình khuyến mãi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={tenChuongTrinh}
                    onChange={(e) => setTenChuongTrinh(e.target.value)}
                    maxLength={80}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>Tên chương trình không hiển thị cho người mua</span>
                    <span>{tenChuongTrinh.length}/80</span>
                  </p>
                </div>
              </div>

              {/* Mã voucher */}
              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-2">Mã voucher:</label>
                <div className="w-3/4">
                  <input
                    type="text"
                    placeholder="Nhập mã voucher"
                    value={maVoucher}
                    onChange={(e) => setMaVoucher(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    minLength={6}
                    maxLength={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    required
                    // Có thể disable mã voucher khi sửa nếu không muốn cho đổi mã
                    // disabled={isEditMode} 
                  />
                  <p className="text-xs text-gray-500 mt-1">Cho phép những giá trị sau (A-Z và 0-9), tối thiểu 6 và tối đa 12 ký tự</p>
                </div>
              </div>

              {/* Thời gian sử dụng */}
              <div className="flex items-center">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700">Thời gian sử dụng mã:</label>
                <div className="w-3/4 flex items-center space-x-4">
                  <div className="relative w-1/2">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <span>-</span>
                  <div className="relative w-1/2">
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Nội dung */}
              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-2">Nội dung:</label>
                <div className="w-3/4">
                  <textarea
                    rows="4"
                    placeholder="Điều khoản và quy định của chương trình khuyến mãi này"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={noiDung}
                    onChange={(e) => setNoiDung(e.target.value)}
                  ></textarea>
                </div>
              </div>

              {/* Thiết lập hiển thị */}
              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-1">Thiết lập hiển thị</label>
                <div className="w-3/4 space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" name="display" className="form-radio text-[#F9614A] focus:ring-[#F9614A]" 
                      checked={thietLapHienThi === 'cong-khai'}
                      onChange={() => setThietLapHienThi('cong-khai')}
                    />
                    <span className="ml-3">
                      <span className="font-semibold text-sm">Công khai</span>
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="radio" name="display" className="form-radio text-[#F9614A] focus:ring-[#F9614A]" 
                      checked={thietLapHienThi === 'rieng-tu'}
                      onChange={() => setThietLapHienThi('rieng-tu')}
                    />
                    <span className="ml-3">
                      <span className="font-semibold text-sm">Riêng tư</span>
                    </span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Phần 2: Thiết lập mã voucher */}
          <div>
            <h3 className="font-bold text-gray-800 mb-6">Thiết lập mã voucher</h3>
            <div className="space-y-5">

              {/* Loại khuyến mãi */}
              <div className="flex items-center">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700">Loại khuyến mãi:</label>
                <div className="w-3/4 flex space-x-4">
                  <select 
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={loaiKhuyenMai}
                    onChange={(e) => setLoaiKhuyenMai(e.target.value)}
                  >
                    <option value="so-tien">Theo số tiền</option>
                    <option value="phan-tram">Theo phần trăm</option>
                  </select>
                  <input
                    type="number"
                    placeholder={loaiKhuyenMai === 'so-tien' ? 'Nhập số tiền giảm' : 'Nhập % giảm'}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={mucGiam}
                    onChange={(e) => setMucGiam(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Tổng số vé */}
              <div className="flex items-start">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700 pt-2">Tổng số vé được áp dụng:</label>
                <div className="w-3/4">
                  <div className="flex items-center space-x-6 mb-2">
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" name="ticketLimit" className="form-radio text-[#F9614A] focus:ring-[#F9614A]" 
                        checked={ticketLimit === 'limited'}
                        onChange={() => setTicketLimit('limited')}
                      />
                      <span className="ml-2 text-sm">Giới hạn</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input 
                        type="radio" name="ticketLimit" className="form-radio text-[#F9614A] focus:ring-[#F9614A]" 
                        checked={ticketLimit === 'unlimited'}
                        onChange={() => setTicketLimit('unlimited')}
                      />
                      <span className="ml-2 text-sm">Không giới hạn</span>
                    </label>
                  </div>
                  <input
                    type="number"
                    placeholder="Nhập số lượng vé"
                    disabled={ticketLimit === 'unlimited'}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A] disabled:bg-gray-100"
                    value={tongSoVe}
                    onChange={(e) => setTongSoVe(e.target.value)}
                    required={ticketLimit === 'limited'}
                  />
                </div>
              </div>
              
              {/* Các input số khác */}
              <div className="flex items-center">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700">Số đơn hàng tối đa/Người mua:</label>
                <div className="w-3/4">
                  <input 
                    type="number" className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={soDonHangToiDa}
                    onChange={(e) => setSoDonHangToiDa(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700">Số lượng vé tối thiểu:</label>
                <div className="w-3/4">
                  <input 
                    type="number" className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={soLuongVeToiThieu}
                    onChange={(e) => setSoLuongVeToiThieu(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <label className="w-1/4 text-right pr-6 font-semibold text-sm text-gray-700">Số lượng vé tối đa:</label>
                <div className="w-3/4">
                  <input 
                    type="number" className="w-1/2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F9614A]"
                    value={soLuongVeToiDa}
                    onChange={(e) => setSoLuongVeToiDa(e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>
          
          {/* Nút Hành động */}
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
              className="px-6 py-2 bg-[#F9614A] border border-transparent rounded-md text-sm font-semibold text-white hover:bg-opacity-90"
            >
              {/* Đổi tên nút dựa vào chế độ */}
              {isEditMode ? 'Lưu thay đổi' : 'Tạo voucher'}
            </button>
          </div>
    
        </form>
    </div>
    </div>
  );
};

export default CreateVoucherPage;