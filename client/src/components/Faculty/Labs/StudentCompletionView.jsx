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
import { Calendar, X, Search } from "lucide-react";

import { updateExperimentSchedule } from "@/services/facultyService";

const StudentCompletionView = ({ experiment, students, onClose, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [dueDate, setDueDate] = useState(
    experiment?.deadline || experiment?.dueDate || "",
  );
  const [availableFrom, setAvailableFrom] = useState(experiment?.availableFrom || "");
  const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false);
  const [availableTo, setAvailableTo] = useState(experiment?.availableTo || "");
  const [deadlineSection, setDeadlineSection] = useState("all");

  React.useEffect(() => {
    if (experiment) {
      setDueDate(experiment.deadline || experiment.dueDate || "");
      setAvailableFrom(experiment.availableFrom || "");
      setAvailableTo(experiment.availableTo || "");
    }
  }, [experiment]);

  const getStudentSection = (student) => {
    const sectionValue =
      student?.section || student?.sec || student?.classSection;
    return sectionValue ? String(sectionValue).toUpperCase() : "Unassigned";
  };

  // Normalize student list
  const studentList = useMemo(() => {
    return (students || []).map((s, idx) => {
      if (typeof s === "string") return { name: s, id: s };
      return {
        name: s.name || s.username || `Student ${idx + 1}`,
        id: s.rollNo || s.id || s.username || `ID-${idx + 1}`,
        section: getStudentSection(s),
      };
    });
  }, [students]);

  const sectionOptions = useMemo(() => {
    return Array.from(
      new Set(studentList.map((s) => s.section || "Unassigned")),
    ).sort();
  }, [studentList]);

  // Derive completion status from submissions array (per-student tracking)
  const completedStudents = useMemo(() => {
    const submissions = Array.isArray(experiment?.submissions)
      ? experiment.submissions
      : [];
    const completedIds = new Set();
    const completedMap = new Map();

    // Build map of completed submissions
    submissions.forEach((sub) => {
      const status = (sub.status || "").toLowerCase();
      if (status === "completed" || Number(sub.progress || 0) >= 100) {
        const studentKey = (sub.student || "").toLowerCase();
        completedIds.add(studentKey);
        completedMap.set(studentKey, sub);
      }
    });

    // Also check legacy completedBy field
    if (experiment?.completedBy) {
      completedIds.add(experiment.completedBy.toLowerCase());
    }

    return studentList
      .filter((s) => {
        const idLower = (s.id || "").toLowerCase();
        const nameLower = (s.name || "").toLowerCase();
        return completedIds.has(idLower) || completedIds.has(nameLower);
      })
      .map((s) => {
        const sub =
          completedMap.get((s.id || "").toLowerCase()) ||
          completedMap.get((s.name || "").toLowerCase());
        return {
          ...s,
          score: sub?.progress || 100,
          submissionDate: sub?.completedAt
            ? new Date(sub.completedAt).toLocaleDateString()
            : "N/A",
        };
      });
  }, [studentList, experiment]);

  const notCompletedStudents = useMemo(() => {
    const completedIds = new Set(
      completedStudents.map((s) => (s.id || "").toLowerCase()),
    );
    const deadline = experiment?.deadline || experiment?.dueDate;
    const now = new Date();

    return studentList
      .filter((s) => !completedIds.has((s.id || "").toLowerCase()))
      .map((s) => {
        let daysOverdue = 0;
        if (deadline) {
          const deadlineDate = new Date(deadline);
          if (!isNaN(deadlineDate.getTime()) && now > deadlineDate) {
            daysOverdue = Math.floor(
              (now - deadlineDate) / (1000 * 60 * 60 * 24),
            );
          }
        }
        return { ...s, daysOverdue };
      });
  }, [studentList, completedStudents, experiment]);

  const filter = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) || s.id?.toLowerCase().includes(q),
    );
  };

  const filterBySection = (list) => {
    if (selectedSection === "all") return list;
    return list.filter((s) => (s.section || "Unassigned") === selectedSection);
  };

  const filteredCompletedStudents = useMemo(
    () => filter(filterBySection(completedStudents)),
    [completedStudents, searchQuery, selectedSection],
  );
  const filteredNotCompletedStudents = useMemo(
    () => filter(filterBySection(notCompletedStudents)),
    [notCompletedStudents, searchQuery, selectedSection],
  );

  const chartData = [
    { name: "Completed", value: completedStudents.length, color: "#10b981" },
    {
      name: "Not Completed",
      value: notCompletedStudents.length,
      color: "#ef4444",
    },
  ];

  function truncateString(str, maxLength) {
    if (str.length > maxLength) {
      return str.slice(0, maxLength - 5) + "...";
    }
    return str;
  }

  const scoreData = completedStudents.slice(0, 5).map((student) => ({
    name: truncateString(student.name.split(" ")[0], 10),
    fullName: student.name,
    score: student.score || 100,
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

  const handleSetSchedule = async () => {
    if (!experiment?.id) return;
    try {
      setIsUpdatingSchedule(true);
      const separatorIndex = experiment.id.lastIndexOf("-");
      if (separatorIndex <= 0) {
        throw new Error("Invalid experiment id format");
      }
      const labId = experiment.id.slice(0, separatorIndex);
      const expIdxStr = experiment.id.slice(separatorIndex + 1);
      const experimentIndex = parseInt(expIdxStr, 10);
      if (Number.isNaN(experimentIndex)) {
        throw new Error("Invalid experiment index");
      }
      await updateExperimentSchedule(
        labId,
        experimentIndex,
        {
          deadline: dueDate,
          availableFrom,
          availableTo,
          section: deadlineSection === "all" ? undefined : deadlineSection,
        }
      );
      if (onRefresh) onRefresh();
      setShowScheduleModal(false);
    } catch (error) {
      alert(
        "Failed to update schedule: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setIsUpdatingSchedule(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const dateObj = new Date(dateString);
      return Number.isNaN(dateObj.getTime())
        ? dateString
        : dateObj.toLocaleDateString("en-GB");
    } catch {
      return dateString;
    }
  };

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
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              Set Schedule
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
          <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-3">
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
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all"
            >
              <option value="all">All Sections</option>
              {sectionOptions.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Completed Students */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-emerald-400">
                Completed Students ({filteredCompletedStudents.length})
              </h3>
              <div className="space-y-3">
                {filteredCompletedStudents &&
                filteredCompletedStudents.length > 0 ? (
                  filteredCompletedStudents.map((student, index) => (
                    <div
                      key={student?.id || index}
                      className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4 backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-white">
                            {student?.name || "Unknown"}
                          </h4>
                          <p className="text-sm text-neutral-400">
                            {student?.id || "No ID"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-emerald-400">
                            {student?.score || 0}%
                          </div>
                          <div className="text-xs text-neutral-500">
                            Submitted: {student?.submissionDate || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-neutral-400 py-8">
                    {searchQuery
                      ? `No completed students found starting with "${searchQuery}"`
                      : "No completed students"}
                  </div>
                )}
              </div>
            </div>

            {/* Not Completed Students */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-400">
                Not Completed Students ({filteredNotCompletedStudents.length})
              </h3>
              <div className="space-y-3">
                {filteredNotCompletedStudents &&
                filteredNotCompletedStudents.length > 0 ? (
                  filteredNotCompletedStudents.map((student, index) => (
                    <div
                      key={student?.id || index}
                      className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 backdrop-blur-sm"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-white">
                            {student?.name || "Unknown"}
                          </h4>
                          <p className="text-sm text-neutral-400">
                            {student?.id || "No ID"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-red-400">
                            {student?.daysOverdue || 0} days overdue
                          </div>
                          <div className="text-xs text-neutral-500">
                            Status: Pending
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-neutral-400 py-8">
                    {searchQuery
                      ? `No incomplete students found starting with "${searchQuery}"`
                      : "No incomplete students"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-neutral-800/95 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 w-[450px] shadow-2xl overflow-auto max-h-[90vh]">
            <h3 className="text-xl font-semibold text-white mb-6">
              Set Experiment Schedule
            </h3>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Section Scope
                </label>
                <select
                  value={deadlineSection}
                  onChange={(e) => setDeadlineSection(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-700/50 border border-neutral-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                >
                  <option value="all">All Sections</option>
                  {sectionOptions.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Available From
                  </label>
                  <input
                    type="datetime-local"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-700/50 border border-neutral-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Students can only access after this</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Available To (End)
                  </label>
                  <input
                    type="datetime-local"
                    value={availableTo}
                    onChange={(e) => setAvailableTo(e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-700/50 border border-neutral-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">Marked as late after this</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Soft Deadline (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-700/50 border border-neutral-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-5 py-2.5 bg-neutral-600/50 text-white text-sm font-bold rounded-lg hover:bg-neutral-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSetSchedule}
                disabled={isUpdatingSchedule}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
              >
                {isUpdatingSchedule ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCompletionView;
