import React from 'react';
import { Card, CardContent, CardTitle } from './Card';

const ExperimentCard = ({ experimentName, experimentNumber, completedBy, totalStudents, avgScore, onClick }) => (
    <Card
        className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/30 hover:from-emerald-800/40 hover:to-emerald-700/40 border-emerald-700/30 hover:border-emerald-500/50 cursor-pointer group"
        onClick={onClick}
    >
        <CardContent className="flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                    <CardTitle className="text-white text-xl tracking-wide font-bold group-hover:text-emerald-100 transition-colors">
                        Exp {experimentNumber}: {experimentName}
                    </CardTitle>
                </div>
                <div className="flex items-center gap-6 text-neutral-300 text-sm mb-4">
                    <div className="flex items-center gap-2 bg-emerald-600/20 px-3 py-1 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {completedBy}/{totalStudents} completed
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-600/20 px-3 py-1 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Avg: {avgScore}%
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-neutral-200">
                        <span>Completion Rate</span>
                        <span className="font-semibold text-emerald-300">{Math.round((completedBy / totalStudents) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-700/50 rounded-full">
                        <div
                            className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${(completedBy / totalStudents) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
            <div className="ml-6">
                <svg className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </CardContent>
    </Card>
);

export default ExperimentCard;