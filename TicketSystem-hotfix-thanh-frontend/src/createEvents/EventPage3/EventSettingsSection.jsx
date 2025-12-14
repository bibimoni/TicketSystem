import React, { useContext } from 'react'; // 1. Bỏ useState, thêm useContext
import { EventContext } from '../../context/EventContext'; // 2. Import "giỏ hàng" Context
import mailIcon from '../../Elements/mail.png'; // Đảm bảo đường dẫn đúng

const EventSettingsSection = ({ isAdmin = false }) => {
  // 3. Lấy data và hàm cập nhật từ Context
  const { eventData, setEventData } = useContext(EventContext);

  const maxChars = 500;
  const baseURL = 'https://ticketZ.';
  const uniqueSuffix = '-25135';
  const defaultURL = 'https://ticketZ./-25135';

  // 4. ĐỌC dữ liệu trực tiếp từ Context (thay vì useState)
  // Dùng "eventData.customPath" thay vì "customPath"
  const customPath = eventData.customPath || '';
  const message = eventData.confirmationMessage || ''; // Đặt tên key mới trong context

  // URL cuối cùng sẽ tự động cập nhật khi customPath trong context thay đổi
  const finalURL = customPath
    ? `${baseURL}//${customPath}${uniqueSuffix}`
    : defaultURL;

  // 5. Hàm GHI dữ liệu đường dẫn VÀO Context
  const handlePathChange = (event) => {
    const newPath = event.target.value;
    setEventData(prevData => ({
      ...prevData,
      customPath: newPath // Lưu vào "giỏ hàng"
    }));
  };

  // 6. Hàm GHI tin nhắn VÀO Context
  const handleMessageChange = (event) => {
    const newMessage = event.target.value;
    setEventData(prevData => ({
      ...prevData,
      confirmationMessage: newMessage // Lưu vào "giỏ hàng"
    }));
  };

  return (
    <>
      {/* === 1. Khối "Link" (Nằm trong EventPage3) === */}
      <div className="absolute top-0 left-[272px] right-0 bottom-0 overflow-y-auto overflow-x-hidden z-10">

    <div className="relative w-[1112px] mx-auto min-h-screen pb-40">
        <div className="absolute top-0 left-[-305px] w-full h-full">
      <div className="absolute top-[156px] left-[305px] w-[1112px] bg-[#ffe8e2] rounded-md p-2">
        <h3 className="ml-5 text-lg font-semibold text-gray-800 mb-2">
          Link dẫn đến sự kiện
        </h3>
        <div className="ml-5 font-semibold text-gray-800 mb-2">
          Tùy chỉnh đường dẫn
        </div>

        <div className="ml-5 bg-white rounded-md p-4 shadow-sm">
          <input
            type="text"
            disabled={isAdmin}
            // 7. ĐỌC từ Context
            value={customPath}
            // 8. GHI vào Context
            onChange={handlePathChange}
            placeholder="Nhập đường dẫn tùy chỉnh (ví dụ: anhtai)"
            className="w-full p-0 text-black font-medium border-none focus:ring-0 focus:outline-none"
          />
        </div>

        <p className="ml-5 text-sm text-gray-800 mt-1">
          Đường dẫn sự kiện của bạn là: {' '}
          <span className="font-medium text-blue-600">
            {finalURL}
          </span>
        </p>
      </div>

      {/* === KHỐI 2: TIN NHẮN XÁC NHẬN === */}
      <div className="absolute top-[380px] left-[305px] w-[1112px] bg-[#ffe8e2] rounded-md p-6">
        <div className="flex items-center gap-2 mb-1 mt-[-8px]">
          <img
            src={mailIcon}
            alt="Mail icon"
            className="w-5 h-5"
          />
          <h3 className="text-lg font-semibold text-gray-800">
            Tin nhắn xác nhận cho người tham gia
          </h3>
        </div>

        <div className="relative mt-1">
          <textarea
            // 9. ĐỌC từ Context
            disabled={isAdmin}
            value={message}
            // 10. GHI vào Context
            onChange={handleMessageChange}
            maxLength={maxChars}
            placeholder="Nhập tin nhắn của bạn ở đây..."
            className="w-[1050px] h-48 bg-white rounded-md p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#f94f2f] resize-none border-none"
          />
          <div className="absolute bottom-3 right-3 text-sm text-gray-500">
            {message.length}/{maxChars}
          </div>
        </div>
      </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default EventSettingsSection;
