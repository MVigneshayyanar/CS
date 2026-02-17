import React from 'react';
import { Card, CardContent, CardTitle } from './Card';

const SubjectCard = ({ subject, totalClasses, totalStudents, onClick }) => (
    <Card
        className="bg-gradient-to-r from-teal-900/30 to-teal-800/30 hover:from-teal-800/40 hover:to-teal-700/40 border-teal-700/30 hover:border-teal-500/50 cursor-pointer group"
        onClick={onClick}
    >
        <CardContent className="flex items-center justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                    <CardTitle className="text-white text-xl tracking-wide font-bold group-hover:text-teal-100 transition-colors">
                        {subject}
                    </CardTitle>
                </div>
                <div className="flex items-center gap-6 text-neutral-300 text-sm mb-3">
                    <div className="flex items-center gap-2 bg-teal-600/20 px-3 py-1 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {totalClasses} classes
                    </div>
                    <div className="flex items-center gap-2 bg-teal-600/20 px-3 py-1 rounded-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" />
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
                        </svg>
                        {totalStudents} students
                    </div>
                </div>
            </div>
            <div className="ml-6">
                <svg className="w-6 h-6 text-teal-400 group-hover:text-teal-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </CardContent>
    </Card>
);

export default SubjectCard;