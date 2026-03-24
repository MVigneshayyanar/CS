import React from "react";
import { Clock, AlertCircle, BookOpen } from "lucide-react";
import AssignmentCard from "./AssignmentCard";

const AssignmentsSection = ({ assignedTasks, incompleteTasks }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Assigned */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
          <Clock className="w-4 h-4 text-teal-600" />
        </div>
        <h3 className="text-sm font-extrabold text-slate-800 flex-1">
          Assigned for Now
        </h3>
        <span className="text-[11px] font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
          {assignedTasks.length} Tasks
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {assignedTasks.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            No tasks assigned right now
          </p>
        ) : (
          assignedTasks.map((task, i) => (
            <AssignmentCard
              key={i}
              title={task.title}
              date={task.date}
              type="assigned"
              icon={BookOpen}
            />
          ))
        )}
      </div>
    </div>

    {/* Incomplete */}
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-red-500" />
        </div>
        <h3 className="text-sm font-extrabold text-slate-800 flex-1">
          Not Completed
        </h3>
        <span className="text-[11px] font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full">
          {incompleteTasks.length} Tasks
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {incompleteTasks.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-6">
            All caught up!
          </p>
        ) : (
          incompleteTasks.map((task, i) => (
            <AssignmentCard
              key={i}
              title={task.title}
              date={task.date}
              type="incomplete"
              icon={AlertCircle}
            />
          ))
        )}
      </div>
    </div>
  </div>
);

export default AssignmentsSection;
