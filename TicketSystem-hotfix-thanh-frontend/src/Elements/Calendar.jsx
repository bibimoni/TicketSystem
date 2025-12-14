import React from "react";
import calendar from "./calendar.png";

export const Calendar = () => {
  return (
    <div className="relative w-8 h-8 aspect-[1]">
      <img
        className="h-[90%] top-[30%] left-[43.75%] absolute w-[85%]"
        alt="Calendar"
        src={calendar}
      />
    </div>
  );
};
