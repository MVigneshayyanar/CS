import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useSidebar } from "./context/SidebarContext";

// Utility to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import TopLogout from "./pages/God/TopLogout";
import FacultySidebar from "./components/Faculty/FacultySidebar";
import LoginPage from "./pages/Auth/LoginPage";
import { logoutUser } from "./services/authService";

// Student pages
import Dashboard from "./pages/Student/Dashboard";
import Labs from "./pages/Student/Labs";
import Experiments from "./pages/Student/Experiments";
import ExperimentView from "./components/Student/ExperimentView";
import Statistics from "./pages/Student/Statistics";
import Reports from "./pages/Student/Reports";
import Settings from "./pages/Student/Settings";

// Faculty pages
import FacultyDashboard from "./pages/Faculty/FacultyDashboard";
import FacultyLabManagement from "./pages/Faculty/FacultyLabManagement";
import FacultySettings from "./pages/Faculty/FacultySettings";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import StudentManagement from './components/Admin/StudentManagement';
import FacultyManagement from './components/Admin/FacultyManagement';
import LabManagement from './components/Admin/LabManagement';
import AdminSidebar from "./components/Admin/AdminSidebar";
import ExperimentManagement from "./pages/Admin/ExperimentManagement";
import GodSidebar from "./components/God/GodSidebar";
import SuperAdminSidebar from "./components/God/SuperAdminSidebar";

// Super Admin & God Mode pages
import SuperAdminDashboard from "./pages/God/SuperAdminDashboard";
import SuperAdminAddDepartmentPage from "./pages/God/SuperAdminAddDepartmentPage";
import SuperAdminSettings from "./pages/God/SuperAdminSettings";
import UniversalAdminDashboard from "./pages/God/UniversalAdminDashboard";
import AddCollegePage from "./pages/God/AddCollegePage";
import GodSettings from "./pages/God/GodSettings";

function App() {
  const { isCollapsed } = useSidebar();
  const { setTheme } = useTheme();
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [mainOffset, setMainOffset] = useState("");

  useEffect(() => {
    // Check for existing authentication
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    const storedUserType = sessionStorage.getItem("userType");

    if (isAuthenticated === "true" && storedUserType) {
      setUserType(storedUserType);
    }
    
    setIsLoading(false); // Set loading to false after checking
  }, []);

  const handleLogin = (type) => {
    setUserType(type);
    
    // Explicitly reset theme on login to avoid theme leakage from previous user
    // This allows unique sessions to start with a fresh slate
    setTheme("dark");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUserType(null);
      setTheme("dark"); // Also reset to dark on logout
    } catch (error) {
      const message = error?.response?.data?.message || "Logout failed on server. Please try again.";
      alert(message);
    }
  };

  const getTopbar = () => {
    switch (userType) {
      case "God":
        return <TopLogout onLogout={handleLogout} />; // Assuming you want TopBar for these too
      case "SuperAdmin":
        return <TopLogout onLogout={handleLogout} />; // Assuming you want TopBar for these too
      default:
        return <TopBar onLogout={handleLogout} />;
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show login if not authenticated - PASS handleLogin as prop
  if (!userType) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const getSidebar = () => {
    switch (userType) {
      case "Student":
        return <Sidebar onLogout={handleLogout} />;
      case "Faculty":
        return <FacultySidebar onLogout={handleLogout} />;
      case "Admin":
        return <AdminSidebar onLogout={handleLogout} />;
      case "God":
        return <GodSidebar onLogout={handleLogout} />;
      case "SuperAdmin":
        return <SuperAdminSidebar onLogout={handleLogout} />;
      default:
        return null;
    }
  };

  // Add this helper function to determine if sidebar should be shown
  const hasSidebar = () => {
    return userType === "Student" || userType === "Faculty" || userType === "Admin" || userType === "God" || userType === "SuperAdmin";
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen bg-[#f0f4f8] theme-transition">
        {getSidebar()}
        <div
          className={`flex-1 transition-all duration-500 ${
            hasSidebar()
              ? isCollapsed
                ? 'md:ml-28 ml-0'
                : 'md:ml-72 ml-0'
              : ''
          }`}
        >
          <main className="p-6 m-0">
            <Routes>
              {userType === "Student" ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/labs" element={<Labs />} />
                  <Route path="/labs/experiments" element={<Experiments />} />
                  <Route path="/labs/experiments/view" element={<ExperimentView />} />
                  <Route path="/statistics" element={<Statistics />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
              ) : userType === "Faculty" ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<FacultyDashboard />} />
                  <Route path="/labs" element={<FacultyLabManagement />} />
                  <Route path="/settings" element={<FacultySettings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
              ) : userType === "Admin" ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/students" element={<StudentManagement />} />
                  <Route path="/faculty" element={<FacultyManagement />} />
                  <Route path="/labs" element={<LabManagement />} />
                  <Route path="/labs/:labId/experiments" element={<ExperimentManagement />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
              ) : userType === "SuperAdmin" ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<SuperAdminDashboard />} />
                  <Route path="/add-department" element={<SuperAdminAddDepartmentPage />} />
                  <Route path="/settings" element={<SuperAdminSettings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
              ) : userType === "God" ? (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<UniversalAdminDashboard />} />
                  <Route path="/add-college" element={<AddCollegePage />} />
                  <Route path="/settings" element={<GodSettings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/" replace />} />
              )}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
