import React from 'react';
import StatCard from './StatCard';

const StatsSection = ({ stats }) => (
  <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
    {stats.map((stat, index) => (
      <StatCard
        key={index}
        value={stat.value}
        label={stat.label}
        color={stat.color}
      />
    ))}
  </div>
);

export default StatsSection;