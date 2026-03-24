import React from "react";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-200">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default SectionHeader;
