import React, { useState } from "react";
import { Menu as MenuIcon, ChevronDown as ChevronDownIcon } from "lucide-react";

const categories = [
  { label: "Concert", href: "/" },
  { label: "Văn hóa nghệ thuật", href: "/" },
  { label: "Hội thảo", href: "/" },
  { label: "Thể thao", href: "/" },
];

const locations = ["HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ"];

const CatalogBar = ({ onFilter }) => {
  const [selectedLocation, setSelectedLocation] = useState("Chọn địa điểm");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setIsDropdownOpen(false);
    if (onFilter) onFilter(loc); // callback để lọc sự kiện
  };

  return (
    <nav className="w-full bg-white shadow-md animate-fade-in opacity-100 [--animation-delay:200ms]">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto h-[45px] px-4 sm:px-6 md:px-8">
        {/*Menu + Categories */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hover:opacity-80 transition-opacity p-1">
            <MenuIcon className="w-6 h-6 text-primary" />
          </button>

          {categories.map((category, index) => (
            <React.Fragment key={index}>
              {index > 0 && <div className="h-5 w-[2px] bg-primary opacity-75 mx-3" />}
              <a
                href={category.href}
                className="font-semibold text-primary text-xs hover:underline transition-all whitespace-nowrap"
              >
                {category.label}
              </a>
            </React.Fragment>
          ))}
        </div>

        {/*Chọn địa điểm */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className=" flex font-semibold text-white text-[11px] bg-primary px-3 py-1 rounded whitespace-nowrap">
              {selectedLocation}
              <ChevronDownIcon className="w-4 h-4 text-white ml-3" />
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 w-[150px] bg-white shadow-md rounded-md z-90">
              {locations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectLocation(loc)}
                  className="w-full text-left px-4 py-2 hover:bg-primary hover:text-white transition-colors text-sm"
                >
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CatalogBar;
