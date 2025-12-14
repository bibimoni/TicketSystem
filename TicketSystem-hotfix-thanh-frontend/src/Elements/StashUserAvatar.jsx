import React from "react";
import vector from "./avatar.png";

export const StashUserAvatar = () => {
  return (
    <div className="relative w-12 h-12 aspect-[1]">
      <img
        className="absolute w-[89.58%] h-[89.58%] top-[35%] left"
        alt="Vector"
        src={vector}
      />
    </div>
  );
};