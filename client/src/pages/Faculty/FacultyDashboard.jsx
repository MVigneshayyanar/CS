import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Bell,
  Search,
  BookOpen,
  Users,
  Clock,
  BarChart2,
  ChevronRight,
  ArrowLeft,
  Plus,
  CheckSquare,
} from "lucide-react";
import QuickStatsCards from "../../components/Faculty/DashBoard/QuickStatsCards";
import PerformanceCharts from "../../components/Faculty/DashBoard/PerformanceCharts";
import ActivitySidebar from "../../components/Faculty/DashBoard/ActivitySidebar";
import ClassManagementGrid from "../../components/Faculty/DashBoard/ClassManagementGrid";
import ExperimentQueue from "../../components/Faculty/DashBoard/ExperimentQueue";
import { fetchFacultyDashboard } from "@/services/facultyService";

/* ─── tiny reusable pieces ─── */

const SectionCard = ({
  icon: Icon,
  title,
  badge,
  badgeBg,
  badgeColor,
  action,
  onAction,
  children,
}) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-teal-600" />
        </div>
        <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeBg || "bg-teal-50"} ${badgeColor || "text-teal-700"}`}
          >
            {badge}
          </span>
        )}
        {action && (
          <button
            onClick={onAction}
            className="text-[10px] font-bold text-teal-600 hover:underline"
          >
            {action}
          </button>
        )}
      </div>
    </div>
    {children}
  </div>
);

/* ─── main component ─── */

const FacultyDashboard = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await fetchFacultyDashboard();
        setDashboardData(result?.data || null);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to load faculty dashboard from backend";
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleClassSelect = (classItem) => {
    setSelectedClass(classItem);
    setActiveView("class-detail");
  };

  /* ── stat cards config ── */
  const statsConfig = [
    {
      title: "Total Classes",
      value: `${dashboardData?.quickStats?.totalClasses ?? 0}`,
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
      iconBg: "bg-blue-50",
      numColor: "text-blue-600",
      trend: "+2 new",
      trendBg: "bg-blue-50",
      trendColor: "text-blue-700",
      barColor: "bg-blue-400",
      barWidth: "30%",
    },
    {
      title: "Total Students",
      value: `${dashboardData?.quickStats?.totalStudents ?? 0}`,
      icon: <Users className="w-5 h-5 text-emerald-500" />,
      iconBg: "bg-emerald-50",
      numColor: "text-emerald-600",
      trend: "Active",
      trendBg: "bg-emerald-50",
      trendColor: "text-emerald-700",
      barColor: "bg-emerald-400",
      barWidth: "20%",
    },
    {
      title: "Pending Submissions",
      value: `${dashboardData?.quickStats?.pendingSubmissions ?? 0}`,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      iconBg: "bg-amber-50",
      numColor: "text-amber-600",
      trend: "Review",
      trendBg: "bg-amber-50",
      trendColor: "text-amber-800",
      barColor: "bg-amber-400",
      barWidth: `${Math.min(100, (dashboardData?.quickStats?.pendingSubmissions ?? 0) * 10)}%`,
    },
    {
      title: "Overall Completion",
      value: `${dashboardData?.quickStats?.overallCompletion ?? 0}%`,
      icon: <BarChart2 className="w-5 h-5 text-violet-500" />,
      iconBg: "bg-violet-50",
      numColor: "text-violet-600",
      trend: `${dashboardData?.quickStats?.overallCompletion ?? 0}%`,
      trendBg: "bg-violet-50",
      trendColor: "text-violet-700",
      barColor: "bg-violet-400",
      barWidth: `${dashboardData?.quickStats?.overallCompletion ?? 0}%`,
    },
  ];

  /* ══════════ DASHBOARD VIEW ══════════ */
  const renderDashboardView = () => (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <QuickStatsCards statsData={statsConfig} />

      {/* Charts row + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr_260px] gap-4">
        {/* Bar chart card */}
        <SectionCard
          icon={BarChart2}
          title="Class Performance"
          badge="This Week"
        >
          <PerformanceCharts
            classPerformanceDataProp={dashboardData?.classPerformanceData}
            progressDistributionDataProp={
              dashboardData?.progressDistributionData
            }
            barOnly
          />
        </SectionCard>

        {/* Pie / distribution card — reuse same component, second chart */}
        <SectionCard
          icon={BarChart2}
          title="Progress Distribution"
          badge="All Classes"
        >
          <PerformanceCharts
            classPerformanceDataProp={dashboardData?.classPerformanceData}
            progressDistributionDataProp={
              dashboardData?.progressDistributionData
            }
            pieOnly
          />
        </SectionCard>

        {/* Activity sidebar */}
        <div className="flex flex-col gap-4">
          <ActivitySidebar
            recentActivitiesProp={dashboardData?.recentActivities}
            pendingActionsProp={dashboardData?.pendingActions}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Class management */}
        <SectionCard icon={BookOpen} title="Class Management" action="View All">
          <ClassManagementGrid
            onClassSelect={handleClassSelect}
            classesData={dashboardData?.classes}
          />
        </SectionCard>

        {/* Experiment queue */}
        <SectionCard
          icon={CheckSquare}
          title="Experiment Queue"
          badge={`${dashboardData?.experimentQueue?.length ?? 0} Pending`}
        >
          <ExperimentQueue
            experimentQueueData={dashboardData?.experimentQueue}
          />
        </SectionCard>
      </div>
    </div>
  );

  /* ══════════ CLASS DETAIL VIEW ══════════ */
  const renderClassDetailView = () => (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all text-slate-600 text-sm font-semibold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {selectedClass?.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedClass?.subject} · {selectedClass?.students} Students
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm">
            <CheckSquare className="w-3.5 h-3.5" />
            Grade Assignments
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl hover:bg-teal-700 transition-all shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            New Experiment
          </button>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-slate-400" />
        </div>
        <h3 className="text-base font-extrabold text-slate-700 mb-2">
          Class Detail View
        </h3>
        <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
          Student lists, individual progress tracking, detailed analytics, and
          class-specific tools will appear here.
        </p>
      </div>
    </div>
  );

  /* ══════════ RENDER ══════════ */
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-200">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                Faculty Dashboard
              </h1>
              <p className="text-xs text-slate-400">
                Track your class progress
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                className="text-sm text-slate-500 outline-none bg-transparent w-44 placeholder:text-slate-400"
                placeholder="Search anything here..."
              />
            </div>
            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
              <Bell className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-400 py-20 justify-center">
            <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* ── Welcome Banner (dashboard view only) ── */}
            {activeView === "dashboard" && (
              <div className="relative bg-teal-600 rounded-2xl px-7 py-5 mb-5 flex items-center justify-between overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-lg font-extrabold text-white mb-1">
                    Good Morning, Professor!
                  </h2>
                  <p className="text-teal-100 text-xs max-w-sm leading-relaxed mb-3">
                    You have{" "}
                    {dashboardData?.quickStats?.pendingSubmissions ?? 0} pending
                    submissions and experiments waiting for review today.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      {
                        label: `${dashboardData?.quickStats?.totalClasses ?? 0} Classes Active`,
                        icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5",
                      },
                      {
                        label: `${dashboardData?.quickStats?.pendingSubmissions ?? 0} Pending Reviews`,
                        icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                      },
                      {
                        label: `${dashboardData?.quickStats?.overallCompletion ?? 0}% Overall Completion`,
                        icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z",
                      },
                    ].map((c, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d={c.icon}
                          />
                        </svg>
                        {c.label}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Hex deco */}
                <div className="flex gap-2 opacity-90 pointer-events-none select-none flex-shrink-0">
                  <div className="flex flex-col gap-2">
                    <div
                      style={{
                        width: 44,
                        height: 52,
                        background: "rgba(255,255,255,.15)",
                        clipPath:
                          "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                      }}
                    />
                    <div
                      style={{
                        width: 28,
                        height: 34,
                        background: "rgba(255,215,0,.3)",
                        clipPath:
                          "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                        alignSelf: "flex-end",
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2 mt-3">
                    <div
                      style={{
                        width: 28,
                        height: 34,
                        background: "rgba(255,215,0,.3)",
                        clipPath:
                          "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                      }}
                    />
                    <div
                      style={{
                        width: 44,
                        height: 52,
                        background: "rgba(255,255,255,.15)",
                        clipPath:
                          "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeView === "dashboard" && renderDashboardView()}
            {activeView === "class-detail" && renderClassDetailView()}
          </>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
