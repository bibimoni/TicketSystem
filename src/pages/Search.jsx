// src/pages/Search.js
import React from "react";
import HeaderBar from "../components/HeaderBar";
import CatalogBar from "../components/CatalogBar";
import Footer from "../components/Footer";
import MoreEvent from "../components/MoreEvent";
import SearchEvent from "../components/SearchEvent";

function Search() {
    

    return (
        <div className="min-h-screen bg-gray-100">
            <HeaderBar />
            <CatalogBar />
            <SearchEvent />
            <MoreEvent />
            <Footer />
        </div>
    );
}
export default Search;