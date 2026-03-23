import { useState } from "react";
import { TrendingUp } from "lucide-react";
import SectionHeader from "../../components/Student/SectionHeader";
import ProgressSection from '../../components/Student/ProgressSection';
import StatsSection from '../../components/Student/StatsSection';
import AssignmentsSection from '../../components/Student/AssignmentsSection';

const Dashboard = () => {
  const [completed1, setCompleted1] = useState(45);
  const [completed2, setCompleted2] = useState(55);
  const [completed3, setCompleted3] = useState(70);
  const [completed4, setCompleted4] = useState(30);

  // Progress data for different laboratories
  const progressData = [
    { percentage: completed1, label: "Java", color: "teal" },
    { percentage: completed2, label: "C++", color: "blue" },
    { percentage: completed3, label: "HTML", color: "teal" },
    { percentage: completed4, label: "Python", color: "blue" }
  ];

  // Statistics data
  const stats = [
    { value: "5", label: "Total Labs", color: "teal" },
    { value: "50%", label: "Avg Progress", color: "emerald" },
    { value: "3", label: "Pending Tasks", color: "amber" },
    { value: "2", label: "Due This Week", color: "cyan" }
  ];

  // Assignment data
  const assignedTasks = [
    {
      title: "Develop a Linear Search Algorithm",
      date: "20/07/2015"
    },
    {
      title: "Design a Library Management System Using UML",
      date: "07/08/2015"
    }
  ];

  const incompleteTasks = [
    {
      title: "Write a program to implement stack operations",
      date: "03/07/2015"
    }
  ];

  return (
    <div className="min-h-screen text-white theme-transition">
      <div className="max-w-6xl mx-auto px-6 pt-15 pb-12">
        
        {/* Header Section */}
        <SectionHeader
          icon={TrendingUp}
          title="DASHBOARD"
          subtitle="Track your laboratory progress and upcoming assignments"
        />

        {/* Progress Overview */}
        <ProgressSection progressData={progressData} />

        {/* Quick Stats */}
        <StatsSection stats={stats} />

        {/* Assignments Section */}
        <AssignmentsSection 
          assignedTasks={assignedTasks}
          incompleteTasks={incompleteTasks}
        />
      </div>
    </div>
  );
};

export default Dashboard;