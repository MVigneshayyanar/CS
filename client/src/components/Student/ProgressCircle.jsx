import React from 'react';

const ProgressCircle = ({ percentage, label, color = "teal" }) => {
  const radius = 45;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorVariants = {
    teal: { from: "#14b8a6", to: "#0d9488" },
    blue: { from: "#3b82f6", to: "#1d4ed8" },
    emerald: { from: "#10b981", to: "#059669" }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-neutral-800/50 backdrop-blur-sm rounded-2xl border border-neutral-700/50 hover:border-teal-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10">
      <div className="relative">
        <svg width="140" height="140" className="transform -rotate-90 drop-shadow-lg">
          {/* Background circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="none"
            className="opacity-30"
          />
          {/* Foreground circle with progress */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            stroke={`url(#gradient-${color})`}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out filter drop-shadow-sm"
          />
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorVariants[color].from} />
              <stop offset="100%" stopColor={colorVariants[color].to} />
            </linearGradient>
          </defs>
        </svg>
        {/* Percentage text centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white font-bold text-2xl">{percentage}%</span>
          <span className="text-neutral-400 text-xs">Complete</span>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-white font-semibold text-sm leading-tight max-w-48">{label}</h3>
      </div>
    </div>
  );
};

export default ProgressCircle;