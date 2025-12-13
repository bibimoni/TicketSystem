import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon } from "lucide-react";

const BackButton = ({ className, label = "Trở về" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${className}`}
    >
      <div className="w-[25px] h-[25px] bg-primary rounded-full flex items-center justify-center">
        <ChevronLeftIcon className="text-white" />
      </div>
      <span className="font-semibold text-primary text-base">{label}</span>
    </button>
  );
};

export default BackButton;
