import React from "react";

const Progress = ({ value, className }) => {
  return (
    <div className={`bg-slate-100 rounded-full overflow-hidden ${className}`}>
      <div 
        className="bg-gradient-to-r from-teal-400 to-teal-600 h-full transition-all duration-500 ease-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

export default Progress;