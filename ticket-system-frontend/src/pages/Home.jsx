// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from "react";

import Footer from "../components/Footer";
import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import HeroBanner from "../components/HeroBanner";
import ListEvent from "../components/ListEvent";
import AdvertisingBanner from "../components/AdvertisingBanner";
import Loader from "../components/TicketLoader";

import eventService from "../services/eventService";
import defaultImage from "../assets/images/default_img.png";
import bgImage from "/src/assets/images/bg.jpg";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await eventService.getAllEvents();

        const mappedEvents = Array.isArray(response) ? response.map(evt => {

          const bannerUrl = evt.event_banner_url;

          return {
            id: evt.id,
            title: evt.name,
            src: bannerUrl || defaultImage,
            alt: evt.name,
            date: evt.eventTime,
            picture: evt.event_picture_url,
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

  if (loading) return (
    <Loader text="Đang tải sự kiện..." height="100vh" />

  );

  return (
    <div className="bg-home relative min-h-screen isolate">
      <div
        className="fixed inset-0 -z-20 w-full h-full"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          filter: "blur(2px)",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/10 -z-10"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <HeaderBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <CatalogBar />

        <HeroBanner />

        {/* SỰ KIỆN NỔI BẬT */}
        <ListEvent
          title={"SỰ KIỆN NỔI BẬT"}
          events={upcomingEvents.slice(0, 15)}
          imageWidth={"260px"}
          imageHeight={"350px"}
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
    </div>
  );
}

export default Home;