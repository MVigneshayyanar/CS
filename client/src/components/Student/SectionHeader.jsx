import React from 'react';

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-3">
      <Icon className="w-8 h-8 text-teal-400" />
      <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
        {title}
      </h1>
    </div>
    <p className="text-neutral-400 text-lg">{subtitle}</p>
  </div>
);

export default SectionHeader;