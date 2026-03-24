import React from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "text-emerald-600 bg-emerald-50";
    case "Intermediate":
      return "text-amber-600 bg-amber-50";
    case "Advanced":
      return "text-red-500 bg-red-50";
    default:
      return "text-slate-500 bg-slate-50";
  }
};

const ExperimentRow = ({ experiment }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b border-slate-100 last:border-b-0 bg-white hover:bg-teal-50/40 transition-colors cursor-pointer group"
      onClick={() => navigate(`/labs/experiments/view?id=${experiment.id}`)}
    >
      <td className="p-4">
        <div className="w-8 h-8 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center">
          <span className="text-teal-600 font-bold text-xs">{experiment.sno}</span>
        </div>
      </td>
      <td className="p-4">
        <div>
          <h3 className="text-slate-800 font-semibold text-sm group-hover:text-teal-700 transition-colors">
            {experiment.title}
          </h3>
          <p className="text-slate-400 text-xs mt-1 max-w-md line-clamp-1">{experiment.description}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(experiment.difficulty)}`}>
              {experiment.difficulty}
            </span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className="text-[10px] text-slate-400">{experiment.estimatedTime}</span>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-medium border border-slate-200">
          {experiment.domain}
        </span>
      </td>
      <td className="p-4">
        <StatusBadge status={experiment.status} />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>{new Date(experiment.dateDue).toLocaleDateString()}</span>
        </div>
      </td>
    </tr>
  );
};

export default ExperimentRow;
