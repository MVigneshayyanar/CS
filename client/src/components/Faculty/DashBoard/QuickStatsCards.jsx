import React from "react";

/**
 * QuickStatsCards
 * statsData: array of { title, value, icon (JSX), iconBg, numColor, trend, trendBg, trendColor, barColor, barWidth }
 */
const QuickStatsCards = ({ statsData = [] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {statsData.map((s, i) => (
      <div
        key={i}
        className="bg-card rounded-2xl border border-theme-light shadow-sm p-5"
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg || "bg-[#f0f7f5]"}`}
          >
            {s.icon}
          </div>
          {s.trend && (
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.trendBg || "bg-[#f0f7f5]"} ${s.trendColor || "text-[#134d42]"}`}
            >
              {s.trend}
            </span>
          )}
        </div>
        <div
          className={`text-3xl font-extrabold leading-none mb-1 ${s.numColor || "text-[#1a6b5c]"}`}
        >
          {s.value}
        </div>
        <div className="text-xs text-muted font-semibold mb-3">
          {s.title}
        </div>
        <div className="h-1 bg-alt rounded-full overflow-hidden">
          <div
            className={`h-1 rounded-full transition-all duration-700 ${s.barColor || "bg-[#3aa892]"}`}
            style={{ width: s.barWidth || "0%" }}
          />
        </div>
      </div>
    ))}
  </div>
);

export default QuickStatsCards;
