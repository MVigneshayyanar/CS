import React from 'react';
import { Clock, AlertCircle, BookOpen } from 'lucide-react';
import AssignmentCard from './AssignmentCard';

const AssignmentsSection = ({ assignedTasks, incompleteTasks }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Current Assignments */}
    <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800/50 hover:border-teal-500/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-teal-600/20 rounded-lg">
          <Clock className="w-5 h-5 text-teal-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Assigned for Now</h3>
        <div className="ml-auto bg-teal-600/20 text-teal-300 px-3 py-1 rounded-full text-xs font-medium">
          {assignedTasks.length} Tasks
        </div>
      </div>
      
      <div className="space-y-3">
        {assignedTasks.map((task, index) => (
          <AssignmentCard
            key={index}
            title={task.title}
            date={task.date}
            type="assigned"
            icon={BookOpen}
          />
        ))}
      </div>
    </div>

    {/* Incomplete Assignments */}
    <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-neutral-800/50 hover:border-red-500/30 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-600/20 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Not Completed</h3>
        <div className="ml-auto bg-red-600/20 text-red-300 px-3 py-1 rounded-full text-xs font-medium">
          {incompleteTasks.length} Task
        </div>
      </div>
      
      <div className="space-y-3">
        {incompleteTasks.map((task, index) => (
          <AssignmentCard
            key={index}
            title={task.title}
            date={task.date}
            type="incomplete"
            icon={AlertCircle}
          />
        ))}
      </div>
    </div>
  </div>
);

export default AssignmentsSection;