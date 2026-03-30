import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, Users, Target, Calendar } from "lucide-react";

const Progress = ({ value }) => (
  <div className="bg-slate-100 rounded-full overflow-hidden h-2">
    <div 
      className="bg-gradient-to-r from-teal-400 to-teal-600 h-full transition-all duration-500 ease-out rounded-full"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
);

export default function LabCard({ lab }) {
  // Generate a random gradient for the card header based on lab name
  const gradients = [
    "from-teal-400 to-emerald-500",
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-pink-500",
    "from-orange-400 to-rose-500",
    "from-cyan-400 to-blue-500"
  ];
  const gradient = gradients[lab.name.charCodeAt(0) % gradients.length];
  const dueDate = (() => {
    if (!lab?.date) return "N/A";
    const dateObj = new Date(lab.date);
    return Number.isNaN(dateObj.getTime())
      ? String(lab.date)
      : dateObj.toLocaleDateString("en-GB");
  })();

  return (
    <Link 
      to={`/labs/experiments?labId=${lab.id}`}
      className="block group"
    >
      <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 relative overflow-hidden h-full flex flex-col">
        {/* Background Accent */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700`} />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-teal-200/50 transform group-hover:rotate-6 transition-transform duration-500`}>
              {lab.name.charAt(0)}
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Due Date</span>
               <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-teal-500" />
                {dueDate}
              </div>
            </div>
          </div>

          {/* Title & Info */}
          <div className="mb-6 flex-1">
            <h3 className="text-xl font-black text-slate-800 mb-2 group-hover:text-teal-600 transition-colors tracking-tight">
              {lab.name}
            </h3>
            <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-4 leading-relaxed">
              Explore the core concepts of {lab.fullName} with hands-on experiments.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-600">
                <Users className="w-3.5 h-3.5 text-teal-500" />
                {lab.instructor}
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 text-[11px] font-bold text-slate-600">
                <Clock className="w-3.5 h-3.5 text-teal-500" />
                {lab.duration}
              </div>
            </div>
          </div>
          
          {/* Progress Section */}
          <div className="mt-auto pt-6 border-t border-slate-50">
            <div className="flex justify-between items-end mb-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Progress</span>
                <span className="text-2xl font-black text-slate-800 leading-none mt-1">{lab.progress}%</span>
              </div>
              <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center group-hover:bg-teal-500 transition-colors duration-300">
                <ChevronRight className="w-5 h-5 text-teal-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
              </div>
            </div>
            <Progress value={lab.progress} />
          </div>
        </div>
      </div>
    </Link>
  );
}