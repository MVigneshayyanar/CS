import React from "react";
import {
  MapPin,
  ChevronRight,
  FlaskConical,
  Microscope,
  Atom,
} from "lucide-react";

// You can replace upcomingLabs with real data from your API if available
const ProfilePanel = ({ stats, user, upcomingTasks = [] }) => {
  // Pull course + cert counts from stats if available
  const labCount =
    stats?.find(
      (s) =>
        s.label?.toLowerCase().includes("lab") ||
        s.label?.toLowerCase().includes("total"),
    )?.value ?? "0";
  const certCount =
    stats?.find((s) => s.label?.toLowerCase().includes("cert"))?.value ?? "0";

  // Use the provided user name or fallback
  const userName = user?.name || user?.username || "Student";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="flex flex-col gap-4 sticky top-8">
      {/* Profile Card */}
      <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3aa892] to-[#1a6b5c] flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
            {initials}
          </div>
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-[#2a8c78] border-2 border-white rounded-full" />
        </div>
        <h2 className="text-base font-extrabold text-heading">{userName}</h2>
        <p className="text-xs text-muted flex items-center justify-center gap-1 mt-1">
          <MapPin className="w-3 h-3" /> {user?.location || "Academic Portal"}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-alt rounded-xl py-3 px-2 text-center">
            <div className="text-2xl font-extrabold text-[#1a6b5c]">
              {labCount}
            </div>
            <div className="text-[11px] text-muted font-semibold mt-0.5">
              Labs
            </div>
          </div>
          <div className="bg-alt rounded-xl py-3 px-2 text-center">
            <div className="text-2xl font-extrabold text-amber-500">
              {certCount}
            </div>
            <div className="text-[11px] text-muted font-semibold mt-0.5">
              Tasks
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Labs Card */}
      <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-heading">
            Upcoming Labs
          </h3>
          <span className="text-xs text-[#1a6b5c] font-semibold cursor-pointer hover:underline">
            View All
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {upcomingTasks.length === 0 ? (
            <p className="text-[11px] text-muted text-center py-4">No upcoming tasks</p>
          ) : (
            upcomingTasks.map((task, i) => {
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-alt border border-theme-light hover:border-[#c2e6de] hover:bg-[#f0f7f5]/40 transition-all cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#f0f7f5]`}
                  >
                    <FlaskConical className={`w-4 h-4 text-[#1a6b5c]`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-heading truncate">
                      {task.title}
                    </p>
                    <p className="text-[10px] text-muted mt-0.5">
                      {task.date}
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-alt rounded-lg flex items-center justify-center group-hover:bg-[#dff2ed] transition-colors">
                    <ChevronRight className="w-3 h-3 text-muted group-hover:text-[#1a6b5c]" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePanel;
