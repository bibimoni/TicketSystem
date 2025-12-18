import React from "react";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
    return (
        <div className="px-10 py-2 flex items-center gap-2 text-xs bg-white shadow-lg">
            <Link
                to="/"
                className="opacity-75 font-medium text-primary cursor-pointer"
            >
                Trang chủ
            </Link>

            <ChevronRightIcon className="w-5 h-5 text-primary" />

            <span className="font-semibold text-primary">
                Thông tin tài khoản
            </span>
        </div>
    );
};

export default Breadcrumb;
