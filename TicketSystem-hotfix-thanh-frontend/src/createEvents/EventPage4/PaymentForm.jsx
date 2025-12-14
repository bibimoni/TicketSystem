// Đường dẫn: page/EventPage4/PaymentForm.jsx

import React, { useContext } from 'react'; // <--- THÊM useContext
import { EventContext } from '../../context/EventContext'; // <--- THÊM Import Context



/**
 * Component Form chính
 */
const PaymentForm = ({ isAdmin = false }) => {
  // Lấy data và hàm set từ Context
  const { eventData, setEventData } = useContext(EventContext);
  
  /**
 * Component con (helper) để tạo một hàng (label + input)
 */
  const FormRow = ({ label, placeholder, name, value, onChange }) => {
    return (
      <div className="flex items-center gap-6 mb-4 ">
        <label 
          htmlFor={!isAdmin ? name : undefined}
          className="inline-block bg-[#ffffff] border border-[#F8AE99] text-[#f94f2f] font-semibold text-sm rounded-full px-6 py-2 w-44 text-center shadow-sm flex-shrink-0"
        >
          {label}
        </label>
        
        <input
          id={name}
          name={name}
          type="text"
          disabled={isAdmin}
          placeholder={placeholder || ''}
          value={value}
          onChange={onChange}
          className="h-[32px] flex-1 bg-white rounded-lg px-4 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f94f2f] border-none"
        />
      </div>
    );
  };
  // Lấy thông tin thanh toán từ "giỏ hàng"
  // Nếu chưa có, nó sẽ là một đối tượng rỗng
  const formData = eventData.paymentInfo || {
    accountHolder: '',
    accountNumber: '',
    bankName: '',
    branch: '',
    businessType: '',
    companyName: '',
    companyAddress: '',
    taxCode: '',
  };

  // Hàm xử lý chung khi có thay đổi ở bất kỳ ô input nào
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Cập nhật "giỏ hàng" (eventData)
    setEventData(prevData => ({ 
      ...prevData,
      // Cập nhật thông tin bên trong 'paymentInfo'
      paymentInfo: {
        ...prevData.paymentInfo,
        [name]: value
      }
    }));
  };

  return (
    // Container chính với nền hồng

    
   <div className="w-[1050px] mx-auto p-10 bg-[#FFE8E2] rounded-lg shadow-lg">

      
      {/* === Phần 1: Thông tin thanh toán === */}
      <div className="mb-8">
        <span className="inline-block bg-white border-2 border-[#f7ad99] text-[#f94f2f] font-semibold text-sm rounded-full px-5 py-2 mb-6 shadow-sm">
        Thông tin thanh toán
        </span>

        {/* Các hàng của form - Đã kết nối value={formData.xxx} */}
        <FormRow 
          label="Chủ tài khoản"
          name="accountHolder"
          value={formData.accountHolder}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
        <FormRow 
          label="Số tài khoản"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
        <FormRow 
          label="Tên ngân hàng"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
        <FormRow 
          label="Chi nhánh"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
      </div>


      {/* === Phần 2: Hóa đơn đỏ === */}
      <div>
        <span className="inline-block bg-white border-2 border-[#f7ad99] text-[#f94f2f] font-semibold text-sm rounded-full px-5 py-2 mb-6 shadow-sm">
          Hóa đơn đỏ
        </span>
        
        <FormRow 
          label="Loại hình kinh doanh"
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
        <FormRow 
          label="Tên"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
        <FormRow 
          label="Địa chỉ"
          name="companyAddress"
          value={formData.companyAddress}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
        <FormRow 
          label="Mã số thuế"
          name="taxCode"
          value={formData.taxCode}
          onChange={handleChange}
          isAdmin={isAdmin}
        />
      </div>
      
    </div>
  );
};

export default PaymentForm;