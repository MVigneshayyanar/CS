import React from "react";

const Progress = ({ value, className }) => {
  return (
    <div className={`bg-alt rounded-full overflow-hidden ${className}`}>
      <div 
        className="bg-gradient-to-r from-[#3aa892] to-[#1a6b5c] h-full transition-all duration-500 ease-out rounded-full"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

export default Progress;