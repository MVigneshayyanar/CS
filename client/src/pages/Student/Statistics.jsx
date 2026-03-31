import React, { useEffect, useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle,
  TrendingUp,
  BarChart3,
  Zap,
  Activity,
  Target,
  ChevronRight,
  Layout
} from "lucide-react";
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

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-card rounded-2xl p-4 border border-theme-light shadow-sm flex items-center gap-4">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{title}</p>
      <h3 className="text-lg font-black text-heading">{value}</h3>
    </div>
  </div>
);

const ProgressCard = ({ lab }) => (
  <div className="bg-card rounded-2xl p-4 border border-theme-light flex items-center justify-between group hover:border-[#c2e6de] transition-all">
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-bold text-heading mb-1 truncate">{lab.name}</h4>
      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-[120px] bg-alt h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#2a8c78] h-full rounded-full transition-all duration-1000" style={{ width: `${lab.progress}%` }} />
        </div>
        <span className="text-[10px] font-black text-[#1a6b5c]">{lab.progress}%</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{lab.completed}/{lab.assignments}</p>
      <p className="text-[9px] text-muted font-medium italic">completed</p>
    </div>
  </div>
);

const LabProgressChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
        />
        <Tooltip
          cursor={{ fill: '#f8fafc', radius: 4 }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-card p-3 rounded-lg shadow-xl border border-theme-light">
                  <p className="text-[10px] font-black uppercase text-muted mb-1">{payload[0].payload.name}</p>
                  <p className="text-sm font-black text-[#1a6b5c]">{payload[0].value}% Complete</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="progress" fill="#0d9488" radius={[6, 6, 6, 6]} barSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function Statistics() {
  const [isLoading, setIsLoading] = useState(true);
  const [statisticsData, setStatisticsData] = useState({
    metrics: { labsCompleted: "0/1", studyHours: "8h", assignmentsDue: 1 },
    myLabsData: [],
    skillRadarData: [],
    activityItems: [],
  });

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const result = await fetchStudentStatistics();
        setStatisticsData(result?.data || statisticsData);
      } catch (error) {
        console.error("Failed to load statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStatistics();
  }, []);

  const myLabsData = statisticsData.myLabsData || [];
  const skillRadarData = statisticsData.skillRadarData || [];

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-20">

        {/* Simple Statistics Header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#2a8c78] flex items-center justify-center shadow-lg shadow-[#2a8c78]/20">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-heading tracking-tight leading-none uppercase mb-1">Statistics</h1>
            <p className="text-xs text-muted font-bold uppercase tracking-widest">Your learning journey at a glance</p>
          </div>
        </div>

        {/* 4 Compact Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Labs Completed"
            value={statisticsData.metrics?.labsCompleted}
            icon={CheckCircle}
            colorClass="bg-[#f0f7f5] text-[#1a6b5c]"
          />
          <StatCard
            title="Study Hours"
            value={statisticsData.metrics?.studyHours}
            icon={Clock}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Tasks Due"
            value={statisticsData.metrics?.assignmentsDue}
            icon={Calendar}
            colorClass="bg-orange-50 text-orange-600"
          />
          <StatCard
            title="Avg Accuracy"
            value={statisticsData.metrics?.accuracy || "92%"}
            icon={Target}
            colorClass="bg-[#f0f7f5] text-[#1a6b5c]"
          />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Progress Chart Module */}
          <div className="lg:col-span-2 bg-card rounded-3xl p-8 border border-theme-light shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-heading uppercase tracking-widest flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2a8c78]" />
                Lab Progress Overview
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-alt rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[#2a8c78]" />
                <span className="text-[10px] font-bold text-body uppercase tracking-widest leading-none">Overall - {statisticsData.metrics?.overallProgress || 0}%</span>
              </div>
            </div>
            <LabProgressChart data={myLabsData} />
          </div>

          {/* Skills Component Module */}
          <div className="bg-card rounded-3xl p-8 border border-theme-light shadow-sm">
            <h3 className="text-sm font-black text-heading uppercase tracking-widest flex items-center gap-2 mb-8">
              <Zap className="w-4 h-4 text-purple-500" />
              Skill Progress
            </h3>
            <div className="space-y-4">
              {myLabsData.map((lab) => (
                <ProgressCard key={lab.name} lab={lab} />
              ))}
              {!myLabsData.length && <p className="text-center py-10 text-xs text-muted font-bold uppercase tracking-widest">No lab data yet</p>}
            </div>
          </div>

        </div>

        {/* Radar & Activity row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">

          {/* Skills Radar */}
          <div className="bg-card rounded-3xl p-8 border border-theme-light shadow-sm">
            <h3 className="text-sm font-black text-heading uppercase tracking-widest flex items-center gap-2 mb-8">
              <Activity className="w-4 h-4 text-[#2a8c78]" />
              Technical Competence
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }} />
                  <Radar name="Skills" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.1} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Pulse */}
          <div className="bg-card rounded-3xl p-8 border border-theme-light shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-heading uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" />
                Recent Activity
              </h3>
              <button className="text-[10px] font-black text-[#1a6b5c] uppercase tracking-widest">View History</button>
            </div>
            <div className="space-y-1">
              {(statisticsData.activityItems || []).slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-alt transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2a8c78]" />
                    <span className="text-sm font-bold text-heading">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-muted font-bold ">{item.time}</span>
                </div>
              ))}
              {!(statisticsData.activityItems || []).length && <p className="text-center py-10 text-xs text-muted font-bold uppercase tracking-widest">No recent pulse</p>}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
