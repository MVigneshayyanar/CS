import React from 'react';
import { Card, CardContent, CardTitle } from './Card';

const ClassCard = ({ className, section, students, experiments, completionRate, onClick }) => (
    <Card
        className="bg-gradient-to-r from-blue-900/30 to-blue-800/30 hover:from-blue-800/40 hover:to-blue-700/40 border-blue-700/30 hover:border-blue-500/50 cursor-pointer group"
        onClick={onClick}
    >
        <CardContent className="flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                    <CardTitle className="text-white text-xl tracking-wide font-bold group-hover:text-blue-100 transition-colors">
                        {className}
                    </CardTitle>
                    <span className="bg-blue-600/20 text-blue-200 border border-blue-500/30 rounded-lg px-3 py-1 text-sm font-medium">
                        {section}
                    </span>
                </div>
                <div className="flex items-center gap-6 text-neutral-300 text-sm mb-4">
                    <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" />
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
                        </svg>
                        {students} students
                    </div>
                    <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        {experiments} experiments
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-neutral-200">
                        <span>Class Average</span>
                        <span className="font-semibold text-blue-300">{completionRate}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-700/50 rounded-full">
                        <div
                            className="h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${completionRate}%` }}
                        />
                    </div>
                </div>
            </div>
            <div className="ml-6">
                <svg className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </CardContent>
    </Card>
);

export default ClassCard;