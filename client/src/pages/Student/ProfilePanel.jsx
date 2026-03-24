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
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-extrabold shadow-md">
            {initials}
          </div>
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
        </div>
        <h2 className="text-base font-extrabold text-slate-800">{userName}</h2>
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
          <MapPin className="w-3 h-3" /> {user?.location || "Academic Portal"}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-slate-50 rounded-xl py-3 px-2 text-center">
            <div className="text-2xl font-extrabold text-teal-600">
              {labCount}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Labs
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl py-3 px-2 text-center">
            <div className="text-2xl font-extrabold text-amber-500">
              {certCount}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
              Tasks
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Labs Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-800">
            Upcoming Labs
          </h3>
          <span className="text-xs text-teal-600 font-semibold cursor-pointer hover:underline">
            View All
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {upcomingTasks.length === 0 ? (
            <p className="text-[11px] text-slate-400 text-center py-4">No upcoming tasks</p>
          ) : (
            upcomingTasks.map((task, i) => {
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-teal-200 hover:bg-teal-50/40 transition-all cursor-pointer group"
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-teal-50`}
                  >
                    <FlaskConical className={`w-4 h-4 text-teal-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-700 truncate">
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {task.date}
                    </p>
                  </div>
                  <div className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600" />
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
