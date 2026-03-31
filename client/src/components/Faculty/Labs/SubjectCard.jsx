import React from "react";
import {
  BookOpen,
  Building2,
  Users,
  FlaskConical,
  ChevronRight,
} from "lucide-react";

const SubjectCard = ({
  subject,
  totalClasses,
  totalStudents,
  totalExperiments,
  avgCompletion,
  avgScore,
  pendingLabs,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="bg-card rounded-2xl border border-theme-light shadow-sm hover:border-[#5c9088] hover:shadow-md transition-all duration-200 cursor-pointer group p-5 mb-3"
  >
    <div className="flex items-center justify-between">
      <div className="flex-1 min-w-0">
        {/* Top row: icon + name + arrow */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-[#f0f7f5] rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-[#1a6b5c]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-heading group-hover:text-[#134d42] transition-colors truncate">
              {subject}
            </h3>
            <p className="text-xs text-muted font-medium mt-0.5">
              Lab module
            </p>
          </div>
        </div>

        {/* Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-[#f0f7f5] text-[#134d42]">
            <Building2 className="w-3 h-3" />
            {totalClasses} {totalClasses === 1 ? "class" : "classes"}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
            <Users className="w-3 h-3" />
            {totalStudents} students
          </span>
          {totalExperiments != null && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-700">
              <FlaskConical className="w-3 h-3" />
              {totalExperiments} experiments
            </span>
          )}
        </div>

        {/* Stats mini-row */}
        {(avgCompletion != null || avgScore != null || pendingLabs != null) && (
          <div className="flex gap-3">
            {avgCompletion != null && (
              <div className="bg-alt rounded-xl px-3 py-2 text-center border border-theme-light">
                <div className="text-base font-extrabold text-[#1a6b5c]">
                  {avgCompletion}%
                </div>
                <div className="text-[10px] text-muted font-semibold mt-0.5">
                  Avg Completion
                </div>
              </div>
            )}
            {avgScore != null && (
              <div className="bg-alt rounded-xl px-3 py-2 text-center border border-theme-light">
                <div className="text-base font-extrabold text-blue-600">
                  {avgScore}%
                </div>
                <div className="text-[10px] text-muted font-semibold mt-0.5">
                  Avg Score
                </div>
              </div>
            )}
            {pendingLabs != null && (
              <div className="bg-alt rounded-xl px-3 py-2 text-center border border-theme-light">
                <div className="text-base font-extrabold text-amber-500">
                  {pendingLabs}
                </div>
                <div className="text-[10px] text-muted font-semibold mt-0.5">
                  Pending Labs
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Arrow */}
      <div className="w-8 h-8 bg-[#f0f7f5] rounded-xl flex items-center justify-center ml-4 flex-shrink-0 group-hover:bg-[#dff2ed] transition-colors">
        <ChevronRight className="w-4 h-4 text-[#1a6b5c]" />
      </div>
    </div>
  </div>
);

export default SubjectCard;
