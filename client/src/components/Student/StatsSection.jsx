import React from "react";
import StatCard from "./StatCard";

const StatsSection = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {stats.map((stat, index) => (
      <StatCard
        key={index}
        value={stat.value}
        label={stat.label}
        color={stat.color}
        icon={stat.icon}
      />
    ))}
  </div>
);

export default StatsSection;
