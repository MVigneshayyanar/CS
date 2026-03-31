import { useEffect, useState } from "react";
import { Bell, FileText, Search, Download, AlertCircle } from "lucide-react";
import ReportsSection from "../../components/Student/ReportsSection";
import ProfilePanel from "./ProfilePanel";
import {
  fetchStudentDashboard,
  fetchStudentReports,
  fetchStudentLabs,
} from "@/services/studentService";

const formatDisplayDate = (dateValue) => {
  if (!dateValue) return "N/A";
  const dateObj = new Date(dateValue);
  return Number.isNaN(dateObj.getTime())
    ? String(dateValue)
    : dateObj.toLocaleDateString("en-GB");
};

const getCompletionDate = (program) => {
  const submissions = Array.isArray(program?.submissions)
    ? program.submissions
    : [];
  const submissionWithCompletionDate = submissions.find(
    (sub) =>
      sub?.completedAt ||
      sub?.completed_at ||
      sub?.completionDate ||
      sub?.dateCompleted ||
      sub?.submittedAt ||
      sub?.createdAt ||
      sub?.created_at,
  );

  const testResults = Array.isArray(program?.testResults)
    ? program.testResults
    : [];
  const testResultWithTimestamp = testResults.find(
    (result) =>
      result?.timestamp ||
      result?.completedAt ||
      result?.completed_at ||
      result?.completionDate ||
      result?.dateCompleted ||
      result?.submittedAt ||
      result?.createdAt ||
      result?.created_at,
  );

  const completionDate =
    program?.completedAt ||
    program?.completed_at ||
    program?.completionDate ||
    program?.dateCompleted ||
    program?.completedOn ||
    program?.completed_on ||
    program?.submittedAt ||
    program?.submitted_at ||
    submissionWithCompletionDate?.completedAt ||
    submissionWithCompletionDate?.completed_at ||
    submissionWithCompletionDate?.completionDate ||
    submissionWithCompletionDate?.dateCompleted ||
    submissionWithCompletionDate?.submittedAt ||
    submissionWithCompletionDate?.createdAt ||
    submissionWithCompletionDate?.created_at ||
    testResultWithTimestamp?.timestamp ||
    testResultWithTimestamp?.completedAt ||
    testResultWithTimestamp?.completed_at ||
    testResultWithTimestamp?.completionDate ||
    testResultWithTimestamp?.dateCompleted ||
    testResultWithTimestamp?.submittedAt ||
    testResultWithTimestamp?.createdAt ||
    testResultWithTimestamp?.created_at ||
    program?.updatedAt;

  if (program?.status !== "completed") {
    return "N/A";
  }

  return completionDate ? formatDisplayDate(completionDate) : "N/A";
};

const getDeadlineDate = (program) => {
  const deadlineDate =
    program?.deadline || program?.dateDue || program?.dueDate || program?.date;
  return formatDisplayDate(deadlineDate);
};

const normalizeKey = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const getExperimentCompletionDate = (experiment) => {
  const submissions = Array.isArray(experiment?.submissions)
    ? experiment.submissions
    : [];
  const completedSubmission = submissions.find(
    (sub) =>
      sub?.completedAt ||
      sub?.completed_at ||
      sub?.completionDate ||
      sub?.dateCompleted ||
      sub?.submittedAt ||
      sub?.submitted_at ||
      sub?.createdAt ||
      sub?.created_at,
  );

  return (
    experiment?.completedAt ||
    experiment?.completed_at ||
    experiment?.completionDate ||
    experiment?.dateCompleted ||
    experiment?.completedOn ||
    experiment?.completed_on ||
    experiment?.submittedAt ||
    experiment?.submitted_at ||
    completedSubmission?.completedAt ||
    completedSubmission?.completed_at ||
    completedSubmission?.completionDate ||
    completedSubmission?.dateCompleted ||
    completedSubmission?.submittedAt ||
    completedSubmission?.submitted_at ||
    completedSubmission?.createdAt ||
    completedSubmission?.created_at ||
    experiment?.updatedAt ||
    null
  );
};

const buildCompletionIndexFromLabs = (labs) => {
  const bySectionAndProgram = new Map();
  const byProgram = new Map();

  (labs || []).forEach((lab) => {
    const section =
      lab?.name ||
      lab?.language ||
      lab?.section ||
      lab?.subject ||
      lab?.originalName ||
      "";
    const sectionKey = normalizeKey(section);

    const experiments = Array.isArray(lab?.experiments) ? lab.experiments : [];
    experiments.forEach((experiment) => {
      const programName = experiment?.title || experiment?.name || "";
      const programKey = normalizeKey(programName);
      if (!programKey) return;

      const completionDate = getExperimentCompletionDate(experiment);
      if (!completionDate) return;

      if (sectionKey) {
        bySectionAndProgram.set(`${sectionKey}::${programKey}`, completionDate);
      }

      if (!byProgram.has(programKey)) {
        byProgram.set(programKey, completionDate);
      }
    });
  });

  return { bySectionAndProgram, byProgram };
};

const enrichReportDataWithLabs = (reportsData, labs) => {
  if (!reportsData) return reportsData;

  const { bySectionAndProgram, byProgram } = buildCompletionIndexFromLabs(labs);
  const getIndexedCompletionDate = (section, programName) => {
    const sectionProgramKey = `${normalizeKey(section)}::${normalizeKey(programName)}`;
    return (
      bySectionAndProgram.get(sectionProgramKey) ||
      byProgram.get(normalizeKey(programName)) ||
      null
    );
  };

  const enrichedSections = (reportsData.sections || []).map((sectionItem) => {
    const sectionName = sectionItem?.section || "";
    const programs = (sectionItem.programs || []).map((program) => {
      const indexedCompletionDate = getIndexedCompletionDate(
        sectionName,
        program?.programName,
      );
      return indexedCompletionDate
        ? {
            ...program,
            completedAt: program?.completedAt || indexedCompletionDate,
          }
        : program;
    });

    return { ...sectionItem, programs };
  });

  const enrichedCompletedPrograms = (reportsData.completedPrograms || []).map(
    (program) => {
      const indexedCompletionDate = getIndexedCompletionDate(
        program?.section,
        program?.programName,
      );
      return indexedCompletionDate
        ? {
            ...program,
            completedAt: program?.completedAt || indexedCompletionDate,
          }
        : program;
    },
  );

  return {
    ...reportsData,
    sections: enrichedSections,
    completedPrograms: enrichedCompletedPrograms,
  };
};

const Reports = () => {
  const [stats, setStats] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [dashboardResult, reportsResult, labsResult] = await Promise.all([
          fetchStudentDashboard(),
          fetchStudentReports(),
          fetchStudentLabs(),
        ]);
        setStats(dashboardResult?.data?.stats || []);
        const reportsData = reportsResult?.data || null;
        const labs = labsResult?.data?.labs || [];
        setReportData(enrichReportDataWithLabs(reportsData, labs));
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
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const labsResult = await fetchStudentLabs();
      const labs = labsResult?.data?.labs || [];
      const dashResult = await fetchStudentDashboard();
      const student = dashResult?.data?.user || {};

      let yPos = 20;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // 1. Draw Header Background
      pdf.setFillColor(13, 148, 136); // Teal-600
      pdf.rect(0, 0, pageWidth, 45, "F");

      // 2. Report Header Text
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.text("LABORATORY REPORT", margin, 20);

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("OFFICIAL COMPLETION DOCUMENT", margin, 26);

      // Student Info in Header
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(`Student: ${student.name || "N/A"}`, pageWidth - margin, 20, {
        align: "right",
      });
      pdf.setFont("helvetica", "normal");
      pdf.text(`ID: ${student.username || "N/A"}`, pageWidth - margin, 26, {
        align: "right",
      });
      pdf.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        pageWidth - margin,
        32,
        { align: "right" },
      );

      yPos = 55;
      pdf.setTextColor(30, 41, 59); // Slate-800

      // 3. Summary Section
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(14);
      pdf.text("Report Summary", margin, yPos);
      yPos += 8;

      pdf.setDrawColor(226, 232, 240); // Slate-200
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(
        `Total Experiments Completed: ${completedPrograms.length}`,
        margin + 2,
        yPos,
      );
      yPos += 12;

      // 4. Detailed Programs
      completedPrograms.forEach((program, index) => {
        // Break page if near bottom
        if (yPos > pageHeight - 40) {
          pdf.addPage();
          yPos = 20;
        }

        // Program Title Header
        pdf.setFillColor(248, 250, 252); // Slate-50
        pdf.rect(margin, yPos - 5, contentWidth, 10, "F");
        pdf.setDrawColor(226, 232, 240);
        pdf.rect(margin, yPos - 5, contentWidth, 10, "D");

        pdf.setTextColor(13, 148, 136);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.text(
          `${index + 1}. ${program.programName}`,
          margin + 4,
          yPos + 1.5,
        );

        pdf.setTextColor(100, 116, 139);
        pdf.setFontSize(9);
        pdf.text(`Status: Completed`, pageWidth - margin - 4, yPos + 1.5, {
          align: "right",
        });

        yPos += 12;
        pdf.setTextColor(30, 41, 59);

        // Metadata grid
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.text("Section:", margin + 2, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(program.section || "N/A", margin + 18, yPos);

        pdf.setFont("helvetica", "bold");
        pdf.text("Completed On:", margin + 50, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(getCompletionDate(program), margin + 74, yPos);

        pdf.setFont("helvetica", "bold");
        pdf.text("Deadline:", margin + 130, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(getDeadlineDate(program), margin + 144, yPos);

        yPos += 6;

        pdf.setFont("helvetica", "bold");
        pdf.text("Performance:", margin + 2, yPos);
        pdf.setFont("helvetica", "normal");
        pdf.text(`${program.progress}% Accuracy`, margin + 24, yPos);

        yPos += 10;

        // --- CODE BOX ---
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("Implementation Code:", margin, yPos);
        yPos += 5;

        const studentCode =
          program.studentCode || "No code recorded for this session.";
        pdf.setFont("courier", "normal");
        pdf.setFontSize(8);

        const codeLines = pdf.splitTextToSize(studentCode, contentWidth - 10);
        const codeDisplay = codeLines.slice(0, 25);
        const boxHeight = codeDisplay.length * 4 + 6;

        pdf.setFillColor(250, 250, 250);
        pdf.rect(margin, yPos, contentWidth, boxHeight, "F");
        pdf.setDrawColor(226, 232, 240);
        pdf.rect(margin, yPos, contentWidth, boxHeight, "D");

        pdf.text(codeDisplay, margin + 4, yPos + 5);
        yPos += boxHeight + 10;

        // --- TEST CASES ---
        let testCasesData = [];
        for (const lab of labs) {
          const experiments = Array.isArray(lab.experiments)
            ? lab.experiments
            : [];
          const found = experiments.find(
            (e) => e.title === program.programName,
          );
          if (found) {
            testCasesData = found.testCases || [];
            break;
          }
        }

        if (testCasesData.length > 0) {
          if (yPos > pageHeight - 30) {
            pdf.addPage();
            yPos = 20;
          }

          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.text("Validation Results:", margin, yPos);
          yPos += 6;

          testCasesData.forEach((tc, tcIdx) => {
            if (yPos > pageHeight - 25) {
              pdf.addPage();
              yPos = 20;
            }

            const result = Array.isArray(program.testResults)
              ? program.testResults.find((r) => r.input === tc.input)
              : null;
            const isPassed = result ? result.passed : true;

            // Test Case Row
            pdf.setFillColor(
              isPassed ? 240 : 254,
              isPassed ? 253 : 242,
              isPassed ? 244 : 242,
            );
            pdf.rect(margin, yPos - 1, contentWidth, 8, "F");

            pdf.setFontSize(9);
            pdf.setFont("helvetica", "bold");
            pdf.text(`Test #${tcIdx + 1}`, margin + 2, yPos + 4);

            pdf.setFont("helvetica", "normal");
            const inputShort = String(tc.input).substring(0, 30);
            pdf.text(`Input: ${inputShort}`, margin + 25, yPos + 4);

            pdf.setFont("helvetica", "bold");
            if (isPassed) {
              pdf.setTextColor(21, 128, 61); // Green-700
              pdf.text("PASSED", pageWidth - margin - 5, yPos + 4, {
                align: "right",
              });
            } else {
              pdf.setTextColor(185, 28, 28); // Red-700
              pdf.text("FAILED", pageWidth - margin - 5, yPos + 4, {
                align: "right",
              });
            }
            pdf.setTextColor(30, 41, 59);
            yPos += 10;
          });
        }

        yPos += 5;
      });

      // Page numbering
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
        pdf.text("CodeSphere Academic Reports", margin, pageHeight - 10);
      }

      pdf.save(
        `LabReport_${student.username || "Student"}_${new Date().getTime()}.pdf`,
      );
    } catch (error) {
      console.error("PDF Error:", error);
      alert("Error generating professional report. Checking connection...");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a6b5c] rounded-xl flex items-center justify-center shadow-md shadow-[#2a8c78]/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-heading leading-tight">
                Reports
              </h1>
              <p className="text-xs text-muted">
                Section-wise completed and not completed programs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card border border-theme rounded-xl px-4 py-2 shadow-sm">
              <Search className="w-4 h-4 text-muted" />
              <input
                className="text-sm text-body outline-none bg-transparent w-44 placeholder:text-muted"
                placeholder="Search report here..."
              />
            </div>
            <div className="w-9 h-9 bg-card border border-theme rounded-xl flex items-center justify-center shadow-sm">
              <Bell className="w-4 h-4 text-body" />
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
