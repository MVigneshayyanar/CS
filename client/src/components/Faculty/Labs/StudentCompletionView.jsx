import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StudentCompletionView = ({ experiment, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showDueDateModal, setShowDueDateModal] = useState(false);
    const [dueDate, setDueDate] = useState(experiment?.dueDate || '');

    // Sample data
    const completedStudents = [
        { name: "ABCDEFGH", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
        { name: "CEFGHI", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
        { name: "DEF AQRGH", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
        { name: "GHI", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
        { name: "JKL", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
        { name: "MNO", id: "CSE001", score: 95, submissionDate: "2024-01-15" },
        { name: "PQR", id: "CSE002", score: 88, submissionDate: "2024-01-14" },
        { name: "STU", id: "CSE003", score: 92, submissionDate: "2024-01-16" },
        { name: "STU", id: "CSE003", score: 92, submissionDate: "2024-01-16" },
        { name: "STU", id: "CSE003", score: 92, submissionDate: "2024-01-16" },
    ];

    const notCompletedStudents = [
        { name: "VW", id: "CSE004", daysOverdue: 7 },
        { name: "YZ", id: "CSE005", daysOverdue: 3 },
    ];

    const filteredCompletedStudents = useMemo(() => {
        if (!searchQuery.trim()) return completedStudents || [];
        const query = searchQuery.toLowerCase();
        
        const filtered = (completedStudents || []).filter(student => {
            if (!student) return false;
            const nameMatch = student.name && student.name.toLowerCase().startsWith(query);
            const idMatch = student.id && student.id.toLowerCase().startsWith(query);
            return nameMatch || idMatch;
        });
        
        return filtered;
    }, [completedStudents, searchQuery]);

    const filteredNotCompletedStudents = useMemo(() => {
        if (!searchQuery.trim()) return notCompletedStudents || [];
        const query = searchQuery.toLowerCase();
        
        const filtered = (notCompletedStudents || []).filter(student => {
            if (!student) return false;
            const nameMatch = student.name && student.name.toLowerCase().startsWith(query);
            const idMatch = student.id && student.id.toLowerCase().startsWith(query);
            return nameMatch || idMatch;
        });
        
        return filtered;
    }, [notCompletedStudents, searchQuery]);

    const chartData = [
        { name: 'Completed', value: completedStudents.length, color: '#10b981' },
        { name: 'Not Completed', value: notCompletedStudents.length, color: '#ef4444' },
    ];

    function truncateString(str, maxLength) {
        if (str.length > maxLength) {
            return str.slice(0, maxLength - 5) + '...';
        }
        return str;
    }

    const scoreData = completedStudents.slice(0, 5).map(student => ({
        name: truncateString(student.name.split(' ')[0], 10),
        fullName: student.name,
        score: student.score
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white text-black rounded-lg shadow p-2">
                    <p className="font-bold">{payload[0].payload.fullName}</p>
                    <p>Score: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    const handleSetDueDate = () => {
        // Here you would typically save the due date to your backend
        console.log('Setting due date to:', dueDate);
        setShowDueDateModal(false);
        // You could also call a prop function like onDueDateChange(dueDate)
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <>
            <style>
                {`
                    .scrollbar-overlay {
                        scrollbar-width: thin;
                        scrollbar-color: transparent transparent;
                    }
                    
                    .scrollbar-overlay:hover {
                        scrollbar-color: rgba(20, 184, 166, 0.3) transparent;
                    }
                    
                    .scrollbar-overlay::-webkit-scrollbar {
                        width: 8px;
                        background: transparent;
                    }
                    
                    .scrollbar-overlay::-webkit-scrollbar-track {
                        background: transparent;
                        border-radius: 4px;
                    }
                    
                    .scrollbar-overlay::-webkit-scrollbar-thumb {
                        background: transparent;
                        border-radius: 4px;
                        transition: background 0.2s ease-in-out;
                    }
                    
                    .scrollbar-overlay:hover::-webkit-scrollbar-thumb {
                        background: rgba(20, 184, 166, 0.3);
                    }
                    
                    .scrollbar-overlay::-webkit-scrollbar-thumb:hover {
                        background: rgba(20, 184, 166, 0.5);
                    }
                    
                    .scrollbar-overlay::-webkit-scrollbar-corner {
                        background: transparent;
                    }
                `}
            </style>
            
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-700/50 rounded-2xl w-5/6 h-5/6 flex flex-col shadow-2xl">
                    <div className="flex justify-between items-center p-6 border-b border-neutral-700/50">
                        <div>
                            <h2 className="text-2xl font-semibold text-white">
                                Experiment {experiment?.number || 'N/A'}: {experiment?.name || 'Unnamed Experiment'} - Student Status
                            </h2>
                            {dueDate && (
                                <p className="text-sm text-neutral-400 mt-1">
                                    Due Date: {formatDate(dueDate)}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gradient-to-r from-neutral-600 to-neutral-700 text-white rounded-lg hover:from-neutral-700 hover:to-neutral-800 transition-all duration-200 shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                    
                    {/* Search Section with Due Date Button */}
                    <div className="px-6 py-4 border-b border-neutral-700/50">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search students by name or ID"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700/30 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all duration-200"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            
                            <button
                                onClick={() => setShowDueDateModal(true)}
                                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Set Due Date
                            </button>
                        </div>
                        
                        {searchQuery && (
                            <p className="mt-2 text-sm text-neutral-400">
                                Showing results starting with "{searchQuery}" - {filteredCompletedStudents.length + filteredNotCompletedStudents.length} students found
                            </p>
                        )}
                    </div>

                    <div className="flex-1 overflow-auto p-6 scrollbar-overlay">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Completion Pie Chart */}
                            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/30 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold mb-4 text-white">Completion Status</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Scores Bar Chart */}
                            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/30 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold mb-4 text-white">Leader Board</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={scoreData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="score" fill="#3b82f6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Completed Students */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-emerald-400">
                                    Completed Students ({filteredCompletedStudents.length})
                                </h3>
                                <div className="space-y-3">
                                    {filteredCompletedStudents && filteredCompletedStudents.length > 0 ? (
                                        filteredCompletedStudents.map((student, index) => (
                                            <div key={student?.id || index} className="bg-emerald-900/20 border border-emerald-700/30 rounded-xl p-4 backdrop-blur-sm">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-semibold text-white">{student?.name || 'Unknown'}</h4>
                                                        <p className="text-sm text-neutral-400">{student?.id || 'No ID'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-semibold text-emerald-400">{student?.score || 0}%</div>
                                                        <div className="text-xs text-neutral-500">Submitted: {student?.submissionDate || 'Unknown'}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-neutral-400 py-8">
                                            {searchQuery ? `No completed students found starting with "${searchQuery}"` : "No completed students"}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Not Completed Students */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-red-400">
                                    Not Completed Students ({filteredNotCompletedStudents.length})
                                </h3>
                                <div className="space-y-3">
                                    {filteredNotCompletedStudents && filteredNotCompletedStudents.length > 0 ? (
                                        filteredNotCompletedStudents.map((student, index) => (
                                            <div key={student?.id || index} className="bg-red-900/20 border border-red-700/30 rounded-xl p-4 backdrop-blur-sm">
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-semibold text-white">{student?.name || 'Unknown'}</h4>
                                                        <p className="text-sm text-neutral-400">{student?.id || 'No ID'}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-semibold text-red-400">
                                                            {student?.daysOverdue || 0} days overdue
                                                        </div>
                                                        <div className="text-xs text-neutral-500">Status: Pending</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center text-neutral-400 py-8">
                                            {searchQuery ? `No incomplete students found starting with "${searchQuery}"` : "No incomplete students"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Due Date Modal */}
                {showDueDateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-60">
                        <div className="bg-neutral-800/95 backdrop-blur-sm border border-neutral-700/50 rounded-xl p-6 w-96 shadow-2xl">
                            <h3 className="text-xl font-semibold text-white mb-4">Set Due Date</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-neutral-300 mb-2">
                                    Due Date
                                </label>
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full px-3 py-2 bg-neutral-700/50 border border-neutral-600/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDueDateModal(false)}
                                    className="px-4 py-2 bg-neutral-600/50 text-white rounded-lg hover:bg-neutral-600 transition-colors duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSetDueDate}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                                >
                                    Set Due Date
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default StudentCompletionView;