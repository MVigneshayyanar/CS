import React from "react";
import { Radio, Calendar, BookOpen, Clock } from "lucide-react";
import AssignmentCard from "./AssignmentCard";

const AssignmentsSection = ({ assignedTasks, upcomingTasks }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
    {/* Live Now */}
    <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5 lg:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#f0f7f5] flex items-center justify-center relative shadow-sm">
          <Radio className="w-5 h-5 text-[#1a6b5c]" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2a8c78] rounded-full border-2 border-white animate-pulse" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-extrabold text-heading tracking-tight leading-none mb-1">
            Live Now
          </h3>
          <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60">Active experiments</p>
        </div>
        <span className="text-[10px] font-extrabold bg-[#f0f7f5] text-[#1a6b5c] px-3 py-1 rounded-full border border-theme-light">
          {assignedTasks.length} Active
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {assignedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 opacity-40">
            <Radio className="w-6 h-6 mb-1.5" />
            <p className="text-[10px] font-bold uppercase tracking-widest">No live tasks</p>
          </div>
        ) : (
          assignedTasks.map((task, i) => (
            <AssignmentCard
              key={i}
              title={task.title}
              date={task.date}
              timeRange={task.timeRange}
              labId={task.labId}
              type="live"
              icon={BookOpen}
            />
          ))
        )}
      </div>
    </div>

    {/* Expired Experiments */}
    <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5 lg:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center relative shadow-sm">
          <Clock className="w-5 h-5 text-rose-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-extrabold text-heading tracking-tight leading-none mb-1">
            Overdue
          </h3>
          <p className="text-[9px] text-muted font-bold uppercase tracking-widest opacity-60">Passed deadlines</p>
        </div>
        <span className="text-[10px] font-extrabold bg-rose-50 text-rose-500 px-3 py-1 rounded-full border border-rose-100">
          {upcomingTasks.length} Overdue
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {upcomingTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 opacity-40">
            <Clock className="w-6 h-6 mb-1.5" />
            <p className="text-[10px] font-bold uppercase tracking-widest">No pending tasks</p>
          </div>
        ) : (
          upcomingTasks.map((task, i) => (
            <AssignmentCard
              key={i}
              title={task.title}
              date={task.date}
              timeRange={task.timeRange}
              labId={task.labId}
              type="expired"
              icon={Clock}
            />
          ))
        )}
      </div>
    </div>
  </div>
);

export default AssignmentsSection;
