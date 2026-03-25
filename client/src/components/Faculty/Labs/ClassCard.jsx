import React from "react";
import { Building2, Users, FlaskConical, ChevronRight } from "lucide-react";

const ClassCard = ({
  className,
  section,
  students,
  experiments,
  completionRate,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group p-5 mb-3"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
            {className}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">{section}</p>
        </div>
      </div>
      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
        Active
      </span>
    </div>

    {/* Chips */}
    <div className="flex flex-wrap gap-2 mb-4">
      <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
        <Users className="w-3 h-3" />
        {students} students
      </span>
      <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700">
        <FlaskConical className="w-3 h-3" />
        {experiments} experiments
      </span>
    </div>

    {/* Progress bar */}
    <div>
      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
        <span>Class Average</span>
        <span className="text-blue-600">{completionRate}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-2 rounded-full bg-blue-500 transition-all duration-700"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>

    {/* Arrow hint */}
    <div className="flex justify-end mt-3">
      <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
      </div>
    </div>
  </div>
);

export default ClassCard;
