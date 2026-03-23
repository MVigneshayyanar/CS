import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import SectionHeader from "../../components/Student/SectionHeader";
import ProgressSection from '../../components/Student/ProgressSection';
import StatsSection from '../../components/Student/StatsSection';
import AssignmentsSection from '../../components/Student/AssignmentsSection';
import { fetchStudentDashboard } from '@/services/studentService';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [incompleteTasks, setIncompleteTasks] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const result = await fetchStudentDashboard();
        setProgressData(result?.data?.progressData || []);
        setStats(result?.data?.stats || []);
        setAssignedTasks(result?.data?.assignedTasks || []);
        setIncompleteTasks(result?.data?.incompleteTasks || []);
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to load student dashboard from backend';
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen text-white theme-transition">
      <div className="max-w-6xl mx-auto px-6 pt-15 pb-12">
        
        {/* Header Section */}
        <SectionHeader
          icon={TrendingUp}
          title="DASHBOARD"
          subtitle="Track your laboratory progress and upcoming assignments"
        />

        {isLoading && (
          <div className="mb-8 text-neutral-400">Loading dashboard...</div>
        )}

        {/* Progress Overview */}
        {!isLoading && <ProgressSection progressData={progressData} />}

        {/* Quick Stats */}
        {!isLoading && <StatsSection stats={stats} />}

        {/* Assignments Section */}
        {!isLoading && (
          <AssignmentsSection
            assignedTasks={assignedTasks}
            incompleteTasks={incompleteTasks}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;