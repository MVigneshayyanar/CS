import React from "react";

const colorMap = {
  teal: {
    num: "text-[#1a6b5c]",
    icon: "text-[#1a6b5c]",
    bg: "bg-[#f0f7f5]",
  },
  emerald: {
    num: "text-emerald-700",
    icon: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  amber: {
    num: "text-amber-700",
    icon: "text-amber-600",
    bg: "bg-amber-50",
  },
  cyan: {
    num: "text-cyan-700",
    icon: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  blue: {
    num: "text-blue-700",
    icon: "text-blue-600",
    bg: "bg-blue-50",
  },
};

const StatCard = ({ value, label, color = "teal", icon: Icon }) => {
  const c = colorMap[color] || colorMap.teal;
  return (
    <div
      className={`group bg-card rounded-2xl border border-theme-light shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5 flex flex-col items-center gap-3 text-center`}
    >
      {Icon && (
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${c.bg} transition-colors group-hover:bg-white`}
        >
          <Icon className={`w-5 h-5 ${c.icon}`} strokeWidth={2.5} />
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <div className={`text-2xl font-black tracking-tight ${c.num} font-mono`}>
          {value}
        </div>
        <div className="text-[10px] text-muted font-bold uppercase tracking-wider opacity-60">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
