import React from "react";
import { FileText, Clock, ChevronRight } from "lucide-react";

const dotColors = [
  "bg-teal-500",
  "bg-blue-500",
  "bg-amber-400",
  "bg-violet-500",
  "bg-red-400",
];
const badgeMap = {
  high: "bg-red-50 text-red-600",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-slate-100 text-slate-500",
};

const buildRecentText = (act) => {
  if (act.description || act.text) {
    return act.description || act.text;
  }

  if (act.type === "submission") {
    return `${act.student} submitted ${act.experiment}`;
  }
  if (act.type === "grade") {
    return `Graded ${act.student}'s ${act.experiment}`;
  }
  if (act.type === "question") {
    return `${act.student} asked about ${act.experiment}`;
  }
  if (act.type === "late") {
    return `${act.student} has overdue ${act.experiment}`;
  }

  return "Activity update";
};

const normalizeRecentActivities = (recentActivitiesProp = []) =>
  recentActivitiesProp.map((act) => ({
    description: buildRecentText(act),
    class: act.class || act.className || "Class",
    time: act.time || "just now",
  }));

const normalizePendingActions = (pendingActionsProp = []) =>
  pendingActionsProp.map((action) => ({
    description:
      action.description || action.text || action.title || "Pending action",
    priority: (action.priority || "low").toLowerCase(),
  }));

const ActivitySidebar = ({
  recentActivitiesProp = [],
  pendingActionsProp = [],
  showPendingActions = true,
}) => {
  const recentActivities = normalizeRecentActivities(recentActivitiesProp);
  const pendingActions = normalizePendingActions(pendingActionsProp);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <span className="text-xs font-extrabold text-slate-800">
              Recent Activity
            </span>
          </div>
          <button className="text-[10px] font-bold text-teal-600 hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-0">
          {recentActivities.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">
              No recent activity
            </p>
          ) : (
            recentActivities.map((act, i) => (
              <div
                key={i}
                className="flex gap-3 py-2.5 border-b border-slate-50 last:border-0 last:pb-0"
              >
                <div
                  className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${dotColors[i % dotColors.length]}`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-snug">
                    {act.description}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {act.class} · {act.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showPendingActions && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <span className="text-xs font-extrabold text-slate-800">
              Pending Actions
            </span>
          </div>

          <div className="space-y-2">
            {pendingActions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">
                All caught up!
              </p>
            ) : (
              pendingActions.map((action, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                >
                  <div className="w-7 h-7 bg-white rounded-lg border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                  </div>
                  <p className="flex-1 text-[11px] font-semibold text-slate-600 leading-tight">
                    {action.description}
                  </p>
                  <span
                    className={`text-[9.5px] font-extrabold px-2 py-1 rounded-full flex-shrink-0 ${badgeMap[action.priority] || badgeMap.low}`}
                  >
                    {action.priority || "low"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitySidebar;
