import { Download, FileCheck2, FileX2, FolderKanban } from "lucide-react";

const statusClasses = {
  completed: "bg-[#f0f7f5] text-[#134d42] border-[#c2e6de]",
  not_completed: "bg-rose-50 text-rose-700 border-rose-200",
};

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

const ReportsSection = ({
  reportData,
  onDownloadCompleted,
  isGeneratingPDF,
}) => {
  const summary = reportData?.summary || {
    totalPrograms: 0,
    completedPrograms: 0,
    notCompletedPrograms: 0,
  };
  const sections = reportData?.sections || [];

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-heading">
              Program Reports
            </h3>
            <p className="text-xs text-body mt-1">
              Section-wise report of completed and not completed programs
            </p>
          </div>
          <button
            type="button"
            onClick={onDownloadCompleted}
            disabled={isGeneratingPDF}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a6b5c] hover:bg-[#134d42] disabled:bg-[#3aa892] disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            {isGeneratingPDF ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Completed Report
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-theme bg-alt px-4 py-3">
            <div className="flex items-center gap-2 text-body text-xs font-semibold uppercase tracking-wide">
              <FolderKanban className="w-4 h-4" />
              Total Programs
            </div>
            <p className="text-2xl font-extrabold text-heading mt-2">
              {summary.totalPrograms}
            </p>
          </div>
          <div className="rounded-xl border border-[#dff2ed] bg-[#f0f7f5] px-4 py-3">
            <div className="flex items-center gap-2 text-[#134d42] text-xs font-semibold uppercase tracking-wide">
              <FileCheck2 className="w-4 h-4" />
              Completed
            </div>
            <p className="text-2xl font-extrabold text-teal-800 mt-2">
              {summary.completedPrograms}
            </p>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wide">
              <FileX2 className="w-4 h-4" />
              Not Completed
            </div>
            <p className="text-2xl font-extrabold text-rose-800 mt-2">
              {summary.notCompletedPrograms}
            </p>
          </div>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-10 text-center text-body">
          No programs available to generate report yet.
        </div>
      ) : (
        sections.map((sectionItem) => (
          <div
            key={sectionItem.section}
            className="bg-card rounded-2xl border border-theme-light shadow-sm p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              {/* <div>
                <h4 className="text-sm font-extrabold text-heading">
                  {sectionItem.section}
                </h4>
                <p className="text-xs text-body mt-1">
                  Programs grouped by section
                </p>
              </div> */}
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-[#f0f7f5] text-[#134d42]">
                  Completed: {sectionItem.completed}
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700">
                  Not Completed: {sectionItem.notCompleted}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-body border-b border-theme">
                    <th className="pb-2 font-semibold">Program</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold">Progress</th>
                    <th className="pb-2 font-semibold">Completed On</th>
                    <th className="pb-2 font-semibold">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionItem.programs.map((program) => (
                    <tr
                      key={program.id}
                      className="border-b border-theme-light last:border-0"
                    >
                      <td className="py-3 text-heading font-medium">
                        {program.programName}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClasses[program.status]}`}
                        >
                          {program.status === "completed"
                            ? "Completed"
                            : "Not Completed"}
                        </span>
                      </td>
                      <td className="py-3 text-heading">
                        {program.progress}%
                      </td>
                      <td className="py-3 text-body">
                        {getCompletionDate(program)}
                      </td>
                      <td className="py-3 text-body">
                        {getDeadlineDate(program)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReportsSection;
