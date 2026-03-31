import React from "react";
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

const PerformanceCharts = ({
  classPerformanceDataProp,
  progressDistributionDataProp,
  barOnly = false,
  pieOnly = false,
}) => {
  const classPerformanceData = classPerformanceDataProp || [
    { className: "CSE-A", avgScore: 88, completion: 92 },
    { className: "CSE-B", avgScore: 85, completion: 89 },
    { className: "CSE-C", avgScore: 92, completion: 95 },
    { className: "CSE-D", avgScore: 79, completion: 84 },
    { className: "ECE-A", avgScore: 86, completion: 88 },
    { className: "ECE-B", avgScore: 83, completion: 86 },
  ];

  const progressDistributionData = progressDistributionDataProp || [
    { range: "90-100%", students: 142, color: "#1a6b5c" },
    { range: "80-89%", students: 98, color: "#3b82f6" },
    { range: "70-79%", students: 67, color: "#f59e0b" },
    { range: "60-69%", students: 28, color: "#ef4444" },
    { range: "<60%", students: 13, color: "#6b7280" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-theme rounded-lg p-3 shadow-xl">
          <p className="font-semibold text-heading mb-1">{label}</p>
          {payload.map((entry, index) => {
            // Safe string checking before using includes()
            const name = entry.name || "";
            const isPercentage =
              typeof name === "string" &&
              (name.includes("Score") ||
                name.includes("completion") ||
                name.includes("Rate"));

            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {name}: {entry.value}
                {isPercentage ? "%" : ""}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className={
        barOnly || pieOnly ? "" : "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      }
    >
      {!pieOnly && (
        <div
          className={
            barOnly ? "" : "bg-card border border-theme rounded-2xl p-4"
          }
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={classPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
              <XAxis dataKey="className" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="avgScore" fill="#3b82f6" name="Avg Score" />
              <Bar dataKey="completion" fill="#1a6b5c" name="Completion Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {!barOnly && (
        <div
          className={
            pieOnly ? "" : "bg-card border border-theme rounded-2xl p-4"
          }
        >
          <div className="flex items-center justify-between h-64">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={progressDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="students"
                >
                  {progressDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-40 space-y-2">
              {progressDistributionData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-sm text-body">{entry.range}</span>
                  <span className="text-sm text-heading font-semibold ml-auto">
                    {entry.students}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceCharts;
