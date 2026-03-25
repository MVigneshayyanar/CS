import React from "react";
import { X, Download } from "lucide-react";

const TabularDataSheet = ({ classData, onClose }) => {
  const downloadCSV = () => {
    const headers = [
      "S.No",
      "Name",
      "ID",
      ...Array.from({ length: 10 }, (_, i) => `Exp${i + 1}`),
    ];
    const csvContent = [
      headers.join(","),
      ...classData.map((s, i) =>
        [
          i + 1,
          s.name,
          s.id,
          ...s.experiments.map((e) => (e ? "✓" : "✗")),
        ].join(","),
      ),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-progress.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-[90vw] max-w-5xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900">
            Student Progress Data Sheet
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={downloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto p-5">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-3 py-2.5 text-left font-extrabold text-slate-500 border border-slate-100 rounded-l-lg">
                  S.No
                </th>
                <th className="px-3 py-2.5 text-left font-extrabold text-slate-500 border border-slate-100">
                  Name
                </th>
                <th className="px-3 py-2.5 text-left font-extrabold text-slate-500 border border-slate-100">
                  ID
                </th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <th
                    key={n}
                    className="px-2 py-2.5 font-extrabold text-slate-500 border border-slate-100 text-center"
                  >
                    Exp{n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classData.map((s, i) => (
                <tr
                  key={s.id}
                  className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  <td className="px-3 py-2.5 text-slate-500 border border-slate-100 font-semibold">
                    {i + 1}
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 border border-slate-100 font-semibold">
                    {s.name}
                  </td>
                  <td className="px-3 py-2.5 text-slate-500 border border-slate-100 font-semibold">
                    {s.id}
                  </td>
                  {s.experiments.map((done, ei) => (
                    <td
                      key={ei}
                      className="px-2 py-2.5 border border-slate-100 text-center"
                    >
                      <span
                        className={`text-sm font-bold ${done ? "text-emerald-500" : "text-red-400"}`}
                      >
                        {done ? "✓" : "✗"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TabularDataSheet;
