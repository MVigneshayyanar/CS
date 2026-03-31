import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar } from "lucide-react";

const Progress = ({ value }) => (
  <div className="bg-alt rounded-full overflow-hidden h-2 shadow-inner">
    <div 
      className="bg-gradient-to-r from-[#3aa892] via-[#2a8c78] to-[#1a6b5c] h-full transition-all duration-1000 ease-in-out rounded-full"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export default function LabCard({ lab }) {
  // Balanced gradient
  const gradients = [
    "from-teal-500/5 to-[#2a8c78]/5",
    "from-blue-500/5 to-indigo-500/5",
    "from-amber-500/5 to-orange-500/5",
    "from-rose-500/5 to-pink-500/5",
  ];
  const gradient = gradients[lab.name.charCodeAt(0) % gradients.length];

  const resolveDueDateValue = (labData) => {
    const labLevelDueDate =
      labData?.deadline ||
      labData?.dueDate ||
      labData?.dateDue ||
      labData?.nextDeadline;

    if (labLevelDueDate) return labLevelDueDate;

    const experimentDeadlines = (Array.isArray(labData?.experiments)
      ? labData.experiments
      : []
    )
      .map((exp) => exp?.deadline || exp?.dueDate || exp?.dateDue)
      .filter(Boolean)
      .map((value) => ({ raw: value, date: new Date(value) }))
      .filter(({ date }) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a.date - b.date);

    return experimentDeadlines[0]?.raw || null;
  };

  const rawDueDate = resolveDueDateValue(lab);
  const dueDate = (() => {
    if (!rawDueDate) return "N/A";
    const dateObj = new Date(rawDueDate);
    return Number.isNaN(dateObj.getTime())
      ? String(rawDueDate)
      : dateObj.toLocaleDateString("en-GB");
  })();

  return (
    <Link 
      to={`/labs/experiments?labId=${lab.id}`}
      className="block group h-full"
    >
      <div className={`bg-card rounded-[1.75rem] p-6 border border-theme-light shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden h-full flex flex-col group`}>
        {/* Subtle Decorative Element */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-20 -mr-16 -mt-16 rounded-full group-hover:scale-125 transition-transform duration-1000 ease-out`} />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-1.5 bg-alt px-3 py-1.5 rounded-xl border border-theme-light">
                <Calendar className="w-3.5 h-3.5 text-[#2a8c78]" />
                <span className="text-[9px] font-black uppercase tracking-widest text-[#1a6b5c]">DUE: {dueDate}</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-white border border-theme-light flex items-center justify-center group-hover:bg-[#1a6b5c] transition-all duration-300 transform group-hover:rotate-45">
              <ChevronRight className="w-5 h-5 text-[#1a6b5c] group-hover:text-white" />
            </div>
          </div>

          {/* Title & Info */}
          <div className="mb-6 flex-1">
            <h3 className="text-xl font-black text-heading mb-2 group-hover:text-[#1a6b5c] transition-colors tracking-tight leading-tight">
              {lab.name}
            </h3>
            <p className="text-xs text-body font-bold line-clamp-2 mb-5 leading-relaxed opacity-60">
              Explore the core concepts of {lab.fullName} with hands-on experiments.
            </p>

            <div className="flex flex-wrap gap-2.5">
              <div className="px-3.5 py-1.5 rounded-xl bg-alt border border-theme-light text-[10px] font-black text-[#1a6b5c] uppercase tracking-wider">
                {lab.instructor}
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-alt border border-theme-light text-[10px] font-black text-[#1a6b5c] uppercase tracking-wider">
                {lab.duration}
              </div>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="mt-auto">
            <div className="flex justify-between items-end mb-3">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-wider text-muted opacity-50">Progress</span>
                <span className="text-2xl font-black text-heading tracking-tighter tabular-nums">{lab.progress}<span className="text-sm ml-0.5 opacity-50">%</span></span>
              </div>
            </div>
            <Progress value={lab.progress} />
          </div>
        </div>
      </div>
    </Link>
  );
}