import React from "react";
import {
  MapPin,
  ChevronRight,
  FlaskConical,
  Clock,
  BookOpen
} from "lucide-react";

const ProfilePanel = ({ 
  stats = [],
  user, 
  tasks = [], 
  tasksTitle = "Expired Experiments", 
  showProfile = true, 
  showTasks = true 
}) => {
  // Pull course + cert counts from stats if available
  const labCount =
    stats?.find(
      (s) =>
        s.label?.toLowerCase().includes("lab") ||
        s.label?.toLowerCase().includes("total"),
    )?.value ?? "0";
  const pendingCount =
    stats?.find((s) => s.label?.toLowerCase().includes("pend"))?.value ?? "0";
  // Use the provided user name or fallback
  const userName = user?.name || user?.username || "Student";
  const initials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  if (!showProfile && !showTasks) return null;

  return (
    <div className="flex flex-col gap-5 sticky top-8 h-full">
      {/* Profile Card - Highly Streamlined */}
      {showProfile && (
        <div className="bg-card rounded-[2rem] border border-theme-light shadow-sm p-5 text-center relative overflow-hidden group h-full flex flex-col justify-center">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#f0f7f5] rounded-full opacity-50 transition-transform group-hover:scale-110 duration-500" />
          
          <div className="relative z-10">
            <div className="inline-block p-1 bg-card rounded-full shadow-md mb-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a6b5c] to-[#134d42] flex items-center justify-center text-white text-base font-black border-2 border-white">
                {user?.name ? user.name.split(" ").map(n => n[0]).join("") : "ST"}
              </div>
            </div>
            
            <h4 className="text-base font-black text-heading tracking-tight leading-none mb-1 group-hover:text-[#1a6b5c] transition-colors">
              {user?.name || user?.username || "Student"}
            </h4>
            <div className="flex items-center justify-center gap-1 opacity-40">
              <MapPin className="w-2.5 h-2.5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.1em]">Active Student</span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-alt rounded-xl py-2.5 px-2 text-center border border-theme-light shadow-sm hover:border-[#1a6b5c] transition-all">
                <div className="text-lg font-black text-[#1a6b5c] font-mono tracking-tighter">
                  {(stats.find(s => s.label === 'Labs') || {value: 0}).value}
                </div>
                <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-0.5 opacity-60">
                  Labs
                </div>
              </div>
              <div className="bg-alt rounded-2xl py-2.5 px-2 text-center border border-theme-light shadow-sm hover:border-amber-500 transition-all">
                <div className="text-lg font-black text-amber-500 font-mono tracking-tighter">
                  {pendingCount}
                </div>
                <div className="text-[9px] text-muted font-bold uppercase tracking-widest mt-0.5 opacity-60">
                  Pending
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Card - Streamlined */}
      {showTasks && (
        <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xs font-black text-heading tracking-tight leading-none mb-0.5">
                {tasksTitle}
              </h3>
              <p className="text-[8px] font-bold text-muted uppercase tracking-widest opacity-40">Require attention</p>
            </div>
            <ChevronRight className="w-3 h-3 text-muted" />
          </div>

          <div className="flex flex-col gap-2.5">
            {tasks.length === 0 ? (
              <div className="py-6 flex flex-col items-center justify-center opacity-30 grayscale gap-1.5">
                <FlaskConical className="w-6 h-6" />
                <p className="text-[8px] font-bold uppercase tracking-widest text-center">No experiments found</p>
              </div>
            ) : (
              tasks.slice(0, 4).map((task, i) => {
                const isOverdue = tasksTitle.includes("Expired") || task.status === "expired";
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-2 rounded-xl border border-theme-light transition-all cursor-pointer group hover:shadow-sm ${isOverdue ? 'bg-rose-50/50 hover:bg-rose-50' : 'bg-alt/50 hover:bg-alt'}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm transition-transform ${isOverdue ? 'bg-rose-100 text-rose-500' : 'bg-white text-[#1a6b5c]'}`}
                    >
                      {isOverdue ? (
                        <Clock className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <BookOpen className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-heading truncate tracking-tight">
                        {task.title}
                      </p>
                      <p className="text-[8px] text-muted font-bold uppercase tracking-wider opacity-60">
                        {task.date}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePanel;
