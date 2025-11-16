import React from "react";
import { Menu as MenuIcon, ChevronDown as ChevronDownIcon } from "lucide-react";

// categories sample
const categories = [
  { label: "Concert", href: "/" },
  { label: "Văn hóa nghệ thuật", href: "/" },
  { label: "Hội thảo", href: "/" },
  { label: "Thể thao", href: "/" },
];

const CatalogBar = () => {
  return (
    <nav className="w-full bg-white shadow-md animate-fade-in opacity-100 [--animation-delay:200ms]">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto h-[45px] px-4 sm:px-6 md:px-8">
        {/* Left: Menu + Categories */}
        <div className="flex items-center gap-4 md:gap-6">
          <button className="hover:opacity-80 transition-opacity p-1">
            <MenuIcon className="w-6 h-6 text-primary" />
          </button>

          {categories.map((category, index) => (
            <React.Fragment key={index}>
              {index > 0 && <div className="w-px h-5 w-[2px] bg-primary opacity-75 mx-3" />}
              <a
                href={category.href}
                className="font-semibold text-primary text-xs hover:underline transition-all whitespace-nowrap"
              >
                {category.label}
              </a>
            </React.Fragment>
          ))}
        </div>

        {/* Right: Chọn địa điểm */}
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className=" flex font-semibold text-white text-[11px] bg-primary px-3 py-1 rounded whitespace-nowrap">
            Chọn địa điểm
            <ChevronDownIcon className="w-4 h-4 text-white ml-3" />
          </span>
        </button>
      </div>
    </nav>
  );
};

export default CatalogBar;