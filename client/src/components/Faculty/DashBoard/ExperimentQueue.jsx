import React from "react";

const statusMap = {
  overdue: { bg: "bg-red-50", text: "text-red-600", label: "Overdue" },
  pending: { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
  active: { bg: "bg-[#f0f7f5]", text: "text-[#134d42]", label: "Active" },
  scheduled: { bg: "bg-blue-50", text: "text-blue-700", label: "Scheduled" },
};

const numColors = [
  "bg-blue-50 text-blue-600",
  "bg-violet-50 text-violet-600",
  "bg-[#f0f7f5] text-[#1a6b5c]",
  "bg-amber-50 text-amber-600",
  "bg-[#f0f7f5] text-[#1a6b5c]",
];

const normalizeQueue = (experimentQueueData) => {
  if (Array.isArray(experimentQueueData)) {
    return experimentQueueData;
  }

  if (experimentQueueData && typeof experimentQueueData === "object") {
    const groups = ["active", "pending", "completed"];
    return groups.flatMap((group) =>
      (experimentQueueData[group] || []).map((exp) => ({
        ...exp,
        status: exp.status || group,
        dueDate:
          exp.dueDate || exp.deadline || exp.scheduledDate || exp.completedDate,
        submissionCount: exp.submissionCount ?? exp.submitted ?? exp.count ?? 0,
      })),
    );
  }

  return [];
};

const formatDueDate = (dateValue) => {
  if (!dateValue) return "";
  const dateObj = new Date(dateValue);
  return Number.isNaN(dateObj.getTime())
    ? String(dateValue)
    : dateObj.toLocaleDateString("en-GB");
};

const ExperimentQueue = ({ experimentQueueData = [] }) => {
  const queue = normalizeQueue(experimentQueueData);

  if (queue.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-6">
        No experiments in queue
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {queue.map((exp, i) => {
        const status =
          statusMap[(exp.status || "pending").toLowerCase()] ||
          statusMap.pending;
        return (
          <div
            key={exp.id || i}
            className="flex items-center gap-3 p-3 bg-alt border border-theme-light rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${numColors[i % numColors.length]}`}
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-heading truncate">
                {exp.name || exp.title}
              </p>
              <p className="text-[10px] text-muted mt-0.5 font-medium">
                {exp.class ||
                  (Array.isArray(exp.classes)
                    ? exp.classes.join(", ")
                    : "Class")}
                {exp.dueDate ? ` · Due ${formatDueDate(exp.dueDate)}` : ""}
              </p>
            </div>

            <span
              className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full flex-shrink-0 ${status.bg} ${status.text}`}
            >
              {status.label}
            </span>

            <div className="w-7 h-7 bg-card border border-theme rounded-lg flex items-center justify-center text-[11px] font-extrabold text-body flex-shrink-0 group-hover:border-blue-300 transition-colors">
              {exp.submissionCount ?? 0}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ExperimentQueue;
