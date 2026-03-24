import React from "react";

const colorMap = {
  teal: { stroke: "#0d9488", bar: "#0d9488", chip: "bg-teal-50 text-teal-700" },
  blue: { stroke: "#3b82f6", bar: "#3b82f6", chip: "bg-blue-50 text-blue-700" },
  emerald: {
    stroke: "#10b981",
    bar: "#10b981",
    chip: "bg-emerald-50 text-emerald-700",
  },
  amber: {
    stroke: "#f59e0b",
    bar: "#f59e0b",
    chip: "bg-amber-50 text-amber-700",
  },
  purple: {
    stroke: "#8b5cf6",
    bar: "#8b5cf6",
    chip: "bg-violet-50 text-violet-700",
  },
  red: { stroke: "#ef4444", bar: "#ef4444", chip: "bg-red-50 text-red-700" },
};

const ProgressCircle = ({ percentage, label, color = "teal" }) => {
  const c = colorMap[color] || colorMap.teal;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:border-teal-200 transition-all">
      {/* SVG Ring */}
      <div className="relative flex-shrink-0">
        <svg width="72" height="72" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="36"
            cy="36"
            r={radius}
            stroke="#e2e8f0"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="36"
            cy="36"
            r={radius}
            stroke={c.stroke}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-extrabold text-slate-800 leading-none">
            {percentage}%
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5">done</span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-700 mb-2 leading-snug">
          {label}
        </p>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden mb-2">
          <div
            className="h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${percentage}%`, background: c.bar }}
          />
        </div>
        <span
          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${c.chip}`}
        >
          {percentage}% Complete
        </span>
      </div>
    </div>
  );
};

export default ProgressCircle;
