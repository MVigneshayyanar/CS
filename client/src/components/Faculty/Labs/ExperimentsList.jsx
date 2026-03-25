import React from "react";
import { X, BookOpen, FlaskConical } from "lucide-react";

const ExperimentsList = ({
  experiments,
  selectedSubject,
  onClose,
  onViewLabManual,
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-[680px] max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
            <FlaskConical className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              All Experiments
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedSubject?.name}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-5 space-y-2">
        {experiments.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            No experiments found.
          </p>
        ) : (
          experiments.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-xs font-extrabold text-indigo-600">
                  {String(exp.number).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
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
