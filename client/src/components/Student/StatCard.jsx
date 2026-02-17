import React from 'react';

const StatCard = ({ value, label, color = "teal" }) => {
  const colorVariants = {
    teal: "text-teal-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    cyan: "text-cyan-400"
  };

  return (
    <div className="bg-neutral-900/30 backdrop-blur-sm p-6 rounded-xl border border-neutral-800/30 text-center">
      <div className={`text-2xl font-bold mb-1 ${colorVariants[color]}`}>
        {value}
      </div>
      <div className="text-neutral-400 text-sm">
        {label}
      </div>
    </div>
  );
};

export default StatCard;