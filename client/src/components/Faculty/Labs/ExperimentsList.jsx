import React from "react";
import { X, BookOpen, FlaskConical } from "lucide-react";

const ExperimentsList = ({
  experiments,
  selectedSubject,
  onClose,
  onViewLabManual,
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-card rounded-2xl border border-theme-light shadow-2xl w-[680px] max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-theme-light">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#f0f7f5] rounded-lg flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-[#2a8c78]" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-heading">
              All Experiments
            </h2>
            <p className="text-xs text-muted mt-0.5">
              {selectedSubject?.name}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-alt rounded-lg flex items-center justify-center hover:bg-alt transition-colors"
        >
          <X className="w-4 h-4 text-body" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-5 space-y-2">
        {experiments.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">
            No experiments found.
          </p>
        ) : (
          experiments.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between px-4 py-3.5 bg-alt rounded-xl border border-theme-light hover:border-[#c2e6de] hover:bg-[#f0f7f5]/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#f0f7f5] rounded-lg flex items-center justify-center text-xs font-extrabold text-[#1a6b5c]">
                  {String(exp.number).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-xs font-bold text-heading">
                    Experiment {exp.number}: {exp.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onViewLabManual(exp)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
              >
                <BookOpen className="w-3 h-3" />
                View Lab Manual
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default ExperimentsList;
