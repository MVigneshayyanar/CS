import React from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "text-[#1a6b5c] bg-[#f0f7f5]";
    case "Intermediate":
      return "text-amber-600 bg-amber-50";
    case "Advanced":
      return "text-red-500 bg-red-50";
    default:
      return "text-body bg-alt";
  }
};

const ExperimentRow = ({ experiment }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b border-theme-light last:border-b-0 bg-card hover:bg-[#f0f7f5]/40 transition-colors cursor-pointer group"
      onClick={() => navigate(`/labs/experiments/view?id=${experiment.id}`)}
    >
      <td className="p-4">
        <div className="w-8 h-8 bg-[#f0f7f5] border border-[#dff2ed] rounded-xl flex items-center justify-center">
          <span className="text-[#1a6b5c] font-bold text-xs">{experiment.sno}</span>
        </div>
      </td>
      <td className="p-4">
        <div>
          <h3 className="text-heading font-semibold text-sm group-hover:text-[#134d42] transition-colors">
            {experiment.title}
          </h3>
          <p className="text-muted text-xs mt-1 max-w-md line-clamp-1">{experiment.description}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getDifficultyColor(experiment.difficulty)}`}>
              {experiment.difficulty}
            </span>
            <span className="text-[10px] text-muted">•</span>
            <span className="text-[10px] text-muted">{experiment.estimatedTime}</span>
          </div>
        </div>
      </td>
      <td className="p-4">
        <span className="px-2.5 py-1 bg-alt text-body rounded-lg text-xs font-medium border border-theme">
          {experiment.domain}
        </span>
      </td>
      <td className="p-4">
        <StatusBadge status={experiment.status} />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-1.5 text-muted text-xs">
          <Calendar className="w-3.5 h-3.5" />
          <span>{(() => {
            const d = experiment.dateDue || experiment.deadline || experiment.date;
            if (!d) return 'N/A';
            try {
              const dateObj = new Date(d);
              return isNaN(dateObj.getTime()) ? d : dateObj.toLocaleDateString('en-GB');
            } catch (e) {
              return d;
            }
          })()}</span>
        </div>
      </td>
    </tr>
  );
};

export default ExperimentRow;
