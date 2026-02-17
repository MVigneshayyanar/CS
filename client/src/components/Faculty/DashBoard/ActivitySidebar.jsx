import React from 'react';
import { Card, CardContent, CardTitle } from '../Labs/Card';

const ActivitySidebar = () => {
    const recentActivities = [
        {
            id: 1,
            type: 'submission',
            student: 'Rahul Kumar',
            class: 'CSE-A',
            experiment: 'Arrays & Pointers',
            time: '2 min ago',
            icon: <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        },
        {
            id: 2,
            type: 'grade',
            student: 'Priya Sharma',
            class: 'CSE-B',
            experiment: 'Control Flow',
            time: '15 min ago',
            icon: <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        },
        {
            id: 3,
            type: 'question',
            student: 'Amit Singh',
            class: 'ECE-A',
            experiment: 'File Operations',
            time: '1 hour ago',
            icon: <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        },
        {
            id: 4,
            type: 'late',
            student: 'Neha Patel',
            class: 'CSE-C',
            experiment: 'Data Structures',
            time: '3 hours ago',
            icon: <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        }
    ];

    const pendingActions = [
        {
            id: 1,
            type: 'grade',
            title: 'Grade 23 submissions',
            description: 'Arrays & Pointers experiment',
            priority: 'high',
            count: 23,
            action: 'Grade Now'
        },
        {
            id: 2,
            type: 'review',
            title: 'Review lab manual',
            description: 'New experiment approval needed',
            priority: 'medium',
            count: 1,
            action: 'Review'
        },
        {
            id: 3,
            type: 'message',
            title: 'Student messages',
            description: 'Unread queries and questions',
            priority: 'medium',
            count: 8,
            action: 'Respond'
        },
        {
            id: 4,
            type: 'deadline',
            title: 'Set deadlines',
            description: 'New experiments need dates',
            priority: 'low',
            count: 3,
            action: 'Schedule'
        }
    ];

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'text-red-400 bg-red-900/20';
            case 'medium': return 'text-amber-400 bg-amber-900/20';
            case 'low': return 'text-emerald-400 bg-emerald-900/20';
            default: return 'text-neutral-400 bg-neutral-700/20';
        }
    };

    const getActivityText = (activity) => {
        switch (activity.type) {
            case 'submission':
                return `${activity.student} submitted ${activity.experiment}`;
            case 'grade':
                return `Graded ${activity.student}'s ${activity.experiment}`;
            case 'question':
                return `${activity.student} asked about ${activity.experiment}`;
            case 'late':
                return `${activity.student} has overdue ${activity.experiment}`;
            default:
                return 'Unknown activity';
        }
    };

    return (
        <div className="space-y-6.5">
            {/* Recent Activity */}
            <Card className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/30">
                <CardContent className="p-6 mt-2 mb-2">
                    <CardTitle className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Recent Activity
                    </CardTitle>
                    <div className="space-y-3">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors duration-200">
                                <div className="flex-shrink-0 mt-1">
                                    {activity.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white leading-relaxed">
                                        {getActivityText(activity)}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-neutral-400">{activity.class}</span>
                                        <span className="text-xs text-neutral-500">•</span>
                                        <span className="text-xs text-neutral-400">{activity.time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 px-4 py-2 text-sm text-teal-400 hover:text-teal-300 hover:bg-teal-900/20 rounded-lg transition-colors duration-200">
                        View all activity
                    </button>
                </CardContent>
            </Card>

            {/* Pending Actions */}
            <Card className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/30">
                <CardContent className="p-6 mt-2 mb-2">
                    <CardTitle className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending Actions
                    </CardTitle>
                    <div className="space-y-3">
                        {pendingActions.map((action) => (
                            <div key={action.id} className="p-4 bg-neutral-700/30 rounded-lg hover:bg-neutral-700/50 transition-colors duration-200">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-sm font-medium text-white">{action.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(action.priority)}`}>
                                            {action.priority}
                                        </span>
                                        <span className="text-xs bg-neutral-600/50 text-neutral-300 px-2 py-1 rounded-full">
                                            {action.count}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-400 mb-3">{action.description}</p>
                                <button className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
                                    {action.action}
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 px-4 py-2 text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 rounded-lg transition-colors duration-200">
                        View all pending
                    </button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ActivitySidebar;