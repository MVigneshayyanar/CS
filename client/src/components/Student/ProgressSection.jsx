import React from "react";
import { BookOpen } from "lucide-react";
import ProgressCircle from "./ProgressCircle";

const ProgressSection = ({ progressData }) => (
  <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-extrabold text-heading flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#2a8c78]" />
        Laboratory Progress
      </h2>
      <span className="text-xs text-[#1a6b5c] font-semibold cursor-pointer hover:underline">
        View All
      </span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {progressData.map((item, index) => (
        <ProgressCircle
          key={index}
          percentage={item.percentage}
          label={item.label}
          color={item.color}
        />
      ))}
    </div>
  </div>
);

export default ProgressSection;
