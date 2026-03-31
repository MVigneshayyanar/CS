import React from "react";

const colorMap = {
  teal: {
    num: "text-[#1a6b5c]",
    iconBg: "bg-[#f0f7f5]",
    border: "border-[#dff2ed]",
  },
  emerald: {
    num: "text-[#1a6b5c]",
    iconBg: "bg-[#f0f7f5]",
    border: "border-[#dff2ed]",
  },
  amber: {
    num: "text-amber-500",
    iconBg: "bg-amber-50",
    border: "border-amber-100",
  },
  cyan: {
    num: "text-[#1a6b5c]",
    iconBg: "bg-[#f0f7f5]",
    border: "border-[#dff2ed]",
  },
  blue: {
    num: "text-blue-600",
    iconBg: "bg-blue-50",
    border: "border-blue-100",
  },
  red: { num: "text-red-500", iconBg: "bg-red-50", border: "border-red-100" },
};

const StatCard = ({ value, label, color = "teal", icon: Icon }) => {
  const c = colorMap[color] || colorMap.teal;
  return (
    <div
      className={`bg-card rounded-2xl border ${c.border} shadow-sm p-4 flex flex-col items-center gap-2 text-center`}
    >
      {Icon && (
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.iconBg}`}
        >
          <Icon className={`w-5 h-5 ${c.num}`} />
        </div>
      )}
      <div className={`text-3xl font-extrabold leading-none ${c.num}`}>
        {value}
      </div>
      <div className="text-xs text-muted font-semibold">{label}</div>
    </div>
  );
};

export default StatCard;
