import { Link } from "react-router-dom";

const Banner = ({ user }) => (
  <div className="relative group bg-gradient-to-br from-[#1a6b5c] via-[#2a8c78] to-[#134d42] rounded-[2rem] overflow-hidden px-6 py-5 flex items-center justify-between h-full shadow-lg shadow-teal-900/10 border border-white/5 transition-all duration-700 hover:shadow-teal-900/20">
    {/* Animated background highlights */}
    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/5 blur-[60px] -mr-20 -mt-20 rounded-full pointer-events-none group-hover:bg-white/10 transition-all duration-1000" />
    <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-[#3aa892]/10 blur-[50px] -ml-16 -mb-16 rounded-full pointer-events-none" />

    {/* Content Section */}
    <div className="relative z-10 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[8px] font-black text-teal-50 uppercase tracking-[0.15em] shadow-sm">
          {user?.role || "Student"} Overview
        </span>
      </div>
      <div>
        <h2 className="text-2xl font-black text-white leading-tight tracking-tight">
          Welcome back, {user?.name || user?.username || "Student"}!
        </h2>
        <p className="text-teal-50/70 text-xs font-bold max-w-xs leading-relaxed opacity-90">
          Continue your experiments and track your milestones.
        </p>
        <Link to="/labs" className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-[#1a6b5c] text-[11px] font-black uppercase tracking-widest hover:bg-teal-50 transition-colors shadow-sm mt-4">
           View Assigned Labs
        </Link>
      </div>
    </div>

    {/* Hexagon art - Scaled Down */}
    <div className="absolute right-10 top-1/2 -translate-y-1/2 flex gap-4 opacity-20 pointer-events-none select-none transform rotate-12 group-hover:rotate-0 transition-all duration-1000">
      <div className="flex flex-col gap-3">
        <div
          className="w-16 h-20 flex items-center justify-center animate-pulse"
          style={{
            background: "rgba(255,255,255,0.2)",
            clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
        <div
          className="w-10 h-12 self-end"
          style={{
            background: "rgba(255,215,0,0.4)",
            clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
      </div>
      <div className="flex flex-col gap-3 mt-8">
        <div
          className="w-10 h-12"
          style={{
            background: "rgba(255,215,0,0.4)",
            clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
        <div
          className="w-16 h-20"
          style={{
            background: "rgba(255,255,255,0.2)",
            clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
      </div>
    </div>
  </div>
);

export default Banner;
