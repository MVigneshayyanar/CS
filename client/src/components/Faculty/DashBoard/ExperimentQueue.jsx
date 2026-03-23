import React, { useState } from 'react';
import { Card, CardContent, CardTitle } from '../Labs/Card';

const ExperimentQueue = ({ experimentQueueData }) => {
    const [activeTab, setActiveTab] = useState('active');

    const fallbackExperiments = {
        active: [
            {
                id: 1,
                title: 'Arrays and Pointers',
                classes: ['CSE-A', 'CSE-B'],
                deadline: '2024-01-25',
                submitted: 45,
                total: 62,
                avgScore: 87,
                priority: 'high',
                status: 'grading'
            },
            {
                id: 2,
                title: 'Control Flow Structures',
                classes: ['ECE-A'],
                deadline: '2024-01-28',
                submitted: 22,
                total: 28,
                avgScore: 91,
                priority: 'medium',
                status: 'active'
            },
            {
                id: 3,
                title: 'File Operations',
                classes: ['CSE-C', 'IT-A'],
                deadline: '2024-01-30',
                submitted: 38,
                total: 66,
                avgScore: 84,
                priority: 'low',
                status: 'active'
            }
        ],
        pending: [
            {
                id: 4,
                title: 'Database Connectivity',
                classes: ['CSE-A', 'CSE-C'],
                scheduledDate: '2024-02-01',
                estimatedTime: '3 hours',
                difficulty: 'hard',
                status: 'pending'
            },
            {
                id: 5,
                title: 'Web API Integration',
                classes: ['ECE-B'],
                scheduledDate: '2024-02-05',
                estimatedTime: '4 hours',
                difficulty: 'medium',
                status: 'pending'
            }
        ],
        completed: [
            {
                id: 6,
                title: 'Hello World Program',
                classes: ['CSE-A', 'CSE-B', 'ECE-A'],
                completedDate: '2024-01-15',
                avgScore: 96,
                completion: 100,
                feedback: 4.8
            },
            {
                id: 7,
                title: 'Variables and Data Types',
                classes: ['CSE-C', 'IT-A'],
                completedDate: '2024-01-18',
                avgScore: 89,
                completion: 98,
                feedback: 4.6
            }
        ]
    };

    const experiments = experimentQueueData || fallbackExperiments;

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'text-emerald-400';
            case 'medium': return 'text-amber-400';
            case 'hard': return 'text-red-400';
            default: return 'text-neutral-400';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'grading':
                return <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>;
            case 'active':
                return <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>;
            case 'pending':
                return <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>;
            default:
                return null;
        }
    };

    const renderActiveExperiments = () => (
        <div className="space-y-4">
            {experiments.active.map((exp) => (
                <div key={exp.id} className="bg-neutral-700/30 border border-neutral-600/30 rounded-xl p-4 hover:bg-neutral-700/50 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(exp.status)}
                                <h4 className="text-lg font-semibold text-white">{exp.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(exp.priority)}`}>
                                    {exp.priority}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-400">
                                <span>Classes: {exp.classes.join(', ')}</span>
                                <span>•</span>
                                <span>Due: {new Date(exp.deadline).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs hover:bg-blue-600/30 transition-colors duration-200">
                                Grade
                            </button>
                            <button className="px-3 py-1 bg-teal-600/20 border border-teal-500/30 rounded-lg text-teal-400 text-xs hover:bg-teal-600/30 transition-colors duration-200">
                                View
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="bg-neutral-600/30 rounded-lg p-3">
                            <p className="text-xs text-neutral-400 mb-1">Submissions</p>
                            <p className="text-lg font-bold text-white">{exp.submitted}/{exp.total}</p>
                            <div className="w-full h-1 bg-neutral-600/50 rounded-full mt-2">
                                <div 
                                    className="h-1 bg-emerald-400 rounded-full"
                                    style={{ width: `${(exp.submitted / exp.total) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="bg-neutral-600/30 rounded-lg p-3">
                            <p className="text-xs text-neutral-400 mb-1">Avg Score</p>
                            <p className="text-lg font-bold text-blue-400">{exp.avgScore}%</p>
                        </div>
                        <div className="bg-neutral-600/30 rounded-lg p-3">
                            <p className="text-xs text-neutral-400 mb-1">Status</p>
                            <p className="text-lg font-bold text-white capitalize">{exp.status}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderPendingExperiments = () => (
        <div className="space-y-4">
            {experiments.pending.map((exp) => (
                <div key={exp.id} className="bg-neutral-700/30 border border-neutral-600/30 rounded-xl p-4 hover:bg-neutral-700/50 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                {getStatusIcon(exp.status)}
                                <h4 className="text-lg font-semibold text-white">{exp.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exp.difficulty)}`}>
                                    {exp.difficulty}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-400">
                                <span>Classes: {exp.classes.join(', ')}</span>
                                <span>•</span>
                                <span>Scheduled: {new Date(exp.scheduledDate).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>Duration: {exp.estimatedTime}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-emerald-600/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs hover:bg-emerald-600/30 transition-colors duration-200">
                                Launch
                            </button>
                            <button className="px-3 py-1 bg-amber-600/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs hover:bg-amber-600/30 transition-colors duration-200">
                                Edit
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderCompletedExperiments = () => (
        <div className="space-y-4">
            {experiments.completed.map((exp) => (
                <div key={exp.id} className="bg-neutral-700/30 border border-neutral-600/30 rounded-xl p-4 hover:bg-neutral-700/50 transition-colors duration-200">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h4 className="text-lg font-semibold text-white">{exp.title}</h4>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                    Completed
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-400">
                                <span>Classes: {exp.classes.join(', ')}</span>
                                <span>•</span>
                                <span>Completed: {new Date(exp.completedDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs hover:bg-blue-600/30 transition-colors duration-200">
                                Analytics
                            </button>
                            <button className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 text-xs hover:bg-purple-600/30 transition-colors duration-200">
                                Reuse
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-neutral-600/30 rounded-lg p-3">
                            <p className="text-xs text-neutral-400 mb-1">Completion</p>
                            <p className="text-lg font-bold text-emerald-400">{exp.completion}%</p>
                        </div>
                        <div className="bg-neutral-600/30 rounded-lg p-3">
                            <p className="text-xs text-neutral-400 mb-1">Avg Score</p>
                            <p className="text-lg font-bold text-blue-400">{exp.avgScore}%</p>
                        </div>
                        <div className="bg-neutral-600/30 rounded-lg p-3">
                            <p className="text-xs text-neutral-400 mb-1">Feedback</p>
                            <p className="text-lg font-bold text-amber-400">{exp.feedback}/5.0</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <Card className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/30">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Experiment Queue
                    </CardTitle>
                    
                    {/* <button className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center gap-2 shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Experiment
                    </button> */}
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 mb-6 bg-neutral-700/30 p-1 rounded-lg">
                    {[
                        { id: 'active', label: 'Active', count: experiments.active.length },
                        { id: 'pending', label: 'Pending', count: experiments.pending.length },
                        { id: 'completed', label: 'Completed', count: experiments.completed.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                                activeTab === tab.id
                                    ? 'bg-teal-600/30 text-teal-400 border border-teal-500/30'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-600/30'
                            }`}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                activeTab === tab.id ? 'bg-teal-500/20' : 'bg-neutral-600/50'
                            }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-64">
                    {activeTab === 'active' && renderActiveExperiments()}
                    {activeTab === 'pending' && renderPendingExperiments()}
                    {activeTab === 'completed' && renderCompletedExperiments()}
                </div>
            </CardContent>
        </Card>
    );
};

export default ExperimentQueue;