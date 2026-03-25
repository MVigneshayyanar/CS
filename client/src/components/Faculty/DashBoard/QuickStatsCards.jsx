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
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg || "bg-teal-50"}`}
          >
            {s.icon}
          </div>
          {s.trend && (
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${s.trendBg || "bg-teal-50"} ${s.trendColor || "text-teal-700"}`}
            >
              {s.trend}
            </span>
          )}
        </div>
        <div
          className={`text-3xl font-extrabold leading-none mb-1 ${s.numColor || "text-teal-600"}`}
        >
          {s.value}
        </div>
        <div className="text-xs text-slate-400 font-semibold mb-3">
          {s.title}
        </div>
        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-1 rounded-full transition-all duration-700 ${s.barColor || "bg-teal-400"}`}
            style={{ width: s.barWidth || "0%" }}
          />
        </div>
      </div>
    ))}
  </div>
);

export default QuickStatsCards;
