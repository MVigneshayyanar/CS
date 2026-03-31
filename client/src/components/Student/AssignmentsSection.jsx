import React from "react";
import { Radio, Calendar, BookOpen, Clock } from "lucide-react";
import AssignmentCard from "./AssignmentCard";

const AssignmentsSection = ({ assignedTasks, upcomingTasks }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Live Now */}
    <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-[#f0f7f5] flex items-center justify-center relative">
          <Radio className="w-4 h-4 text-[#1a6b5c]" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2a8c78] rounded-full border-2 border-white animate-pulse" />
        </div>
        <h3 className="text-sm font-extrabold text-heading flex-1">
          Live Now
        </h3>
        <span className="text-[11px] font-bold bg-[#f0f7f5] text-[#134d42] px-3 py-1 rounded-full">
          {assignedTasks.length} {assignedTasks.length === 1 ? "Task" : "Tasks"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {assignedTasks.length === 0 ? (
          <p className="text-muted text-sm text-center py-6">
            No experiments are live right now
          </p>
        ) : (
          assignedTasks.map((task, i) => (
            <AssignmentCard
              key={i}
              title={task.title}
              date={task.date}
              timeRange={task.timeRange}
              type="live"
              icon={BookOpen}
            />
          ))
        )}
      </div>
    </div>

    {/* Upcoming Labs */}
    <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-sm font-extrabold text-heading flex-1">
          Upcoming Labs
        </h3>
        <span className="text-[11px] font-bold bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          {upcomingTasks.length} {upcomingTasks.length === 1 ? "Lab" : "Labs"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {upcomingTasks.length === 0 ? (
          <p className="text-muted text-sm text-center py-6">
            No upcoming labs scheduled
          </p>
        ) : (
          upcomingTasks.map((task, i) => (
            <AssignmentCard
              key={i}
              title={task.title}
              date={task.date}
              timeRange={task.timeRange}
              type="upcoming"
              icon={Clock}
            />
          ))
        )}
      </div>
    </div>
  </div>
);

export default AssignmentsSection;
