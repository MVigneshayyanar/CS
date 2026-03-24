import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, BarChart, ChevronRight } from "lucide-react";
import StatusBadge from "./StatusBadge";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "text-emerald-500 bg-emerald-50 border-emerald-100";
    case "Intermediate":
      return "text-amber-500 bg-amber-50 border-amber-100";
    case "Advanced":
      return "text-rose-500 bg-rose-50 border-rose-100";
    default:
      return "text-slate-500 bg-slate-50 border-slate-100";
  }
};

const ExperimentCard = ({ experiment }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/labs/experiments/view?id=${experiment.id}`)}
      className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer relative overflow-hidden"
    >
      {/* Status Overlay for Completed */}
      {experiment.status === 'completed' && (
        <div className="absolute top-0 right-0 p-4">
           <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg">
             <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
             </svg>
           </div>
        </div>
      )}

      <div className="flex flex-col h-full">
        {/* Header Tags */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${getDifficultyColor(experiment.difficulty)}`}>
            {experiment.difficulty}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-auto bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <Clock className="w-3 h-3 text-teal-500" />
            {experiment.estimatedTime}
          </div>
        </div>

        {/* Title & Domain */}
        <div className="mb-6">
          <div className="text-[10px] font-bold text-teal-600 uppercase tracking-tighter mb-1.5">{experiment.domain}</div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-teal-600 transition-colors leading-tight mb-2">
            {experiment.title}
          </h3>
          <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed">
            {experiment.description}
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Due Date</span>
              <div className="flex items-center gap-1.5 mt-1 text-slate-700 font-bold text-xs">
                <Calendar className="w-3.5 h-3.5 text-teal-500" />
                {new Date(experiment.dateDue).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Status</span>
               <StatusBadge status={experiment.status} />
            </div>
          </div>
          
          {/* Action button */}
          <div className="mt-6 flex items-center justify-between group-hover:bg-teal-50 rounded-2xl p-2 transition-all duration-300">
             <div className="flex -space-x-2 overflow-hidden ml-1">
                <div className="w-6 h-6 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-teal-600">JS</div>
                <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-blue-600">PY</div>
             </div>
             <div className="flex items-center gap-2 text-xs font-black text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 transform duration-500">
               Start Experiment
               <div className="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
                 <ChevronRight className="w-4 h-4 text-white" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentCard;
