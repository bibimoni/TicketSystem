import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";

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

      <main className="flex-grow">
      </main>

      {/* Footer luôn nằm dưới cùng */}
      <Footer />
    </div>
  );
}

export default Home;