import { Download, FileCheck2, FileX2, FolderKanban } from "lucide-react";

const statusClasses = {
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  not_completed: "bg-rose-50 text-rose-700 border-rose-200",
};

const ReportsSection = ({ reportData, onDownloadCompleted }) => {
  const summary = reportData?.summary || {
    totalPrograms: 0,
    completedPrograms: 0,
    notCompletedPrograms: 0,
  };
  const sections = reportData?.sections || [];

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Program Reports</h3>
            <p className="text-xs text-slate-500 mt-1">
              Section-wise report of completed and not completed programs
            </p>
          </div>
          <button
            type="button"
            onClick={onDownloadCompleted}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Completed Report
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold uppercase tracking-wide">
              <FolderKanban className="w-4 h-4" />
              Total Programs
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{summary.totalPrograms}</p>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wide">
              <FileCheck2 className="w-4 h-4" />
              Completed
            </div>
            <p className="text-2xl font-extrabold text-emerald-800 mt-2">{summary.completedPrograms}</p>
          </div>
          <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
            <div className="flex items-center gap-2 text-rose-700 text-xs font-semibold uppercase tracking-wide">
              <FileX2 className="w-4 h-4" />
              Not Completed
            </div>
            <p className="text-2xl font-extrabold text-rose-800 mt-2">{summary.notCompletedPrograms}</p>
          </div>
        </div>
      </div>

      {sections.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center text-slate-500">
          No programs available to generate report yet.
        </div>
      ) : (
        sections.map((sectionItem) => (
          <div
            key={sectionItem.section}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900">{sectionItem.section}</h4>
                <p className="text-xs text-slate-500 mt-1">Programs grouped by section</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
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
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="pb-2 font-semibold">Program</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold">Progress</th>
                    <th className="pb-2 font-semibold">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionItem.programs.map((program) => (
                    <tr key={program.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 text-slate-800 font-medium">{program.programName}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusClasses[program.status]}`}
                        >
                          {program.status === "completed" ? "Completed" : "Not Completed"}
                        </span>
                      </td>
                      <td className="py-3 text-slate-700">{program.progress}%</td>
                      <td className="py-3 text-slate-600">{program.deadline}</td>
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
