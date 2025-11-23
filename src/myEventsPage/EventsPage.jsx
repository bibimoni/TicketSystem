import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Đã import

// Import icons
import { FiClock, FiMapPin, FiPieChart, FiFileText, FiEdit } from 'react-icons/fi';
import { defaultEvents } from '../context/mockEventData.js';
const DEFAULT_IMAGE = "./ghibili.jpg";

/**
 * Component con cho các nút Tab ("Sắp tới", "Đã qua"...)
 */
const TabButton = ({ label, tabKey, activeTab, onClick }) => {
  const isActive = activeTab === tabKey;
  
  return (
    <button
      onClick={() => onClick(tabKey)}
      className={`
        px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border-none 
        ${isActive 
          ? 'bg-[#f7ad99] text-white' 
          : 'bg-white text-gray-500 hover:bg-gray-100'}
      `}
    >
      {label}
    </button>
  );
};

/**
 * Component con cho các nút hành động
 */
const ActionButton = ({ icon: Icon, label, onClick }) => {
  return (
    <button 
      onClick={onClick} // Prop 'onClick' đã có sẵn
      className="flex flex-col items-center text-white font-semibold text-sm hover:opacity-80 transition-opacity bg-transparent border-none"
    >
      <Icon size={24} />
      <span className="mt-1">{label}</span>
    </button>
  );
};

/**
 * Component chính của trang
 */
const EventCard = ({ event, isAdmin }) => {
  const navigate = useNavigate();

  const imageUrl = event.suKienImage || DEFAULT_IMAGE;
  const title = event.eventName || "Sự kiện chưa đặt tên";
  const time = event.eventDate || "Chưa có ngày";
  const locationName = event.address || "Chưa có địa điểm";
  const locationDetail = `${event.ward || ''}, ${event.district || ''}, ${event.province || ''}`;
  
  // --- THÊM CÁC HÀM XỬ LÝ MỚI ---

  // 1. Hàm cho nút "Tổng quan"
  const handleOverviewClick = () => {
    if (isAdmin) {
       navigate(`/admin/duyet-su-kien/${event.id}`); 
    } else {
       navigate(`/event/${event.id}/overview`);
    }
};

  // 2. Hàm cho nút "Đơn hàng"
  const handleOrdersClick = () => {
    if (isAdmin) {
       navigate(`/admin/event-detail/${event.id}/orders`);
    } else {
       navigate(`/event/${event.id}/orders`);
    }
  };
  
  // 3. Hàm cho nút "Chỉnh sửa" (giữ nguyên)
  const handleEditClick = () => {
    navigate(`/event-edit/${event.id}`);
  };

  return (
    <div className="-ml-[70px] bg-[#FFE8E2] rounded-lg shadow-lg overflow-hidden border border-[#fdebe7] w-[1100px] mb-6">
      {/* Phần thông tin (trên) */}
      <div className="p-6 flex flex-row gap-6 items-center">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-48 h-32 object-cover rounded-md flex-shrink-0"
        />
        
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-gray-800">
            {title}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-red-600">
            <FiClock size={16} />
            <span className="text-sm font-semibold">{time}</span>
          </div>
          <div className="flex items-start gap-2 mt-2 text-gray-600">
            <FiMapPin size={16} className="mt-1 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{locationName}</span>
              <span className="text-sm">{locationDetail}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phần hành động (dưới) */}
      <div className="bg-[#F2745C] p-4 flex justify-around">
        {/* --- CẬP NHẬT 'onClick' CHO CÁC NÚT --- */}
        <ActionButton 
          icon={FiPieChart} 
          label={isAdmin ? "Chi tiết & Duyệt" : "Tổng quan"}
          onClick={handleOverviewClick} // Gán hàm mới
        />
        <ActionButton 
          icon={FiFileText} 
          label="Đơn hàng" 
          onClick={handleOrdersClick} // Gán hàm mới
        />
        {!isAdmin && (
            <ActionButton 
              icon={FiEdit} 
              label="Chỉnh sửa" 
              onClick={handleEditClick} 
            />
        )}
      </div>
    </div>
  );
};


/**
 * ===================================================================
 * COMPONENT CHÍNH CỦA TRANG (EventsPage)
 * ===================================================================
 */
const EventsPage = ({ isAdmin = false }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('Chờ duyệt'); 

  useEffect(() => {
    // Lấy dữ liệu từ localStorage (như cũ)
    const storedEvents = JSON.parse(localStorage.getItem('myEvents')) || [];
    
    // Tạo một Set (tập hợp) chứa ID của các sự kiện đã có trong localStorage
    const storedIds = new Set(storedEvents.map(e => e.id));

    // Lọc ra các sự kiện từ file mockData mà CHƯA có trong localStorage
    const additionalEvents = defaultEvents.filter(
      mockEvent => !storedIds.has(mockEvent.id)
    );

    // Gộp 2 mảng lại:
    // (Những gì bạn tạo sẽ đè lên dữ liệu mẫu nếu trùng ID)
    const combinedEvents = [...storedEvents, ...additionalEvents];

    setAllEvents(combinedEvents);
  }, []);

  const filteredEvents = allEvents.filter(event => event.status === activeTab);

  return (
    <div className="min-h-screen p-8 ">
      
      {/* === THANH ĐIỀU KHIỂN TRÊN CÙNG === */}
      <div className="-mt-[100px] -ml-[60px] flex items-center justify-between w-[1100px] bg-[#FFF8F7] p-4 rounded-md mb-6">
        
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

        <div className="flex items-center bg-white border border-gray-300 rounded-full p-1 shadow-sm">
          <TabButton 
            label="Sắp tới"
            tabKey="Sắp tới"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton 
            label="Đã qua"
            tabKey="Đã qua"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton 
            label="Chờ duyệt"
            tabKey="Chờ duyệt"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
          <TabButton 
            label="Bị hủy"
            tabKey="Bị hủy"
            activeTab={activeTab}
            onClick={setActiveTab}
          />
        </div>
      </div>

      {/* === DANH SÁCH SỰ KIỆN === */}
      <div className="flex flex-col items-center">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard 
                event={event} 
                key={event.id} 
                isAdmin={isAdmin} 
            />
          ))
        ) : (
          <p className="-ml-[70px] text-gray-600">Không có sự kiện nào trong mục này.</p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;