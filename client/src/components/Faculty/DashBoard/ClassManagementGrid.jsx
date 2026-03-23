import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardTitle } from '../Labs/Card';

const ClassManagementGrid = ({ classesData, onClassSelect }) => {
    const [sortBy, setSortBy] = useState('name');
    const [filterYear, setfilterYear] = useState('all');

    const fallbackClasses = [
        {
            id: 1,
            name: 'CSE-A',
            subject: 'Computer Programming',
            students: 32,
            completionRate: 8,
            year: 'I',
        },
        {
            id: 2,
            name: 'CSE-B',
            subject: 'Computer Programming',
            students: 30,
            completionRate: 9,
            year: 'I',
        },
        {
            id: 3,
            name: 'CSE-A',
            subject: 'Data Structures',
            students: 28,
            completionRate: 7,
            year: 'II',
        },
        {
            id: 4,
            name: 'CSE-B',
            subject: 'Database Systems',
            students: 35,
            completionRate: 9,
            year: 'II',
        },
        {
            id: 5,
            name: 'CSE-A',
            subject: 'Web Development',
            students: 26,
            completionRate: 8,
            year: 'III',
        },
        {
            id: 6,
            name: 'CSE-B',
            subject: 'Computer Programming',
            students: 31,
            completionRate: 6,
            year: 'III',
        },
        {
            id: 7,
            name: 'CSE-A',
            subject: 'Web Development',
            students: 26,
            completionRate: 8,
            year: 'IV',
        },
        {
            id: 8,
            name: 'CSE-B',
            subject: 'Computer Programming',
            students: 31,
            completionRate: 7,
            year: 'IV',
        }
    ];

    const yearDetails = [
        { year: 'I', color: 'text-emerald-400', roundedColor: 'bg-emerald-400', totalExperiments: 12 },
        { year: 'II', color: 'text-blue-400', roundedColor: 'bg-blue-400', totalExperiments: 10 },
        { year: 'III', color: 'text-amber-400', roundedColor: 'bg-amber-400', totalExperiments: 8 },
        { year: 'IV', color: 'text-purple-400', roundedColor: 'bg-purple-400', totalExperiments: 10 },
    ];

    const classes = useMemo(() => classesData || fallbackClasses, [classesData]);

    const filteredClasses = classes.filter(classItem => {
        if (filterYear === 'all') return true;
        return classItem.year === filterYear;
    });

    return (
        <Card className="bg-neutral-800/50 backdrop-blur-sm border-neutral-700/30">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <CardTitle className="text-xl font-semibold text-white flex items-center gap-2">
                        <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        My Classes ({filteredClasses.length})
                    </CardTitle>

                    <div className="flex items-center gap-4">
                        {/* Filter */}
                        <select
                            value={filterYear}
                            onChange={(e) => setfilterYear(e.target.value)}
                            className="bg-neutral-700/50 border border-neutral-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                        >
                            <option value="all">All Classes</option>
                            <option value="I">I-year</option>
                            <option value="II">II-year</option>
                            <option value="III">III-year</option>
                            <option value="IV">IV-year</option>
                        </select>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClasses.map((classItem) => (
                        <div
                            key={classItem.id}
                            onClick={() => onClassSelect && onClassSelect(classItem)}
                            className="bg-neutral-700/30 border border-neutral-600/30 rounded-xl p-5 hover:bg-neutral-700/50 hover:border-neutral-500/50 transition-all duration-300 cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white group-hover:text-teal-100 transition-colors">
                                        {classItem.name}
                                    </h3>
                                    <p className="text-sm text-neutral-400">{classItem.subject}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${yearDetails.find(y => y.year === classItem.year)?.roundedColor || 'bg-white'}`}></div>
                                    <span className={`text-xs font-medium ${yearDetails.find(y => y.year === classItem.year)?.color || 'text-white'}`}>
                                        {classItem.year}
                                    </span>
                                </div>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                {/* Students - full width (span 2 columns) */}
                                <div className="bg-neutral-600/30 rounded-lg p-3 col-span-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" />
                                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
                                        </svg>
                                        <span className="text-xs text-neutral-400">Students</span>
                                    </div>
                                    <p className="text-lg font-bold text-white">{classItem.students}</p>
                                </div>

                                {/* Completion - half */}
                                <div className="bg-neutral-600/30 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-xs text-neutral-400">Completion</span>
                                    </div>
                                    <p className="text-lg font-bold">{classItem.completionRate}</p>
                                </div>

                                {/* Total - half */}
                                <div className="bg-neutral-600/30 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75h17.25M3 14.25h11.25M3 19.5h6.75M3 4.5h17.25" />
                                        </svg>
                                        <span className="text-xs text-neutral-400">Total</span>
                                    </div>
                                    <p className="text-lg font-bold">
                                        {yearDetails.find(y => y.year === classItem.year)?.totalExperiments || 0}
                                    </p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>

                {filteredClasses.length === 0 && (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-neutral-400 mb-2">No classes found</p>
                        <p className="text-neutral-500 text-sm">Try adjusting your filters</p>
                    </div>
                )}
            </CardContent>
        </Card >
    );
};

export default ClassManagementGrid;