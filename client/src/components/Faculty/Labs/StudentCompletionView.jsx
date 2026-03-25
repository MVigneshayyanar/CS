import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Search, X, Calendar, CheckCircle2, XCircle } from "lucide-react";

const StudentCompletionView = ({ experiment, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDueDateModal, setShowDueDateModal] = useState(false);
  const [dueDate, setDueDate] = useState(experiment?.dueDate || "");

  const completedStudents = [
    { name: "ABCDEFGH", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
    { name: "CEFGHI", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
    {
      name: "DEF AQRGH",
      id: "CSE001",
      score: 95,
      submissionDate: "2024-01-15",
    },
    { name: "GHI", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
    { name: "JKL", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
    { name: "MNO", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
    { name: "PQR", id: "CSE002", score: 88, submissionDate: "2024-01-14" },
    { name: "STU", id: "CSE003", score: 92, submissionDate: "2024-01-16" },
  ];
  const notCompletedStudents = [
    { name: "VW", id: "CSE004", daysOverdue: 7 },
    { name: "YZ", id: "CSE005", daysOverdue: 3 },
  ];

  const filter = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (s) =>
        s.name?.toLowerCase().startsWith(q) ||
        s.id?.toLowerCase().startsWith(q),
    );
  };

  const filteredCompleted = useMemo(
    () => filter(completedStudents),
    [searchQuery],
  );
  const filteredNotCompleted = useMemo(
    () => filter(notCompletedStudents),
    [searchQuery],
  );

  const chartData = [
    { name: "Completed", value: completedStudents.length, color: "#10b981" },
    {
      name: "Not Completed",
      value: notCompletedStudents.length,
      color: "#ef4444",
    },
  ];
  const scoreData = completedStudents.slice(0, 5).map((s) => ({
    name: s.name.split(" ")[0].slice(0, 8),
    fullName: s.name,
    score: s.score,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-slate-100 rounded-xl shadow-lg p-3 text-xs">
          <p className="font-bold text-slate-800">
            {payload[0].payload.fullName}
          </p>
          <p className="text-teal-600 mt-0.5">Score: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??";
  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-[90vw] max-w-4xl max-h-[88vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Exp {experiment?.number}: {experiment?.name} — Student Status
            </h2>
            {dueDate && (
              <p className="text-xs text-slate-400 mt-0.5">
                Due: {formatDate(dueDate)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDueDateModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              Set Due Date
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {/* Charts */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
              <h3 className="text-xs font-extrabold text-slate-700 mb-3">
                Completion Status
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {chartData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
              <h3 className="text-xs font-extrabold text-slate-700 mb-3">
                Leaderboard
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student lists */}
          <div className="grid grid-cols-2 gap-4">
            {/* Completed */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-extrabold text-emerald-700">
                  Completed Students ({filteredCompleted.length})
                </span>
              </div>
              <div className="space-y-2">
                {filteredCompleted.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No results found
                  </p>
                ) : (
                  filteredCompleted.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[11px] font-extrabold text-emerald-700 flex-shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{s.id}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-extrabold text-emerald-600">
                          {s.score}%
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {s.submissionDate}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Not completed */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-red-400" />
                <span className="text-xs font-extrabold text-red-600">
                  Not Completed ({filteredNotCompleted.length})
                </span>
              </div>
              <div className="space-y-2">
                {filteredNotCompleted.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No results found
                  </p>
                ) : (
                  filteredNotCompleted.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 bg-red-50 border border-red-100 rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-[11px] font-extrabold text-red-600 flex-shrink-0">
                        {getInitials(s.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{s.id}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-extrabold text-red-500">
                          {s.daysOverdue}d overdue
                        </p>
                        <p className="text-[10px] text-slate-400">Pending</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Due Date Modal */}
      {showDueDateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-6 w-80">
            <h3 className="text-sm font-extrabold text-slate-900 mb-4">
              Set Due Date
            </h3>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowDueDateModal(false)}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDueDateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
              >
                Set Due Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCompletionView;
