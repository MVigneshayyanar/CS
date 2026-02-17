import React from 'react';
import { Card, CardContent } from '../Labs/Card';

const StatCard = ({ title, value, change, changeType, icon, color }) => (
    <Card className={`bg-gradient-to-r ${color} border-opacity-30 hover:border-opacity-50 transition-all duration-300`}>
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-lg font-medium text-neutral-300 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white mt-2">{value}</p>
                    {change && (
                        <div className="flex items-center gap-1">
                            <svg 
                                className={`w-3 h-3 ${changeType === 'increase' ? 'text-emerald-400' : 'text-red-400'} ${changeType === 'increase' ? '' : 'rotate-180'}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                            <span className={`text-xs font-medium ${changeType === 'increase' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {change}
                            </span>
                        </div>
                    )}
                </div>
                <div className="ml-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

const QuickStatsCards = () => {
    const stats = [
        {
            title: "Total Classes",
            value: "12",
            color: "from-blue-900/30 to-blue-800/30 border-blue-700/30",
            icon: <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        },
        {
            title: "Total Students",
            value: "348",
            color: "from-emerald-900/30 to-emerald-800/30 border-emerald-700/30",
            icon: <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
            </svg>
        },
        {
            title: "Pending Submissions",
            value: "47",
            color: "from-amber-900/30 to-amber-800/30 border-amber-700/30",
            icon: <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        },
        {
            title: "Overall Completion",
            value: "87%",
            color: "from-purple-900/30 to-purple-800/30 border-purple-700/30",
            icon: <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default QuickStatsCards;