import React from "react";

const Banner = ({ user }) => (
  <div className="relative bg-teal-600 rounded-2xl overflow-hidden px-7 py-6 flex items-center justify-between min-h-[110px]">
    {/* Text */}
    <div className="relative z-10">
      <h2 className="text-xl font-extrabold text-white leading-snug mb-1.5">
        Welcome Back, {user?.name || user?.username || "Student"}!
        <br />
        Master Your Lab Journey
      </h2>
      <p className="text-teal-100 text-xs mb-4 max-w-xs leading-relaxed">
        Track your progress and complete your assigned laboratory experiments.
      </p>
    </div>

    {/* Hexagon decoration */}
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-3 opacity-90 pointer-events-none select-none">
      <div className="flex flex-col gap-2">
        <div
          className="w-14 h-16 flex items-center justify-center"
          style={{
            background: "rgba(255,255,255,0.15)",
            clipPath:
              "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
        <div
          className="w-9 h-11 self-end"
          style={{
            background: "rgba(255,215,0,0.3)",
            clipPath:
              "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
      </div>
      <div className="flex flex-col gap-2 mt-5">
        <div
          className="w-9 h-11"
          style={{
            background: "rgba(255,215,0,0.3)",
            clipPath:
              "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
        <div
          className="w-14 h-16"
          style={{
            background: "rgba(255,255,255,0.15)",
            clipPath:
              "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
          }}
        />
      </div>
    </div>
  </div>
);

export default Banner;
