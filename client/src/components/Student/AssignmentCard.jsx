import React from 'react';
import { Calendar } from 'lucide-react';

const AssignmentCard = ({ title, date, type, icon: Icon }) => (
  <div className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer group ${
    type === 'assigned' 
      ? 'bg-gradient-to-r from-teal-900/20 to-teal-800/20 border-teal-700/30 hover:border-teal-500/50 hover:shadow-teal-500/10' 
      : 'bg-gradient-to-r from-red-900/20 to-red-800/20 border-red-700/30 hover:border-red-500/50 hover:shadow-red-500/10'
  }`}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <div className={`p-2 rounded-lg ${
          type === 'assigned' ? 'bg-teal-600/20' : 'bg-red-600/20'
        }`}>
          <Icon className={`w-4 h-4 ${
            type === 'assigned' ? 'text-teal-400' : 'text-red-400'
          }`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-neutral-200 font-medium text-sm leading-tight group-hover:text-white transition-colors">
            {title}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-neutral-400 text-xs whitespace-nowrap">
        <Calendar className="w-3 h-3" />
        {date}
      </div>
    </div>
  </div>
);

export default AssignmentCard;