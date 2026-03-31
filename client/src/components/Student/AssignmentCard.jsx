import React from "react";
import { Calendar, Clock } from "lucide-react";

const AssignmentCard = ({ title, date, timeRange, type, icon: Icon }) => {
  const isLive = type === "live";
  const isUpcoming = type === "upcoming";

  const bgClass = isLive
    ? "bg-emerald-50 border-emerald-100 hover:border-emerald-300"
    : isUpcoming
      ? "bg-blue-50 border-blue-100 hover:border-blue-300"
      : "bg-teal-50 border-teal-100 hover:border-teal-300";

  const iconBgClass = isLive
    ? "bg-emerald-100"
    : isUpcoming
      ? "bg-blue-100"
      : "bg-teal-100";

  const iconTextClass = isLive
    ? "text-emerald-600"
    : isUpcoming
      ? "text-blue-600"
      : "text-teal-600";

  const titleTextClass = isLive
    ? "text-emerald-900"
    : isUpcoming
      ? "text-blue-900"
      : "text-teal-900";

  const badgeBgClass = isLive
    ? "bg-emerald-100 text-emerald-700"
    : isUpcoming
      ? "bg-blue-100 text-blue-700"
      : "bg-teal-100 text-teal-700";

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all group ${bgClass}`}
    >
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClass}`}
      >
        <Icon className={`w-3.5 h-3.5 ${iconTextClass}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-semibold truncate ${titleTextClass}`}>
          {title}
        </p>
        {timeRange && (
          <p className={`text-[10px] mt-0.5 flex items-center gap-1 ${isLive ? "text-emerald-600" : "text-blue-500"}`}>
            <Clock className="w-2.5 h-2.5" />
            {timeRange}
          </p>
        )}
      </div>
      <div
        className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${badgeBgClass}`}
      >
        <Calendar className="w-2.5 h-2.5" />
        {date}
      </div>
    </div>
  );
};

export default AssignmentCard;
