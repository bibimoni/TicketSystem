import React, { createContext, useState } from 'react';

// 1. Tạo Context
export const EventContext = createContext(null);

// 2. Tạo "Nhà cung cấp" (Provider) cho cái giỏ này
export const EventFormProvider = ({ children }) => {
  // Đây là state chứa dữ liệu của 1 sự kiện ĐANG TẠO
  const [eventData, setEventData] = useState({});

  return (
    <EventContext.Provider value={{ eventData, setEventData }}>
      {children}
    </EventContext.Provider>
  );
};