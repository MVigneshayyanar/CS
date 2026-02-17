import React from "react";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "text-green-400";
    case "Intermediate":
      return "text-yellow-400";
    case "Advanced":
      return "text-red-400";
    default:
      return "text-neutral-400";
  }
};

const ExperimentRow = ({ experiment }) => {
  const navigate = useNavigate();

  return (
    <tr
      className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors cursor-pointer"
      onClick={() => navigate(`/labs/experiments/view?id=${experiment.id}`)}
    >
      <td className="p-6">
        <div className="w-8 h-8 bg-teal-600/20 rounded-lg flex items-center justify-center">
          <span className="text-teal-400 font-semibold text-sm">{experiment.sno}</span>
        </div>
      </td>
      <td className="p-6">
        <div>
          <h3 className="text-white font-semibold hover:text-teal-300 transition-colors">
            {experiment.title}
          </h3>
          <p className="text-neutral-400 text-sm mt-1 max-w-md">{experiment.description}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
            <span className={`font-medium ${getDifficultyColor(experiment.difficulty)}`}>
              {experiment.difficulty}
            </span>
            <span>•</span>
            <span>{experiment.estimatedTime}</span>
          </div>
        </div>
      </td>
      <td className="p-6">
        <span className="px-3 py-1 bg-neutral-700/50 text-neutral-300 rounded-lg text-sm font-medium">
          {experiment.domain}
        </span>
      </td>
      <td className="p-6">
        <StatusBadge status={experiment.status} />
      </td>
      <td className="p-6">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <Calendar className="w-4 h-4" />
          <span>{new Date(experiment.dateDue).toLocaleDateString()}</span>
        </div>
      </td>
    </tr>
  );
};

export default ExperimentRow;
