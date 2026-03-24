import React from "react";
import { Calendar } from "lucide-react";

const AssignmentCard = ({ title, date, type, icon: Icon }) => {
  const isAssigned = type === "assigned";
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all group ${
        isAssigned
          ? "bg-teal-50 border-teal-100 hover:border-teal-300"
          : "bg-red-50 border-red-100 hover:border-red-300"
      }`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isAssigned ? "bg-teal-100" : "bg-red-100"
        }`}
      >
        <Icon
          className={`w-3.5 h-3.5 ${isAssigned ? "text-teal-600" : "text-red-500"}`}
        />
      </div>
      <p
        className={`flex-1 text-xs font-semibold min-w-0 truncate ${
          isAssigned ? "text-teal-900" : "text-red-900"
        }`}
      >
        {title}
      </p>
      <div
        className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
          isAssigned ? "bg-teal-100 text-teal-700" : "bg-red-100 text-red-600"
        }`}
      >
        <Calendar className="w-2.5 h-2.5" />
        {date}
      </div>
    </div>
  );
};

export default AssignmentCard;
