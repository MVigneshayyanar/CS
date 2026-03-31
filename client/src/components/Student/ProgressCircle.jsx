import React from "react";

const colorMap = {
  teal: { stroke: "#1a6b5c", bar: "bg-[#2a8c78]", chip: "bg-[#f0f7f5] text-[#1a6b5c] border-[#dff2ed]" },
  blue: { stroke: "#2563eb", bar: "bg-blue-600", chip: "bg-blue-50 text-blue-700 border-blue-100" },
  emerald: {
    stroke: "#1a6b5c",
    bar: "bg-[#1a6b5c]",
    chip: "bg-[#f0f7f5] text-[#134d42] border-[#dff2ed]",
  },
  amber: {
    stroke: "#d97706",
    bar: "bg-amber-600",
    chip: "bg-amber-50 text-amber-700 border-amber-100",
  },
  purple: {
    stroke: "#7c3aed",
    bar: "bg-purple-600",
    chip: "bg-violet-50 text-violet-700 border-violet-100",
  },
  red: { stroke: "#dc2626", bar: "bg-red-600", chip: "bg-red-50 text-red-700 border-red-100" },
};

const ProgressCircle = ({ percentage, label, color = "teal" }) => {
  const c = colorMap[color] || colorMap.teal;
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4 bg-alt border border-theme-light rounded-2xl p-4 hover:border-[#1a6b5c] transition-all duration-300 group shadow-sm">
      {/* SVG Ring - Scaled Down */}
      <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
        <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }} className="drop-shadow-sm">
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            className="text-slate-100"
            strokeWidth="5"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke={c.stroke}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-black text-heading tracking-tighter">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1.5">
          <h4 className="text-[11px] font-black text-heading leading-tight tracking-tight pr-2">
            {label}
          </h4>
          <span
            className={`text-[8px] font-black px-2 py-1 rounded-full border ${c.chip} uppercase tracking-widest whitespace-nowrap`}
          >
            {percentage}%
          </span>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-2 relative shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-1.5 cubic-bezier(0.4, 0, 0.2, 1) ${c.bar} shadow-teal-500/10`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <p className="text-[9px] text-muted font-bold leading-tight opacity-60 line-clamp-1">
          {percentage >= 100 ? "Completed successfully." : `${100 - percentage}% to completion.`}
        </p>
      </div>
    </div>
  );
};

export default ProgressCircle;
