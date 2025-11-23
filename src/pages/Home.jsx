import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import HeroBanner from "../components/HeroBanner";
import ListEvent from "../components/ListEvent";
import Events from "../database/Events";
import trendingEvent from "../database/TrendingEvent";
import AdvertisingBanner from "../components/AdvertisingBanner";


function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <HeaderBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <CatalogBar />

      <HeroBanner />

      <ListEvent
        title={"SỰ KIỆN NỔI BẬT"}
        events={Events}
        imageWidth={"225px"}
        imageHeight={"290px"}
        gap={30}
      />
      <ListEvent
        title={"SỰ KIỆN TRENDING"}
        events={trendingEvent}
        imageWidth={"380px"}
        imageHeight={"160px"}
        gap={30}
      />

      <ListEvent
        title="CONCERT GÌ NÀO ?"
        events={Events}
        imageWidth={"350px"}
        imageHeight={"200px"}
        gap={30}
      />
      
      <AdvertisingBanner />
      
      <ListEvent
        title="NGHỆ THUẬT VÀ SÂN KHẤU"
        events={Events}
        imageWidth={"350px"}
        imageHeight={"200px"}
        gap={30}
      />

      <ListEvent
        title="THỂ THAO"
        events={Events}
        imageWidth={"350px"}
        imageHeight={"200px"}
        gap={30}
      />


      {/* Footer luôn nằm dưới cùng */}
      <Footer />
    </div>
  );
}

export default Home;
