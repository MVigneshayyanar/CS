import { useEffect, useState } from "react";
import { TrendingUp, Bell, Search } from "lucide-react";
import ProgressSection from "../../components/Student/ProgressSection";
import StatsSection from "../../components/Student/StatsSection";
import AssignmentsSection from "../../components/Student/AssignmentsSection";
import ProfilePanel from "./ProfilePanel";
import Banner from "./Banner";
import { fetchStudentDashboard } from "@/services/studentService";

const Dashboard = () => {
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await fetchStudentDashboard();
        const data = result?.data || {};
        setProgressData(data.progressData || []);
        setStats(data.stats || []);
        setAssignedTasks(data.assignedTasks || []);
        setUpcomingTasks(data.upcomingTasks || []);
        setUser(data.user);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to load student dashboard from backend";
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a6b5c] rounded-xl flex items-center justify-center shadow-md shadow-[#2a8c78]/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-heading leading-tight">
                Dashboard
              </h1>
              <p className="text-xs text-muted">Track your lab progress</p>
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
          <div className="grid grid-cols-[260px_1fr] gap-5 items-start">
            {/* Left Sidebar */}
            <ProfilePanel stats={stats} user={user} upcomingTasks={upcomingTasks} />

            {/* Main Content */}
            <div className="flex flex-col gap-5">
              <Banner user={user} />
              <StatsSection stats={stats} />
              <ProgressSection progressData={progressData} />
              <AssignmentsSection
                assignedTasks={assignedTasks}
                upcomingTasks={upcomingTasks}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
