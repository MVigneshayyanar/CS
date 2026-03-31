import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ChevronRight } from "lucide-react";

const AssignmentCard = ({ title, date, timeRange, type, icon: Icon, labId }) => {
  const isLive = type === "live";
  const isExpired = type === "expired";

  const themeClasses = isLive
    ? {
        container: "bg-[#f0f7f5] border-[#dff2ed] hover:border-[#1a6b5c]",
        iconContainer: "bg-[#dff2ed] text-[#1a6b5c]",
        badge: "bg-[#dff2ed] text-[#134d42]",
        title: "text-teal-900",
        subtext: "text-[#1a6b5c]/70",
      }
    : isExpired
    ? {
        container: "bg-rose-50 border-rose-100 hover:border-rose-300",
        iconContainer: "bg-rose-100 text-rose-600",
        badge: "bg-rose-100 text-rose-700",
        title: "text-rose-900",
        subtext: "text-rose-600/70",
      }
    : {
        container: "bg-alt border-theme-light hover:border-[#1a6b5c]",
        iconContainer: "bg-white text-muted",
        badge: "bg-white text-muted",
        title: "text-heading",
        subtext: "text-muted",
      };

  const toUrl = labId ? `/labs/experiments?labId=${labId}` : "/labs";

  return (
    <Link 
      to={toUrl}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all duration-300 group ${themeClasses.container}`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 duration-300 ${themeClasses.iconContainer}`}
      >
        <Icon className="w-4 h-4" strokeWidth={2.5} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className={`text-[11px] font-extrabold truncate tracking-tight ${themeClasses.title}`}>
          {title}
        </p>
        {timeRange && (
          <p className={`text-[9px] mt-0.5 flex items-center gap-1 font-bold uppercase tracking-wider ${themeClasses.subtext}`}>
            <Clock className="w-2.5 h-2.5" />
            {timeRange}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          className={`flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${themeClasses.badge}`}
        >
          <Calendar className="w-2.5 h-2.5" />
          {date}
        </div>
        <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${themeClasses.subtext}`} />
      </div>
    </Link>
  );
};

export default AssignmentCard;
