import React from 'react';
import { BookOpen } from 'lucide-react';
import ProgressCircle from './ProgressCircle';

const ProgressSection = ({ progressData }) => (
  <div className="mb-16">
    <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-2">
      <BookOpen className="w-6 h-6 text-teal-400" />
      Laboratory Progress
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {progressData.map((item, index) => (
        <ProgressCircle
          key={index}
          percentage={item.percentage}
          label={item.label}
          color={item.color}
        />
      ))}
    </div>
  </div>
);

export default ProgressSection;