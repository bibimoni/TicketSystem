import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Import icons
import { FiClock, FiMapPin, FiPieChart, FiFileText, FiEdit, FiImage, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// --- CẤU HÌNH API ---
const API_BASE_URL = 'https://ticket-system-backend-pkuf.onrender.com';

// Component hiển thị ảnh an toàn
const EventImage = ({ src, alt }) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-48 h-32 bg-gray-200 rounded-md flex-shrink-0 flex flex-col items-center justify-center text-gray-400">
        <FiImage size={32} />
        <span className="text-xs mt-1 font-medium">No Image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-48 h-32 object-cover rounded-md flex-shrink-0 bg-gray-100"
      onError={() => setHasError(true)}
    />
  );
};

const TabButton = ({ label, tabKey, activeTab, onClick }) => {
  const isActive = activeTab === tabKey;
  return (
    <button
      onClick={() => onClick(tabKey)}
      className={`
        px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-200 border-none cursor-pointer
        ${isActive
          ? 'bg-[#f7ad99] text-white'
          : 'bg-white text-gray-500 hover:bg-gray-100'}
      `}
    >
      {label}
    </button>
  );
};

const ActionButton = ({ icon: Icon, label, onClick, isDanger }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center font-semibold text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer ${isDanger ? 'text-red-200 hover:text-white' : 'text-white'}`}
    >
      <Icon size={24} />
      <span className="mt-1">{label}</span>
    </button>
  );
};

// Hàm trích xuất ảnh từ description
const extractImageFromInfo = (info) => {
    if (!info) return null;
    const match = info.match(/\[Banner\]:\s*([^\s\n]+)/);

    if (match) {
        let imageUrl = match[1];
        if (imageUrl.includes("Không") || imageUrl.includes("có") || imageUrl === "undefined" || imageUrl === "null") {
            return null;
        }
        if (!imageUrl.startsWith('http')) {
            const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
            imageUrl = `${API_BASE_URL}/${cleanPath}`;
        }
        return imageUrl;
    }
    return null;
};

const EventCard = ({ event, isAdmin }) => {
  const navigate = useNavigate();
  const eventId = event._id || event.id;

  const imageUrl = event.background || extractImageFromInfo(event.information);
  const title = event.name || "Sự kiện chưa đặt tên";
  const time = event.eventTime ? new Date(event.eventTime).toLocaleString('vi-VN') : "Chưa có ngày";
  const locationName = event.destination || "Chưa có địa điểm";

  // --- CẬP NHẬT: Mapping nhãn trạng thái theo 4 loại ---
  const getStatusLabel = (status) => {
      const s = status ? status.toUpperCase() : 'DRAFT';
      
      switch (s) {
          case 'DRAFT':
              return <span className="text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded text-xs ml-2">Chờ duyệt</span>;
          case 'PUBLISHED':
              return <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs ml-2">Sắp tới</span>;
          case 'COMPLETED':
              return <span className="text-gray-600 bg-gray-200 px-2 py-0.5 rounded text-xs ml-2">Đã qua</span>;
          case 'CANCELLED':
              return <span className="text-red-600 bg-red-100 px-2 py-0.5 rounded text-xs ml-2">Bị hủy</span>;
          default:
              return <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs ml-2">{s}</span>;
      }
  };

  const handleOverviewClick = () => {
    if (isAdmin) navigate(`/admin/duyet-su-kien/${eventId}/buoc-1`);
    else navigate(`/event/${eventId}/overview`);
  };

  const handleOrdersClick = () => {
    if (isAdmin) navigate(`/admin/event-detail/${eventId}/orders`);
    else navigate(`/event/${eventId}/orders`);
  };

  const handleEditClick = () => {
    navigate(`/event-edit/${eventId}/buoc-1`);
  };

  return (
    <div className="bg-[#FFE8E2] rounded-lg shadow-lg overflow-hidden border border-[#fdebe7] w-[1100px] mb-6">
      <div className="p-6 flex flex-row gap-6 items-center">
        <EventImage src={imageUrl} alt={title} />

        <div className="flex flex-col flex-1">
          <div className="flex items-center">
             <h2 className="text-xl font-bold text-gray-800">{title}</h2>
             {getStatusLabel(event.status)}
          </div>

          <div className="flex items-center gap-2 mt-2 text-red-600">
            <FiClock size={16} />
            <span className="text-sm font-semibold">{time}</span>
          </div>
          <div className="flex items-start gap-2 mt-2 text-gray-600">
            <FiMapPin size={16} className="mt-1 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">{locationName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#F2745C] p-4 flex justify-around">
        <ActionButton
          icon={FiPieChart}
          label={isAdmin ? "Chi tiết & Duyệt" : "Tổng quan"}
          onClick={handleOverviewClick}
        />
        <ActionButton
          icon={FiFileText}
          label="Đơn hàng"
          onClick={handleOrdersClick}
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

const EventsPage = ({ isAdmin = false }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('Sắp tới');
  const [loading, setLoading] = useState(true);

  // --- STATE CHO TÌM KIẾM VÀ PHÂN TRANG ---
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; 

  const { token } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
        setLoading(true);
        try {
          if (!token) return;
          const endpoint = isAdmin
            ? `${API_BASE_URL}/event/all_events`
            : `${API_BASE_URL}/event/customer_events`;

          const response = await axios.get(
            endpoint,
            { headers: { 'Authorization': `Bearer ${token}` } }
          );

          let eventsFromServer = [];
          if (Array.isArray(response.data)) {
              eventsFromServer = response.data;
          } else if (response.data.events && Array.isArray(response.data.events)) {
              eventsFromServer = response.data.events;
          } else if (response.data.data && Array.isArray(response.data.data)) {
              eventsFromServer = response.data.data;
          }

          setAllEvents(eventsFromServer);

        } catch (error) {
          console.error("❌ Lỗi tải sự kiện:", error);
        } finally {
          setLoading(false);
        }
    };

    fetchEvents();
  }, [token, isAdmin]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  // --- LOGIC LỌC SỰ KIỆN (CHÍNH XÁC THEO STATUS) ---
  const filteredEvents = allEvents.filter(event => {
      // 1. Lọc theo Tên (Search)
      if (searchTerm) {
          const normalizedSearch = searchTerm.toLowerCase().trim();
          const eventName = (event.name || "").toLowerCase();
          if (!eventName.includes(normalizedSearch)) {
              return false;
          }
      }

      // 2. Lọc theo Status tương ứng với Tab
      // Lấy status từ API, mặc định là DRAFT nếu không có
      const status = event.status ? event.status.toUpperCase() : 'DRAFT';

      if (activeTab === 'Chờ duyệt') {
          return status === 'DRAFT';
      }

      if (activeTab === 'Sắp tới') {
          return status === 'PUBLISHED';
      }

      if (activeTab === 'Đã qua') {
          return status === 'COMPLETED';
      }

      if (activeTab === 'Bị hủy') {
          return status === 'CANCELLED';
      }

      return false;
  });

  // --- LOGIC PHÂN TRANG ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className="">

      {/* THANH CÔNG CỤ */}
      <div className="flex items-center justify-between w-[1100px] bg-[#FFF8F7] p-4 rounded-md mb-6 sticky top-0 z-10 shadow-sm border border-red-100">
        
        <div className="flex items-center bg-white border border-[#F8AE99] rounded-lg shadow-sm w-[400px]">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên sự kiện..."
            className="px-4 py-2 text-sm rounded-l-lg border-none focus:outline-none flex-1 text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-white text-gray-600 px-4 py-2 text-sm rounded-r-lg hover:bg-gray-50 border-none border-l border-[#F8AE99]">
            Tìm kiếm
          </button>
        </div>

        {/* CÁC TAB - Bỏ tab "Nháp" vì đã gộp vào Chờ duyệt */}
        <div className="flex items-center bg-white border border-gray-300 rounded-full p-1 shadow-sm">
          <TabButton label="Sắp tới" tabKey="Sắp tới" activeTab={activeTab} onClick={setActiveTab} />
          <TabButton label="Đã qua" tabKey="Đã qua" activeTab={activeTab} onClick={setActiveTab} />
          <TabButton label="Chờ duyệt" tabKey="Chờ duyệt" activeTab={activeTab} onClick={setActiveTab} />
          <TabButton label="Bị hủy" tabKey="Bị hủy" activeTab={activeTab} onClick={setActiveTab} />
        </div>
      </div>

      {/* DANH SÁCH SỰ KIỆN */}
      <div className="flex flex-col items-center pb-20 min-h-[500px]">
        {loading ? (
            <p className="text-[#f94f2f] font-semibold mt-10">Đang tải danh sách sự kiện...</p>
        ) : currentEvents.length > 0 ? (
          <>
            {currentEvents.map(event => (
              <EventCard
                  event={event}
                  key={event._id || event.id}
                  isAdmin={isAdmin}
              />
            ))}

            {/* THANH ĐIỀU HƯỚNG */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full border ${
                    currentPage === 1
                      ? "text-gray-300 border-gray-200 cursor-not-allowed"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-[#f94f2f] text-white border-none"
                        : "text-gray-600 hover:bg-gray-100 border-none"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full border ${
                    currentPage === totalPages
                      ? "text-gray-300 border-gray-200 cursor-not-allowed"
                      : "text-gray-600 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <FiChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-10">
             <div className="mb-4 text-gray-300">
                <FiFileText size={48} className="mx-auto" />
             </div>
             <p className="text-gray-600 text-lg">
                {searchTerm
                    ? `Không tìm thấy sự kiện nào có tên "${searchTerm}".`
                    : `Chưa có sự kiện nào trong mục "${activeTab}".`
                }
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;