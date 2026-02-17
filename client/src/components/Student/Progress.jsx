import React from "react";

const Progress = ({ value, className }) => {
  return (
    <div className={`bg-neutral-700 rounded-full overflow-hidden ${className}`}>
      <div 
        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-300 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

export default Progress;