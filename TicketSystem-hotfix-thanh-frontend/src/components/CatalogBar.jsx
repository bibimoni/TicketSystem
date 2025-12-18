import React, { useState } from "react";
import { Menu as MenuIcon, ChevronDown as ChevronDownIcon } from "lucide-react";

const categories = [
  { label: "Concert", href: "/search?q=concert" },
  { label: "Văn hóa nghệ thuật", href: "/search?q=van hoa" },
  { label: "Hội thảo", href: "/search?q=hoi thao" },
  { label: "Thể thao", href: "/search?q=the thao" },
];

const CatalogBar = () => {
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
                className="font-semibold text-primary text-xs hover:text-myred transition-all whitespace-nowrap"
              >
                {category.label}
              </a>
            </React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CatalogBar;