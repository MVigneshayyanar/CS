import React from "react";
import { Link } from "react-router-dom";
import { Target, TrendingUp, ChevronRight } from "lucide-react";
import ProgressCircle from "./ProgressCircle";

const ProgressSection = ({ progressData }) => (
  <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-6 lg:p-7 transition-all duration-300 hover:shadow-md">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#f0f7f5] flex items-center justify-center shadow-sm">
          <Target className="w-5 h-5 text-[#2a8c78]" />
        </div>
        <div>
          <h2 className="text-sm font-extrabold text-heading tracking-tight leading-none mb-1">
            Learning Progress
          </h2>
          <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60">Active curriculums</p>
        </div>
      </div>
      <Link 
        to="/labs"
        className="text-[10px] font-extrabold text-[#1a6b5c] uppercase tracking-widest hover:underline px-3 py-1.5 bg-alt rounded-lg transition-all flex items-center gap-1.5">
        View All <ChevronRight className="w-3 h-3" />
      </Link>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
      {progressData.map((item, index) => (
        <ProgressCircle
          key={index}
          percentage={item.percentage}
          label={item.label}
          color={item.color}
        />
      ))}
      {!progressData.length && (
        <div className="col-span-full py-8 flex flex-col items-center justify-center opacity-30 grayscale">
          <TrendingUp className="w-8 h-8 mb-2" />
          <p className="text-[10px] font-bold uppercase tracking-widest">No data recorded</p>
        </div>
      )}
    </div>
  </div>
);

export default ProgressSection;
