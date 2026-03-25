import React, { useMemo, useState } from "react";
import { BookOpen, Users, ChevronRight } from "lucide-react";

const colorCycle = [
  {
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    bar: "bg-blue-500",
    chip: "bg-blue-50 text-blue-700",
  },
  {
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    bar: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700",
  },
  {
    iconBg: "bg-teal-50",
    iconColor: "text-teal-500",
    bar: "bg-teal-500",
    chip: "bg-teal-50 text-teal-700",
  },
  {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
    bar: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700",
  },
];

const fallbackClasses = [
  {
    id: 1,
    name: "CSE-A",
    subject: "Computer Programming",
    students: 32,
    completionRate: 72,
    status: "Active",
  },
  {
    id: 2,
    name: "CSE-B",
    subject: "Computer Programming",
    students: 30,
    completionRate: 66,
    status: "Active",
  },
  {
    id: 3,
    name: "ECE-A",
    subject: "Data Structures",
    students: 28,
    completionRate: 58,
    status: "Inactive",
  },
  {
    id: 4,
    name: "IT-A",
    subject: "Web Development",
    students: 26,
    completionRate: 81,
    status: "Active",
  },
];

const ClassManagementGrid = ({ onClassSelect, classesData = [] }) => {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Active", "Inactive"];

  const classes = useMemo(() => {
    if (Array.isArray(classesData) && classesData.length > 0) {
      return classesData;
    }
    return fallbackClasses;
  }, [classesData]);

  const filtered =
    filter === "All"
      ? classes
      : classes.filter((c) => (c.status || "Active") === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold border-2 transition-all ${
              filter === f
                ? "bg-teal-50 border-teal-400 text-teal-700"
                : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">
          No classes found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((cls, i) => {
            const c = colorCycle[i % colorCycle.length];
            const pct = Number(cls.completionRate ?? 0);

            return (
              <div
                key={cls.id || i}
                onClick={() => onClassSelect && onClassSelect(cls)}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-4 cursor-pointer hover:border-teal-300 hover:bg-teal-50/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.iconBg}`}
                  >
                    <BookOpen className={`w-4 h-4 ${c.iconColor}`} />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-full ${(cls.status || "Active") === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {cls.status || "Active"}
                  </span>
                </div>

                <p className="text-sm font-extrabold text-slate-900 mb-0.5">
                  {cls.name}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mb-3">
                  {cls.subject}
                  {cls.students != null && (
                    <span className="ml-2 inline-flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {cls.students}
                    </span>
                  )}
                </p>

                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${c.bar}`}
                    style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {pct}% Complete
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClassManagementGrid;
