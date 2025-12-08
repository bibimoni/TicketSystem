// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from "react";

import Footer from "../components/Footer";
import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import HeroBanner from "../components/HeroBanner";
import ListEvent from "../components/ListEvent";
import AdvertisingBanner from "../components/AdvertisingBanner";

import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const extractBannerUrl = (infoString) => {
    if (!infoString) return null;

    const match = infoString.match(/\[Banner\]:\s*([^\s\n]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await eventService.getAllEvents();

        const mappedEvents = Array.isArray(response) ? response.map(evt => {
          const bannerUrl = extractBannerUrl(evt.information);

          return {
            id: evt.id,
            title: evt.name,
            src: bannerUrl || defaultImage,
            alt: evt.name,
            date: evt.eventTime,
            ...evt
          };
        }) : [];

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Lỗi tải sự kiện:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const upcomingEvents = useMemo(() => {
    const now = new Date();

    return events
      .filter(evt => new Date(evt.eventTime) > now)
      .sort((a, b) => new Date(a.eventTime) - new Date(b.eventTime));
  }, [events]);

  if (loading) return <div className="text-center py-10 font-bold text-primary">Đang tải dữ liệu...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <HeaderBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <CatalogBar />
      <HeroBanner />

      {/* SỰ KIỆN NỔI BẬT */}
      <ListEvent
        title={"SỰ KIỆN NỔI BẬT"}
        events={upcomingEvents.slice(0, 15)}
        imageWidth={"225px"}
        imageHeight={"290px"}
        gap={30}
      />

      {/* SỰ KIỆN TRENDING */}
      <ListEvent
        title={"SỰ KIỆN TRENDING"}
        events={events.slice(0, 10)}
        imageWidth={"380px"}
        imageHeight={"160px"}
        gap={30}
      />

      {/* CONCERT GÌ NÀO ? */}
      <ListEvent
        title="CONCERT GÌ NÀO ?"
        events={events}
        imageWidth={"350px"}
        imageHeight={"200px"}
        gap={30}
      />
      <AdvertisingBanner banner="https://techcombank.com/content/dam/techcombank/public-site/articles/non-blog/Banner-cashback-ther-VISA-c6315ae326.jpg" height={500} />

      {/* NGHỆ THUẬT VÀ SÂN KHẤU */}
      <ListEvent
        title="NGHỆ THUẬT VÀ SÂN KHẤU"
        events={events}
        imageWidth={"350px"}
        imageHeight={"200px"}
        gap={30}
      />

      {/* THỂ THAO */}
      <ListEvent
        title="THỂ THAO"
        events={events}
        imageWidth={"350px"}
        imageHeight={"200px"}
        gap={30}
      />

      <Footer />
    </div>
  );
}

export default Home;
