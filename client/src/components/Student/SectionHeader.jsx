import React from "react";

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-8">
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1a6b5c] to-[#2a8c78] flex items-center justify-center shadow-lg shadow-teal-500/10 border border-white/10">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <h1 className="text-xl font-black text-heading tracking-tight leading-tight uppercase">
          {title}
        </h1>
        <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-0.5 opacity-60">
          {subtitle}
        </p>
      </div>
    </div>
  </div>
);

export default SectionHeader;
