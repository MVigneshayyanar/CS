import React, { useState } from 'react';
import DashboardHeader from '../../components/Faculty/DashBoard/DashboardHeader';
import QuickStatsCards from '../../components/Faculty/DashBoard/QuickStatsCards';
import PerformanceCharts from '../../components/Faculty/DashBoard/PerformanceCharts';
import ActivitySidebar from '../../components/Faculty/DashBoard/ActivitySidebar';
import ClassManagementGrid from '../../components/Faculty/DashBoard/ClassManagementGrid';
import ExperimentQueue from '../../components/Faculty/DashBoard/ExperimentQueue';
import { useEffect } from 'react';
import { fetchFacultyDashboard } from '@/services/facultyService';

const FacultyDashboard = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [activeView, setActiveView] = useState('dashboard'); // dashboard, class-detail, etc.
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const result = await fetchFacultyDashboard();
                setDashboardData(result?.data || null);
            } catch (error) {
                const message = error?.response?.data?.message || 'Failed to load faculty dashboard from backend';
                alert(message);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleClassSelect = (classItem) => {
        setSelectedClass(classItem);
        setActiveView('class-detail');
    };

    const renderDashboardView = () => (
        <>
            {/* Quick Stats Overview */}
            <QuickStatsCards
                statsData={[
                    {
                        title: "Total Classes",
                        value: `${dashboardData?.quickStats?.totalClasses || 0}`,
                        color: "from-blue-900/30 to-blue-800/30 border-blue-700/30",
                        icon: <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" /></svg>,
                    },
                    {
                        title: "Total Students",
                        value: `${dashboardData?.quickStats?.totalStudents || 0}`,
                        color: "from-emerald-900/30 to-emerald-800/30 border-emerald-700/30",
                        icon: <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" /><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} /></svg>,
                    },
                    {
                        title: "Pending Submissions",
                        value: `${dashboardData?.quickStats?.pendingSubmissions || 0}`,
                        color: "from-amber-900/30 to-amber-800/30 border-amber-700/30",
                        icon: <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                    },
                    {
                        title: "Overall Completion",
                        value: `${dashboardData?.quickStats?.overallCompletion || 0}%`,
                        color: "from-purple-900/30 to-purple-800/30 border-purple-700/30",
                        icon: <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5" /></svg>,
                    },
                ]}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* Main Content Area */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Performance Analytics */}
                    <PerformanceCharts
                        classPerformanceDataProp={dashboardData?.classPerformanceData}
                        progressDistributionDataProp={dashboardData?.progressDistributionData}
                    />

                    {/* Class Management */}
                    <ClassManagementGrid onClassSelect={handleClassSelect} classesData={dashboardData?.classes} />
                </div>
                
                {/* Left Sidebar - Activity & Actions */}
                <div className="xl:col-span-1">
                    <ActivitySidebar
                        recentActivitiesProp={dashboardData?.recentActivities}
                        pendingActionsProp={dashboardData?.pendingActions}
                    />
                </div>

                <div className="xl:col-span-4 space-y-6">
                    {/* Experiment Queue */}
                    <ExperimentQueue experimentQueueData={dashboardData?.experimentQueue} />
                </div>
            </div>
        </>
    );

    const renderClassDetailView = () => (
        <div className="space-y-6">
            {/* Back Button and Class Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveView('dashboard')}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-800/50 border border-neutral-700/30 rounded-lg hover:bg-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200 text-neutral-300 hover:text-white"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">{selectedClass?.name}</h1>
                        <p className="text-neutral-400">{selectedClass?.subject} • {selectedClass?.students} Students</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V9a4 4 0 118 0v2m-6 4h4" />
                        </svg>
                        Grade Assignments
                    </button>
                    <button className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Experiment
                    </button>
                </div>
            </div>

            {/* Class-specific content would go here */}
            <div className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/30 rounded-2xl p-8 text-center">
                <div className="max-w-md mx-auto">
                    <svg className="w-16 h-16 text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">Class Detail View</h3>
                    <p className="text-neutral-400 mb-4">Detailed class management interface would be implemented here.</p>
                    <p className="text-sm text-neutral-500">This would include student lists, individual progress tracking, detailed analytics, and class-specific tools.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen theme-transition">
            {/* Header */}

            {/* Main Content */}
            <div className="px-6 py-8">
                <div className="max-w-7xl mr-auto ml-auto">
                    {activeView === 'dashboard' && renderDashboardView()}
                    {activeView === 'class-detail' && renderClassDetailView()}
                    {isLoading && <div className="text-neutral-400">Loading dashboard...</div>}
                </div>
            </div>

            {/* Floating Action Button */}
            

        </div>
    );
};

export default FacultyDashboard;