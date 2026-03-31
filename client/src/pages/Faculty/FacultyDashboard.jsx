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
  <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[#f0f7f5] rounded-lg flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#1a6b5c]" />
        </div>
        <h3 className="text-sm font-extrabold text-heading">{title}</h3>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeBg || "bg-[#f0f7f5]"} ${badgeColor || "text-[#134d42]"}`}
          >
            {badge}
          </span>
        )}
        {action && (
          <button
            onClick={onAction}
            className="text-[10px] font-bold text-[#1a6b5c] hover:underline"
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
  const username = sessionStorage.getItem("username") || "Professor";
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
      barColor: "bg-blue-400",
      barWidth: "100%",
    },
    {
      title: "Total Students",
      value: `${dashboardData?.quickStats?.totalStudents ?? 0}`,
      icon: <Users className="w-5 h-5 text-[#2a8c78]" />,
      iconBg: "bg-[#f0f7f5]",
      numColor: "text-[#1a6b5c]",
      barColor: "bg-[#3aa892]",
      barWidth: "100%",
    },
    {
      title: "Pending Reviews",
      value: `${dashboardData?.quickStats?.pendingSubmissions ?? 0}`,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      iconBg: "bg-amber-50",
      numColor: "text-amber-600",
      barColor: "bg-amber-400",
      barWidth: `${Math.min(100, (dashboardData?.quickStats?.pendingSubmissions ?? 0) * 10)}%`,
    },
    {
      title: "Overall Completion",
      value: `${dashboardData?.quickStats?.overallCompletion ?? 0}%`,
      icon: <BarChart2 className="w-5 h-5 text-violet-500" />,
      iconBg: "bg-violet-50",
      numColor: "text-violet-600",
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
            showPendingActions={false}
          />
        </div>
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
            className="flex items-center gap-2 px-4 py-2 bg-card border border-theme rounded-xl hover:bg-alt transition-all text-body text-sm font-semibold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-heading">
              {selectedClass?.name}
            </h1>
            <p className="text-xs text-muted mt-0.5">
              {selectedClass?.subject} · {selectedClass?.students} Students
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-sm">
            <CheckSquare className="w-3.5 h-3.5" />
            Grade Assignments
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a6b5c] text-white text-xs font-bold rounded-xl hover:bg-[#134d42] transition-all shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            New Experiment
          </button>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="bg-card border border-theme-light rounded-2xl p-10 text-center shadow-sm">
        <div className="w-14 h-14 bg-alt rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-7 h-7 text-muted" />
        </div>
        <h3 className="text-base font-extrabold text-heading mb-2">
          Class Detail View
        </h3>
        <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
          Student lists, individual progress tracking, detailed analytics, and
          class-specific tools will appear here.
        </p>
      </div>
    </div>
  );

  /* ══════════ RENDER ══════════ */
  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a6b5c] rounded-xl flex items-center justify-center shadow-md shadow-[#2a8c78]/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-heading leading-tight">
                Faculty Dashboard
              </h1>
              <p className="text-xs text-muted">
                Track your class progress
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card border border-theme rounded-xl px-4 py-2 shadow-sm">
              <Search className="w-4 h-4 text-muted" />
              <input
                className="text-sm text-body outline-none bg-transparent w-44 placeholder:text-muted"
                placeholder="Search anything here..."
              />
            </div>
            <div className="w-9 h-9 bg-card border border-theme rounded-xl flex items-center justify-center shadow-sm">
              <Bell className="w-4 h-4 text-body" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-muted py-20 justify-center">
            <div className="w-5 h-5 border-2 border-[#2a8c78] border-t-transparent rounded-full animate-spin" />
            Loading dashboard...
          </div>
        ) : (
          <>
            {/* ── Welcome Banner (dashboard view only) ── */}
            {activeView === "dashboard" && (
              <div className="relative bg-[#1a6b5c] rounded-2xl px-7 py-5 mb-5 flex items-center justify-between overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-lg font-extrabold text-white mb-1">
                    Good Morning, {dashboardData?.user?.name || username}!
                  </h2>
                  <p className="text-teal-100 text-xs max-w-sm leading-relaxed mb-3">
                    You have{" "}
                    {dashboardData?.quickStats?.pendingSubmissions ?? 0} pending
                    submissions and experiments waiting for review today.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full"
                    >
                      Real-time Academic Overview
                    </span>
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
