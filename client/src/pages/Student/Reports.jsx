import { useEffect, useState } from "react";
import { Bell, FileText, Search } from "lucide-react";
import ReportsSection from "../../components/Student/ReportsSection";
import ProfilePanel from "./ProfilePanel";
import { fetchStudentDashboard, fetchStudentReports } from "@/services/studentService";

const Reports = () => {
  const [stats, setStats] = useState([]);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [dashboardResult, reportsResult] = await Promise.all([
          fetchStudentDashboard(),
          fetchStudentReports(),
        ]);
        setStats(dashboardResult?.data?.stats || []);
        setReportData(reportsResult?.data || null);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to load student reports from backend";
        alert(message);
      }
    };

    loadReports();
  }, []);

  const handleDownloadCompleted = () => {
    const completedPrograms = reportData?.completedPrograms || [];
    if (!completedPrograms.length) {
      alert("No completed programs available to download.");
      return;
    }

    const rows = [
      ["Section", "Program", "Status", "Progress", "Deadline"],
      ...completedPrograms.map((program) => [
        program.section,
        program.programName,
        "Completed",
        `${program.progress}%`,
        program.deadline,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "completed-programs-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                Reports
              </h1>
              <p className="text-xs text-slate-400">
                Section-wise completed and not completed programs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                className="text-sm text-slate-500 outline-none bg-transparent w-44 placeholder:text-slate-400"
                placeholder="Search report here..."
              />
            </div>
            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
              <Bell className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[260px_1fr] gap-5 items-start">
          <ProfilePanel stats={stats} />
          <ReportsSection
            reportData={reportData}
            onDownloadCompleted={handleDownloadCompleted}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
