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
  const [expiredTasks, setExpiredTasks] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
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
        setExpiredTasks(data.expiredTasks || []);
        setPendingTasks(data.pendingTasks || []);
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
        {isLoading ? (
          <div className="flex items-center gap-3 text-muted py-20 justify-center">
            <div className="w-5 h-5 border-2 border-[#2a8c78] border-t-transparent rounded-full animate-spin" />
            Loading dashboard...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-[1fr_280px] gap-6 items-stretch">
              <Banner user={user} />
              <ProfilePanel 
                stats={stats}
                user={user} 
                showProfile={true}
                showTasks={false}
              />
            </div>

            <ProgressSection progressData={progressData} />
            <AssignmentsSection
              assignedTasks={assignedTasks}
              upcomingTasks={expiredTasks}
              pendingTasks={pendingTasks}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
