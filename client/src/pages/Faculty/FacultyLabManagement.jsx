import React, { useEffect, useMemo, useState } from 'react';
import ClassCard from '../../components/Faculty/Labs/ClassCard';
import  SubjectCard from '../../components/Faculty/Labs/SubjectCard.jsx';
import ExperimentCard from '../../components/Faculty/Labs/ExperimentCard.jsx';
import TabularDataSheet from '../../components/Faculty/Labs/TabularDataSheet.jsx';
import StudentCompletionView from '../../components/Faculty/Labs/StudentCompletionView.jsx';
import LabManualView from '../../components/Faculty/Labs/LabManualView.jsx';
import ExperimentsList from '../../components/Faculty/Labs/ExperimentsList.jsx';
import { fetchFacultyLabs } from '@/services/facultyService';

const FacultyLabManagement = () => {
    const [currentView, setCurrentView] = useState('subjects');
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedExperiment, setSelectedExperiment] = useState(null);
    const [showExperimentsList, setShowExperimentsList] = useState(false);
    const [showDataSheet, setShowDataSheet] = useState(false);
    const [showLabManual, setShowLabManual] = useState(false);
    const [showStudentCompletion, setShowStudentCompletion] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [labsPayload, setLabsPayload] = useState({ subjects: [], classes: [], experiments: [] });

    useEffect(() => {
        const loadLabs = async () => {
            try {
                const result = await fetchFacultyLabs();
                setLabsPayload(result?.data || { subjects: [], classes: [], experiments: [] });
            } catch (error) {
                const message = error?.response?.data?.message || 'Failed to load faculty labs from backend';
                alert(message);
            } finally {
                setIsLoading(false);
            }
        };

        loadLabs();
    }, []);

    const subjects = labsPayload.subjects || [];
    const classesBySubject = useMemo(() => {
        const groups = {};
        (labsPayload.classes || []).forEach((classItem) => {
            const subjectId = classItem.subjectId;
            if (!groups[subjectId]) {
                groups[subjectId] = [];
            }
            groups[subjectId].push(classItem);
        });
        return groups;
    }, [labsPayload.classes]);

    const experiments = useMemo(() => {
        if (!selectedClass) {
            return [];
        }
        return (labsPayload.experiments || []).filter((exp) => exp.className === selectedClass.name);
    }, [labsPayload.experiments, selectedClass]);

    const classData = (selectedClass?.students || 0) > 0
        ? Array.from({ length: selectedClass.students }).slice(0, 10).map((_, index) => ({
            id: `${selectedClass.name}-${index + 1}`,
            name: `Student ${index + 1}`,
            experiments: Array.from({ length: Math.max(10, experiments.length || 10) }, (_, expIndex) => expIndex < Math.round((selectedClass.completionRate || 0) / 10)),
        }))
        : [];

    // Event handlers
    const handleSubjectClick = (subject) => {
        setSelectedSubject(subject);
        setCurrentView('classes');
    };

    const handleClassClick = (classItem) => {
        setSelectedClass(classItem);
        setCurrentView('experiments');
    };

    const handleExperimentClick = (experiment) => {
        setSelectedExperiment(experiment);
        setShowStudentCompletion(true);
    };

    const handleBack = () => {
        if (currentView === 'experiments') {
            setCurrentView('classes');
            setSelectedClass(null);
        } else if (currentView === 'classes') {
            setCurrentView('subjects');
            setSelectedSubject(null);
        }
    };

    const handleViewLabManual = (experiment) => {
        setSelectedExperiment(experiment);
        setShowExperimentsList(false);
        setShowLabManual(true);
    };

    const getBreadcrumb = () => {
        let breadcrumb = "Faculty Dashboard";
        if (selectedSubject) breadcrumb += ` > ${selectedSubject.name}`;
        if (selectedClass) breadcrumb += ` > ${selectedClass.name}`;
        return breadcrumb;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {isLoading && <div className="text-neutral-400 mb-6">Loading lab management data...</div>}
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                                Lab Management
                            </h1>
                            <p className="text-neutral-400 text-lg">{getBreadcrumb()}</p>
                        </div>
                        {currentView !== 'subjects' && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neutral-700 to-neutral-800 text-white rounded-xl hover:from-neutral-600 hover:to-neutral-700 transition-all duration-200 shadow-lg backdrop-blur-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="grid gap-8">
                    {/* Subjects View */}
                    {currentView === 'subjects' && (
                        <>
                            <h2 className="text-2xl font-semibold text-neutral-200 mb-4">Select Subject</h2>
                            {subjects.map((subject) => (
                                <SubjectCard
                                    key={subject.id}
                                    subject={subject.name}
                                    totalClasses={subject.totalClasses}
                                    totalStudents={subject.totalStudents}
                                    onClick={() => handleSubjectClick(subject)}
                                />
                            ))}
                        </>
                    )}

                    {/* Classes View */}
                    {currentView === 'classes' && selectedSubject && (
                        <>
                            <div className="mb-2 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-neutral-200">
                                    Classes for {selectedSubject.name}
                                </h2>
                                <button
                                    onClick={() => setShowExperimentsList(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-2 shadow-lg backdrop-blur-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    View All Experiments
                                </button>
                            </div>

                            {(classesBySubject[selectedSubject.id] || []).map((classItem) => (
                                <ClassCard
                                    key={classItem.id}
                                    className={classItem.name}
                                    section={classItem.section}
                                    students={classItem.students}
                                    experiments={classItem.experiments}
                                    completionRate={classItem.completionRate}
                                    onClick={() => handleClassClick(classItem)}
                                />
                            ))}
                        </>
                    )}

                    {/* Experiments View */}
                    {currentView === 'experiments' && selectedClass && (
                        <>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-neutral-200 mb-4">
                                    Experiments for {selectedClass.name}
                                </h2>
                                <div className="mb-8">
                                    <button
                                        onClick={() => setShowDataSheet(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 flex items-center gap-2 shadow-lg backdrop-blur-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        View & Download Data Sheet
                                    </button>
                                </div>
                            </div>

                            {experiments.map((experiment) => (
                                <ExperimentCard
                                    key={experiment.id}
                                    experimentName={experiment.name}
                                    experimentNumber={experiment.number}
                                    completedBy={experiment.completedBy}
                                    totalStudents={experiment.totalStudents}
                                    avgScore={experiment.avgScore}
                                    onClick={() => handleExperimentClick(experiment)}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* Modal Components */}
                {showExperimentsList && (
                    <ExperimentsList
                        experiments={experiments}
                        selectedSubject={selectedSubject}
                        onClose={() => setShowExperimentsList(false)}
                        onViewLabManual={handleViewLabManual}
                    />
                )}

                {showDataSheet && (
                    <TabularDataSheet
                        classData={classData}
                        onClose={() => setShowDataSheet(false)}
                    />
                )}

                {showLabManual && selectedExperiment && (
                    <LabManualView
                        experiment={selectedExperiment}
                        onClose={() => setShowLabManual(false)}
                    />
                )}

                {showStudentCompletion && selectedExperiment && (
                    <StudentCompletionView
                        experiment={selectedExperiment}
                        onClose={() => setShowStudentCompletion(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default FacultyLabManagement;