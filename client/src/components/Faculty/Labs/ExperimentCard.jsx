import React from "react";
import { CheckCircle2, Star, ChevronRight, Calendar } from "lucide-react";

const ExperimentCard = ({
  experimentName,
  experimentNumber,
  completedBy,
  totalStudents,
  avgScore,
  dueDate,
  onClick,
}) => {
  const pct =
    totalStudents > 0 ? Math.round((completedBy / totalStudents) * 100) : 0;
  const isLow = pct < 50;

  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group p-4 mb-3 flex items-center gap-4 ${
        isLow
          ? "border-red-100 hover:border-red-300"
          : "border-theme-light hover:border-[#5c9088]"
      }`}
    >
      {/* Number badge */}
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold flex-shrink-0 ${
          isLow ? "bg-red-50 text-red-500" : "bg-[#f0f7f5] text-[#134d42]"
        }`}
      >
        {String(experimentNumber).padStart(2, "0")}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-extrabold text-heading mb-2 truncate group-hover:text-[#134d42] transition-colors">
          Exp {experimentNumber}: {experimentName}
        </h3>
        <div className="flex flex-wrap gap-2 mb-2.5">
          <span
            className={`flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              isLow ? "bg-red-50 text-red-600" : "bg-[#f0f7f5] text-[#134d42]"
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            {completedBy}/{totalStudents} completed
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            <Star className="w-3 h-3" />
            Avg: {avgScore}%
          </span>
          {dueDate && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-alt text-body border border-theme-light">
              <Calendar className="w-3 h-3" />
              Due: {new Date(dueDate).toLocaleDateString("en-GB")}
            </span>
          )}
        </div>
        {/* Progress */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-1.5 bg-alt rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all duration-700 ${isLow ? "bg-red-400" : "bg-[#2a8c78]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className={`text-[11px] font-extrabold flex-shrink-0 ${isLow ? "text-red-500" : "text-[#1a6b5c]"}`}
          >
            {pct}%
          </span>
        </div>
      </div>

      {/* Arrow */}
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
          isLow
            ? "bg-red-50 group-hover:bg-red-100"
            : "bg-[#f0f7f5] group-hover:bg-[#dff2ed]"
        }`}
      >
        <ChevronRight
          className={`w-3.5 h-3.5 ${isLow ? "text-red-400" : "text-[#1a6b5c]"}`}
        />
      </div>
    </div>
  );
};

export default ExperimentCard;
