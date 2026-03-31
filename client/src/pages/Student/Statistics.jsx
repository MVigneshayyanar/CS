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
} from "lucide-react";
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
  Radar,
  Tooltip,
} from "recharts";
import { fetchStudentStatistics } from "@/services/studentService";
import SectionHeader from "../../components/Student/SectionHeader";

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-card rounded-2xl p-5 border border-theme-light shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} shadow-sm`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-[10px] font-black text-muted uppercase tracking-[0.1em] mb-0.5">{title}</p>
      <h3 className="text-xl font-black text-heading font-mono tracking-tight">{value}</h3>
    </div>
  </div>
);

const ProgressCard = ({ lab }) => (
  <div className="bg-card rounded-xl p-4 border border-theme-light flex items-center justify-between group hover:border-[#1a6b5c] transition-all">
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-black text-heading mb-2 truncate uppercase tracking-tight">{lab.name}</h4>
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-alt h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#1a6b5c] h-full rounded-full transition-all duration-1000" style={{ width: `${lab.progress}%` }} />
        </div>
        <span className="text-[10px] font-black text-[#1a6b5c] font-mono">{lab.progress}%</span>
      </div>
    </div>
    <div className="text-right shrink-0 ml-4">
      <p className="text-[10px] text-muted font-black uppercase tracking-widest leading-none">{lab.completed}/{lab.assignments}</p>
      <p className="text-[8px] text-muted font-bold uppercase tracking-tighter opacity-50">Tasks</p>
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
          tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 800 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 800 }}
          axisLine={false}
          tickLine={false}
          domain={[0, 100]}
        />
        <Tooltip
          cursor={{ fill: '#f8fafc', radius: 8 }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-card p-3 rounded-xl shadow-xl border border-theme-light">
                  <p className="text-[9px] font-black uppercase text-muted mb-1 tracking-widest">{payload[0].payload.name}</p>
                  <p className="text-sm font-black text-[#1a6b5c]">{payload[0].value}% Accuracy</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="progress" fill="#1a6b5c" radius={[8, 8, 8, 8]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default function Statistics() {
  const [isLoading, setIsLoading] = useState(true);
  const [statisticsData, setStatisticsData] = useState({
    metrics: { labsCompleted: "0/0", studyHours: "0h", assignmentsDue: 0 },
    myLabsData: [],
    skillRadarData: [],
    activityItems: [],
  });

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const result = await fetchStudentStatistics();
        if (result?.data) setStatisticsData(result.data);
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
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">

        {/* Header */}
        <div className="mb-10">
          <SectionHeader
            icon={TrendingUp}
            title="Performance Metrics"
            subtitle="Detailed analysis of your technical growth, curriculum completion, and skill acquisition."
          />
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
            colorClass="bg-[#f1f5fe] text-[#2563eb]"
          />
          <StatCard
            title="Tasks Due"
            value={statisticsData.metrics?.assignmentsDue}
            icon={Calendar}
            colorClass="bg-[#fff7ed] text-[#ea580c]"
          />
          <StatCard
            title="Avg Accuracy"
            value={statisticsData.metrics?.accuracy || "0%"}
            icon={Target}
            colorClass="bg-[#fdf2f8] text-[#db2777]"
          />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Progress Chart */}
          <div className="lg:col-span-2 bg-card rounded-2xl p-7 border border-theme-light shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black text-heading uppercase tracking-[0.2em] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1a6b5c]" />
                Experiment Velocity
              </h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-[#f0f7f5] rounded-full border border-[#dff2ed]">
                <div className="w-2 h-2 rounded-full bg-[#1a6b5c] animate-pulse" />
                <span className="text-[10px] font-black text-[#1a6b5c] uppercase tracking-widest leading-none">Overall {statisticsData.metrics?.overallProgress || 0}%</span>
              </div>
            </div>
            <LabProgressChart data={myLabsData} />
          </div>

          {/* Skills Table */}
          <div className="bg-card rounded-2xl p-7 border border-theme-light shadow-sm flex flex-col">
            <h3 className="text-[11px] font-black text-heading uppercase tracking-[0.2em] flex items-center gap-2 mb-8">
              <Zap className="w-4 h-4 text-amber-500" />
              Curriculum Mastery
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar max-h-[350px]">
              {myLabsData.map((lab) => (
                <ProgressCard key={lab.name} lab={lab} />
              ))}
              {!myLabsData.length && <p className="text-center py-10 text-[10px] text-muted font-bold uppercase tracking-widest opacity-40">No technical data recorded</p>}
            </div>
          </div>

        </div>

        {/* Radar & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Radar Chart */}
          <div className="bg-card rounded-2xl p-7 border border-theme-light shadow-sm">
            <h3 className="text-[11px] font-black text-heading uppercase tracking-[0.2em] flex items-center gap-2 mb-10">
              <Activity className="w-4 h-4 text-[#1a6b5c]" />
              Competency Radar
            </h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillRadarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} />
                  <Radar name="Skills" dataKey="A" stroke="#1a6b5c" fill="#2a8c78" fillOpacity={0.15} strokeWidth={3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent History */}
          <div className="bg-card rounded-2xl p-7 border border-theme-light shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black text-heading uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" />
                Laboratory Pulse
              </h3>
              <button className="text-[10px] font-black text-[#1a6b5c] uppercase tracking-widest hover:underline">Full History</button>
            </div>
            <div className="space-y-1">
              {(statisticsData.activityItems || []).slice(0, 7).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 rounded-xl hover:bg-[#f0f7f5]/40 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1a6b5c] group-hover:scale-150 transition-transform" />
                    <span className="text-xs font-black text-heading tracking-tight">{item.title}</span>
                  </div>
                  <span className="text-[9px] text-muted font-bold uppercase tracking-widest">{item.time}</span>
                </div>
              ))}
              {!(statisticsData.activityItems || []).length && (
                <div className="flex flex-col items-center justify-center py-20 opacity-30">
                   <Activity className="w-8 h-8 mb-2" />
                   <p className="text-[10px] font-bold uppercase tracking-widest">No recent pulse</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
