import { useEffect, useState } from "react";
import { Bell, FileText, Search, Download, AlertCircle } from "lucide-react";
import ReportsSection from "../../components/Student/ReportsSection";
import ProfilePanel from "./ProfilePanel";
import { fetchStudentDashboard, fetchStudentReports, fetchStudentLabs } from "@/services/studentService";

const Reports = () => {
  const [stats, setStats] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const handleDownloadCompleted = async () => {
    const completedPrograms = reportData?.completedPrograms || [];
    if (!completedPrograms.length) {
      alert("No completed programs available to download.");
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Dynamically import libraries
      const { jsPDF } = await import("jspdf");
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Get lab data to fetch test cases
      const labsResult = await fetchStudentLabs();
      const labs = labsResult?.data?.labs || [];

      let yPosition = 20;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - 2 * margin;

      // Add header
      pdf.setFontSize(20);
      pdf.setFont(undefined, "bold");
      pdf.text("Completed Programs Report", margin, yPosition);
      yPosition += 10;

      // Add generation date
      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      const generatedDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
      pdf.text(`Generated: ${generatedDate}`, margin, yPosition);
      yPosition += 10;

      // Add summary
      pdf.setFontSize(12);
      pdf.setFont(undefined, "bold");
      pdf.text("Summary", margin, yPosition);
      yPosition += 6;

      pdf.setFontSize(10);
      pdf.setFont(undefined, "normal");
      pdf.text(`Total Completed Programs: ${completedPrograms.length}`, margin + 5, yPosition);
      yPosition += 8;

      // Add each completed program
      completedPrograms.forEach((program, index) => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 20;
        }

        // Program title
        pdf.setFontSize(12);
        pdf.setFont(undefined, "bold");
        const titleText = `Program ${index + 1}: ${program.programName}`;
        pdf.text(titleText, margin, yPosition);
        yPosition += 8;

        // Program details
        pdf.setFontSize(10);
        pdf.setFont(undefined, "normal");
        pdf.text(`Section: ${program.section}`, margin + 5, yPosition);
        yPosition += 6;
        pdf.text(`Completion Date: ${program.deadline}`, margin + 5, yPosition);
        yPosition += 6;
        pdf.text(`Progress: ${program.progress}%`, margin + 5, yPosition);
        yPosition += 10;

        // Find student's code for this program
        const studentCode = localStorage.getItem(`experiment_${program.id}_code`) || 
                          localStorage.getItem(`${program.programName}_code`) ||
                          "Code not found";

        // Find test cases from backend data
        let testCasesData = [];
        for (const lab of labs) {
          const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
          for (let i = 0; i < experiments.length; i++) {
            if (experiments[i].title === program.programName) {
              testCasesData = experiments[i].testCases || [];
              break;
            }
          }
        }

        // Add Student Code section
        pdf.setFontSize(11);
        pdf.setFont(undefined, "bold");
        pdf.text("Student Code:", margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(9);
        pdf.setFont(undefined, "normal");
        const codeLines = pdf.splitTextToSize(studentCode, contentWidth - 10);
        const maxCodeLines = 15;
        const codeLinesDisplay = codeLines.slice(0, maxCodeLines);
        
        pdf.text(codeLinesDisplay, margin + 5, yPosition);
        yPosition += Math.min(codeLines.length, maxCodeLines) * 5 + 8;

        if (codeLines.length > maxCodeLines) {
          pdf.setFontSize(8);
          pdf.setFont(undefined, "italic");
          pdf.text(`[Code truncated - showing first ${maxCodeLines} lines of ${codeLines.length} total]`, margin + 5, yPosition);
          yPosition += 6;
        }

        yPosition += 4;

        // Add Test Cases section
        if (testCasesData.length > 0) {
          if (yPosition > pageHeight - 50) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFontSize(11);
          pdf.setFont(undefined, "bold");
          pdf.text("Test Cases:", margin, yPosition);
          yPosition += 6;

          testCasesData.forEach((testCase, tcIndex) => {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = 20;
            }

            pdf.setFontSize(9);
            pdf.setFont(undefined, "bold");
            pdf.text(`Test Case ${tcIndex + 1}:`, margin + 5, yPosition);
            yPosition += 5;

            pdf.setFont(undefined, "normal");
            if (testCase.input) {
              const inputText = typeof testCase.input === "object" 
                ? JSON.stringify(testCase.input) 
                : String(testCase.input);
              pdf.text(`Input: ${inputText}`, margin + 10, yPosition);
              yPosition += 5;
            }

            if (testCase.expectedOutput || testCase.expected_output) {
              const expectedOutput = testCase.expectedOutput || testCase.expected_output;
              const outputText = typeof expectedOutput === "object" 
                ? JSON.stringify(expectedOutput) 
                : String(expectedOutput);
              pdf.text(`Expected Output: ${outputText}`, margin + 10, yPosition);
              yPosition += 5;
            }

            if (testCase.passed) {
              pdf.setFont(undefined, "bold");
              pdf.setTextColor(34, 197, 94); // Green color
              pdf.text("✓ PASSED", margin + 10, yPosition);
              pdf.setTextColor(0, 0, 0);
              yPosition += 6;
            } else {
              pdf.setFont(undefined, "bold");
              pdf.setTextColor(239, 68, 68); // Red color
              pdf.text("✗ FAILED", margin + 10, yPosition);
              pdf.setTextColor(0, 0, 0);
              yPosition += 6;
            }
          });
        }

        yPosition += 10;
      });

      // Save the PDF
      pdf.save(`completed-programs-report-${new Date().getTime()}.pdf`);
      alert("PDF report generated successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report. Please ensure you have internet connection and try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
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
            isGeneratingPDF={isGeneratingPDF}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;
