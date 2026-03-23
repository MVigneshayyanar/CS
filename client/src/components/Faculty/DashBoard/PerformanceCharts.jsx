import React from 'react';
import { 
    LineChart, 
    Line, 
    AreaChart, 
    Area, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Card, CardContent, CardTitle } from '../Labs/Card';

const PerformanceCharts = ({ classPerformanceDataProp, progressDistributionDataProp }) => {
    const classPerformanceData = classPerformanceDataProp || [
        { className: 'CSE-A', avgScore: 88, completion: 92 },
        { className: 'CSE-B', avgScore: 85, completion: 89 },
        { className: 'CSE-C', avgScore: 92, completion: 95 },
        { className: 'CSE-D', avgScore: 79, completion: 84 },
        { className: 'ECE-A', avgScore: 86, completion: 88 },
        { className: 'ECE-B', avgScore: 83, completion: 86 }
    ];

    const progressDistributionData = progressDistributionDataProp || [
        { range: '90-100%', students: 142, color: '#10b981' },
        { range: '80-89%', students: 98, color: '#3b82f6' },
        { range: '70-79%', students: 67, color: '#f59e0b' },
        { range: '60-69%', students: 28, color: '#ef4444' },
        { range: '<60%', students: 13, color: '#6b7280' }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-neutral-800/95 backdrop-blur-sm border border-neutral-600/50 rounded-lg p-3 shadow-xl">
                <p className="font-semibold text-white mb-1">{label}</p>
                {payload.map((entry, index) => {
                    // Safe string checking before using includes()
                    const name = entry.name || '';
                    const isPercentage = typeof name === 'string' && 
                        (name.includes('Score') || name.includes('completion') || name.includes('Rate'));
                    
                    return (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {name}: {entry.value}{isPercentage ? '%' : ''}
                        </p>
                    );
                })}
            </div>
        );
    }
    return null;
};


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Class Performance Comparison */}
            <Card className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/30">
                <CardContent className="p-6">
                    <CardTitle className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Class Performance
                    </CardTitle>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={classPerformanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="className" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="avgScore" fill="#3b82f6" name="Avg Score" />
                            <Bar dataKey="completion" fill="#10b981" name="Completion Rate" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Student Progress Distribution */}
            <Card className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/30">
                <CardContent className="p-6">
                    <CardTitle className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Progress Distribution
                    </CardTitle>
                    <div className="flex items-center justify-between h-64">
                        <ResponsiveContainer width="60%" height="100%">
                            <PieChart>
                                <Pie
                                    data={progressDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="students"
                                >
                                    {progressDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-40 space-y-2">
                            {progressDistributionData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div 
                                        className="w-3 h-3 rounded-full" 
                                        style={{ backgroundColor: entry.color }}
                                    ></div>
                                    <span className="text-sm text-neutral-300">{entry.range}</span>
                                    <span className="text-sm text-white font-medium ml-auto">{entry.students}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PerformanceCharts;