import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, Users, Target, Calendar } from "lucide-react";
import Progress from "./Progress";

export default function LabCard({ lab }) {
  return (
    <Link 
      to={`/labs/experiments?lab=${encodeURIComponent(lab.name)}`}
      className="block"
    >
      <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/50 hover:border-teal-500/50 hover:bg-neutral-800/50 transition-all duration-300 group cursor-pointer">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="p-3 rounded-lg bg-gradient-to-br from-teal-600/20 to-teal-500/10 border border-teal-500/20">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-500 rounded-lg flex items-center justify-center text-sm font-bold text-neutral-900">
                {lab.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-white font-semibold text-lg group-hover:text-teal-300 transition-colors">
                  {lab.name}
                </h3>
                <span className="px-2 py-1 bg-neutral-700/50 text-neutral-300 rounded text-xs">
                  {lab.fullName}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-3 text-sm text-neutral-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{lab.instructor}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{lab.students} students</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{lab.duration}</span>
                </div>
              </div>
              
              {/* Progress Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-neutral-300">Progress</span>
                  <span className="font-bold text-sm text-white">{lab.progress}%</span>
                </div>
                <Progress
                  value={lab.progress}
                  className="h-2"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-neutral-400 text-xs whitespace-nowrap">
              <Calendar className="w-3 h-3" />
              Due: {lab.date}
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}