import React from "react";
import { X, Download } from "lucide-react";

const TabularDataSheet = ({ classData, onClose }) => {
    const experimentCount = classData.length > 0 ? classData[0].experiments.length : 0;
    
    const downloadCSV = () => {
        const expHeaders = Array.from({ length: experimentCount }, (_, i) => `Exp${i + 1}`);
        const headers = ['S.No', 'Name', 'ID', ...expHeaders];
        const csvContent = [
            headers.join(','),
            ...classData.map((student, index) => [
                index + 1,
                student.name,
                student.id,
                ...student.experiments.map(exp => exp ? '✓' : '✗')
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'student-progress.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-700/50 rounded-2xl w-5/6 h-5/6 flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-neutral-700/50">
                    <h2 className="text-2xl font-semibold text-white">Student Progress Data Sheet</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={downloadCSV}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center gap-2 shadow-lg"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download CSV
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gradient-to-r from-neutral-600 to-neutral-700 text-white rounded-lg hover:from-neutral-700 hover:to-neutral-800 transition-all duration-200 shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-6">
                    <table className="w-full border-collapse border border-neutral-600/50 rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-neutral-800/50">
                                <th className="border border-neutral-600/50 px-4 py-3 text-neutral-200">S.No</th>
                                <th className="border border-neutral-600/50 px-4 py-3 text-neutral-200">Name</th>
                                <th className="border border-neutral-600/50 px-4 py-3 text-neutral-200">ID</th>
                                {Array.from({ length: experimentCount }, (_, i) => (
                                    <th key={i} className="border border-neutral-600/50 px-2 py-3 text-neutral-200">Exp{i + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {classData.map((student, index) => (
                                <tr key={student.id} className={index % 2 === 0 ? 'bg-neutral-800/30' : 'bg-neutral-800/10'}>
                                    <td className="border border-neutral-600/50 px-4 py-3 text-neutral-300">{index + 1}</td>
                                    <td className="border border-neutral-600/50 px-4 py-3 text-neutral-300">{student.name}</td>
                                    <td className="border border-neutral-600/50 px-4 py-3 text-neutral-300">{student.id}</td>
                                    {student.experiments.map((completed, expIndex) => (
                                        <td key={expIndex} className="border border-neutral-600/50 px-2 py-3 text-center">
                                            <span className={completed ? 'text-emerald-400' : 'text-red-400'}>
                                                {completed ? '✓' : '✗'}
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
