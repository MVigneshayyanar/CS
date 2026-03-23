import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import * as Progress from "@radix-ui/react-progress";
import * as Tabs from "@radix-ui/react-tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  Tooltip,
} from "recharts";
import { fetchStudentStatistics } from "@/services/studentService";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "teal",
}) => {
  const colorClasses = {
    teal: "from-teal-500 to-teal-600",
    blue: "from-cyan-500 to-cyan-600",
    purple: "from-violet-500 to-violet-600",
    orange: "from-amber-500 to-amber-600",
  };

  return (
    <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-neutral-400 text-sm">{title}</p>
      {subtitle && <p className="text-neutral-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );
};

const EnhancedProgressChart = ({ data }) => {
  const gradientColors = [
    { id: "gradientJava", start: "#22c55e", end: "#16a34a" },
    { id: "gradientCpp", start: "#3b82f6", end: "#2563eb" },
    { id: "gradientPython", start: "#8b5cf6", end: "#7c3aed" },
    { id: "gradientDart", start: "#f59e0b", end: "#d97706" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold">{label}</p>
          <p className="text-teal-400">
            Progress: {payload.value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          {gradientColors.map((gradient) => (
            <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={gradient.start} stopOpacity={0.9} />
              <stop offset="95%" stopColor={gradient.end} stopOpacity={0.4} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          axisLine={{ stroke: "#4b5563" }}
        />
        <YAxis
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          axisLine={{ stroke: "#4b5563" }}
          domain={[0, 100]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="progress" radius={[8, 8, 0, 0]} barSize={45}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`url(#${gradientColors[index]?.id})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const ProgressCard = ({ lab }) => {
  const getColorByProgress = (progress) => {
    if (progress >= 90) return "from-emerald-500 to-green-600";
    if (progress >= 70) return "from-teal-500 to-cyan-600";
    if (progress >= 50) return "from-blue-500 to-indigo-600";
    return "from-orange-500 to-red-600";
  };

  return (
    <div className="group bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-5 border border-neutral-700 hover:border-neutral-600 transition-all duration-300 hover:transform hover:scale-105">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-1">{lab.name}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getColorByProgress(lab.progress)} text-white text-sm font-bold`}>
          {lab.progress}%
        </div>
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-neutral-400 mb-2">
          <span>Progress</span>
          <span>{lab.progress}%</span>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${getColorByProgress(lab.progress)} transition-all duration-1000 ease-out`}
            style={{ width: `${lab.progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-400">Assignments</span>
        <span className="text-teal-400 font-semibold">
          {lab.completed}/{lab.assignments} completed
        </span>
      </div>
    </div>
  );
};

export default function Statistics() {
  const [isLoading, setIsLoading] = useState(true);
  const [statisticsData, setStatisticsData] = useState({
    metrics: {
      labsCompleted: "0/0",
      studyHours: "0h",
      assignmentsDue: 0,
    },
    myLabsData: [],
    skillRadarData: [],
    activityItems: [],
  });

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const result = await fetchStudentStatistics();
        setStatisticsData(result?.data || {
          metrics: { labsCompleted: "0/0", studyHours: "0h", assignmentsDue: 0 },
          myLabsData: [],
          skillRadarData: [],
          activityItems: [],
        });
      } catch (error) {
        const message = error?.response?.data?.message || "Failed to load statistics from backend";
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistics();
  }, []);

  const myLabsData = statisticsData.myLabsData || [];
  const skillRadarData = statisticsData.skillRadarData || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 pt-15">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8 text-teal-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Statistics
            </h1>
          </div>
          <p className="text-neutral-400 text-lg">
            Track your coding journey, skills development, and learning milestones
          </p>
        </div>
      </div>

      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50 max-w-6xl mx-auto px-6 pt-0 pb-12">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Labs Completed"
            value={statisticsData.metrics?.labsCompleted || "0/0"}
            subtitle="This semester"
            icon={CheckCircle}
            color="blue"
          />
          <StatCard
            title="Study Hours"
            value={statisticsData.metrics?.studyHours || "0h"}
            subtitle="This semester"
            icon={Clock}
            color="purple"
          />
          <StatCard
            title="Assignments Due"
            value={`${statisticsData.metrics?.assignmentsDue ?? 0}`}
            subtitle="Next 7 days"
            icon={Calendar}
            color="orange"
          />
        </div>

        {isLoading && <div className="mb-6 text-neutral-400">Loading statistics...</div>}

        {/* Tabs Layout */}
        <Tabs.Root defaultValue="progress" className="w-full">
          <Tabs.List className="flex space-x-1 bg-neutral-900 p-1 rounded-lg mb-6 border border-neutral-800">
            <Tabs.Trigger
              value="progress"
              className="flex-1 px-4 py-2 text-sm font-medium text-neutral-300 rounded-md hover:text-white hover:bg-neutral-800 data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Progress Dashboard
            </Tabs.Trigger>
            <Tabs.Trigger
              value="skills"
              className="flex-1 px-4 py-2 text-sm font-medium text-neutral-300 rounded-md hover:text-white hover:bg-neutral-800 data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Skills Radar
            </Tabs.Trigger>
            <Tabs.Trigger
              value="activity"
              className="flex-1 px-4 py-2 text-sm font-medium text-neutral-300 rounded-md hover:text-white hover:bg-neutral-800 data-[state=active]:bg-teal-600 data-[state=active]:text-white transition-all"
            >
              Recent Activity
            </Tabs.Trigger>
          </Tabs.List>

          {/* Progress Tab */}
          <Tabs.Content value="progress" className="space-y-6">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-6 border border-neutral-800 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-600/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Lab Progress Overview</h3>
              </div>
              <EnhancedProgressChart data={myLabsData} />
            </div>
            {/* Progress Cards (vertical stacking for unified look) */}
            <div className="space-y-4">
              {myLabsData.map((lab) => (
                <ProgressCard key={lab.name} lab={lab} />
              ))}
              {!myLabsData.length && <div className="text-neutral-500">No lab statistics available.</div>}
            </div>
          </Tabs.Content>

          {/* Skills Tab */}
          <Tabs.Content value="skills" className="space-y-6">
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-6 border border-neutral-800 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Programming Skills Assessment</h3>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={skillRadarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#9ca3af", fontSize: 14 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 12 }} />
                  <Radar dataKey="A" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.2} strokeWidth={3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Tabs.Content>

          {/* Activity Tab */}
          <Tabs.Content value="activity" className="space-y-6">
            <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
              <h3 className="text-xl font-semibold text-white mb-4">Recent Activity Timeline</h3>
              <div className="space-y-4">
                {(statisticsData.activityItems || []).map((item, index) => (
                  <div
                    key={item.id || index}
                    className={`flex items-center justify-between py-3 ${index < (statisticsData.activityItems || []).length - 1 ? 'border-b border-neutral-800' : ''}`}
                  >
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-neutral-300">{item.title}</span>
                    </div>
                    <span className="text-neutral-500 text-sm">{item.time}</span>
                  </div>
                ))}
                {!(statisticsData.activityItems || []).length && (
                  <div className="text-neutral-500">No recent activity.</div>
                )}
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
