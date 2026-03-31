import React, { useEffect, useMemo, useState } from 'react';
import ClassCard from '../../components/Faculty/Labs/ClassCard';
import SubjectCard from '../../components/Faculty/Labs/SubjectCard.jsx';
import ExperimentCard from '../../components/Faculty/Labs/ExperimentCard.jsx';
import TabularDataSheet from '../../components/Faculty/Labs/TabularDataSheet.jsx';
import StudentCompletionView from '../../components/Faculty/Labs/StudentCompletionView.jsx';
import LabManualView from '../../components/Faculty/Labs/LabManualView.jsx';
import ExperimentsList from '../../components/Faculty/Labs/ExperimentsList.jsx';
import { fetchFacultyLabs } from '@/services/facultyService';
import { FlaskConical, Search, Bell, ArrowLeft, Lightbulb, Calendar, X, BarChart2, Beaker } from 'lucide-react';

const SectionHeader = ({ icon: Icon, title, badge, action }) => (
    <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#f0f7f5] rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#1a6b5c]" />
            </div>
            <h2 className="text-sm font-extrabold text-heading">{title}</h2>
            {badge && (
                <span className="text-[10px] font-bold bg-[#f0f7f5] text-[#134d42] px-2.5 py-1 rounded-full">
                    {badge}
                </span>
            )}
        </div>
        {action && action}
    </div>
);

const FacultyLabManagement = () => {
    const [currentView, setCurrentView] = useState("subjects");
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedExperiment, setSelectedExperiment] = useState(null);
    const [showExperimentsList, setShowExperimentsList] = useState(false);
    const [showDataSheet, setShowDataSheet] = useState(false);
    const [showLabManual, setShowLabManual] = useState(false);
    const [showStudentCompletion, setShowStudentCompletion] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [labsPayload, setLabsPayload] = useState({
        subjects: [],
        classes: [],
        experiments: [],
    });

    const loadLabs = async () => {
        try {
            const result = await fetchFacultyLabs();
            setLabsPayload(
                result?.data || { subjects: [], classes: [], experiments: [] },
            );
        } catch (error) {
            alert(
                error?.response?.data?.message ||
                "Failed to load faculty labs from backend",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLabs();
    }, []);

    const handleRefresh = () => {
        loadLabs();
        // If we have a selected experiment, update it too
        if (selectedExperiment) {
            fetchFacultyLabs().then(result => {
                const updatedExps = result?.data?.experiments || [];
                const matched = updatedExps.find(e => e.id === selectedExperiment.id);
                if (matched) setSelectedExperiment(matched);
            });
        }
    };

    const subjects = labsPayload.subjects || [];

    const classesBySubject = useMemo(() => {
        const groups = {};
        (labsPayload.classes || []).forEach((c) => {
            if (!groups[c.subjectId]) groups[c.subjectId] = [];
            groups[c.subjectId].push(c);
        });
        return groups;
    }, [labsPayload.classes]);

    const experiments = useMemo(() => {
    if (!selectedClass) return [];
    return (labsPayload.experiments || []).filter(
      (e) => e.className === selectedClass.name,
    );
  }, [labsPayload.experiments, selectedClass]);

  const allSubjectExperiments = useMemo(() => {
    if (!selectedSubject) return [];
    return (labsPayload.experiments || []).filter(
      (e) => e.subject === selectedSubject.name
    );
  }, [labsPayload.experiments, selectedSubject]);

    const classData = Array.isArray(selectedClass?.students) && selectedClass.students.length > 0
        ? selectedClass.students.map((student, index) => {
            const studentId = typeof student === 'string' 
                ? student 
                : student?.rollNo || student?.id || student?.username || `${selectedClass.name}-${index + 1}`;
            const studentName = typeof student === 'string' 
                ? student 
                : student?.name || student?.username || `Student ${index + 1}`;
            const studentIdLower = (studentId || "").toString().toLowerCase();
            return {
                id: studentId,
                name: studentName,
                experiments: experiments.map((exp) => {
                    // Check submissions array first (per-student tracking)
                    if (Array.isArray(exp.submissions)) {
                        return exp.submissions.some(sub => {
                            const subStudent = (sub.student || '').toLowerCase();
                            const subStatus = (sub.status || '').toLowerCase();
                            return (subStudent === studentIdLower) && (subStatus === 'completed' || Number(sub.progress || 0) >= 100);
                        });
                    }
                    // Fallback to legacy completedBy field
                    return exp.completedBy === studentId && exp.status === 'completed';
                }),
            };
        })
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
        if (currentView === "experiments") {
            setCurrentView("classes");
            setSelectedClass(null);
        } else if (currentView === "classes") {
            setCurrentView("subjects");
            setSelectedSubject(null);
        }
    };

    const handleViewLabManual = (experiment) => {
        setSelectedExperiment(experiment);
        setShowExperimentsList(false);
        setShowLabManual(true);
    };

    /* breadcrumb */
    const crumbs = [
        { label: "Lab Management", active: currentView === "subjects" },
        selectedSubject && {
            label: selectedSubject.name,
            active: currentView === "classes",
        },
        selectedClass && {
            label: selectedClass.name,
            active: currentView === "experiments",
        },
    ].filter(Boolean);

    /* banner summary chips */
    const bannerChips = [
        {
            label: `${subjects.length} Subjects`,
            path: "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
        },
        {
            label: `${(labsPayload.classes || []).length} Classes`,
            path: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5",
        },
        {
            label: `${(labsPayload.experiments || []).length} Experiments`,
            path: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3",
        },
    ];

    return (
        <div className="min-h-screen bg-page">
            <div className="max-w-5xl mx-auto px-6 pt-8 pb-12">
                {/* ── Top bar ── */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1a6b5c] rounded-xl flex items-center justify-center shadow-md shadow-[#2a8c78]/20">
                            <FlaskConical className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-heading leading-tight">
                                Lab Management
                            </h1>
                            <p className="text-xs text-muted">
                                Manage subjects, classes and experiments
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-card border border-theme rounded-xl px-4 py-2 shadow-sm">
                            <Search className="w-4 h-4 text-muted" />
                            <input
                                className="text-sm text-body outline-none bg-transparent w-36 placeholder:text-muted"
                                placeholder="Search..."
                            />
                        </div>
                        <div className="w-9 h-9 bg-card border border-theme rounded-xl flex items-center justify-center shadow-sm">
                            <Bell className="w-4 h-4 text-body" />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center gap-3 text-muted py-20 justify-center">
                        <div className="w-5 h-5 border-2 border-[#2a8c78] border-t-transparent rounded-full animate-spin" />
                        Loading lab data...
                    </div>
                ) : (
                    <>
                        {/* ── Teal banner ── */}
                        <div className="relative bg-[#1a6b5c] rounded-2xl px-7 py-5 mb-5 flex items-center justify-between overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-lg font-extrabold text-white mb-1">
                                    Lab Management Centre
                                </h2>
                                <p className="text-teal-100 text-xs max-w-sm leading-relaxed mb-3">
                                    Manage all your subjects, classes and experiments from one
                                    place.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {bannerChips.map((c, i) => (
                                        <span
                                            key={i}
                                            className="flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full"
                                        >
                                            <svg
                                                className="w-3 h-3"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d={c.path}
                                                />
                                            </svg>
                                            {c.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            {/* Hex deco */}
                            <div className="flex gap-2 opacity-90 pointer-events-none select-none flex-shrink-0">
                                <div className="flex flex-col gap-2">
                                    <div
                                        style={{
                                            width: 44,
                                            height: 52,
                                            background: "rgba(255,255,255,.15)",
                                            clipPath:
                                                "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 28,
                                            height: 34,
                                            background: "rgba(255,215,0,.3)",
                                            clipPath:
                                                "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                                            alignSelf: "flex-end",
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2 mt-3">
                                    <div
                                        style={{
                                            width: 28,
                                            height: 34,
                                            background: "rgba(255,215,0,.3)",
                                            clipPath:
                                                "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                                        }}
                                    />
                                    <div
                                        style={{
                                            width: 44,
                                            height: 52,
                                            background: "rgba(255,255,255,.15)",
                                            clipPath:
                                                "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ── Breadcrumb ── */}
                        <div className="flex items-center gap-2 mb-5 text-xs font-medium text-muted">
                            {crumbs.map((c, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && (
                                        <svg
                                            className="w-3 h-3"
                                            fill="none"
                                            stroke="#cbd5e1"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    )}
                                    <span className={c.active ? "text-[#1a6b5c] font-bold" : ""}>
                                        {c.label}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>

                        {/* ── Back button ── */}
                        {currentView !== "subjects" && (
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 px-4 py-2 bg-card border border-theme rounded-xl text-xs font-bold text-body hover:bg-alt transition-all shadow-sm mb-5"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back
                            </button>
                        )}

                        {/* ══ SUBJECTS VIEW ══ */}
                        {currentView === "subjects" && (
                            <>
                                <SectionHeader
                                    icon={FlaskConical}
                                    title="Select Subject"
                                    badge={`${subjects.length} Subjects`}
                                />
                                {subjects.length === 0 ? (
                                    <p className="text-sm text-muted text-center py-10">
                                        No subjects found.
                                    </p>
                                ) : (
                                    subjects.map((subject) => (
                                        <SubjectCard
                                            key={subject.id}
                                            subject={subject.name}
                                            totalClasses={subject.totalClasses}
                                            totalStudents={subject.totalStudents}
                                            totalExperiments={subject.totalExperiments}
                                            avgCompletion={subject.avgCompletion}
                                            avgScore={subject.avgScore}
                                            pendingLabs={subject.pendingLabs}
                                            onClick={() => handleSubjectClick(subject)}
                                        />
                                    ))
                                )}
                            </>
                        )}

                        {/* ══ CLASSES VIEW ══ */}
                        {currentView === "classes" && selectedSubject && (
                            <>
                                <SectionHeader
                                    icon={BarChart2}
                                    title={`Classes — ${selectedSubject.name}`}
                                    badge={`${(classesBySubject[selectedSubject.id] || []).length} Classes`}
                                    action={
                                        <button
                                            onClick={() => setShowExperimentsList(true)}
                                            className="flex items-center gap-2 px-3 py-2 bg-[#1a6b5c] text-white text-xs font-bold rounded-xl hover:bg-[#134d42] transition-all shadow-sm"
                                        >
                                            <Lightbulb className="w-3.5 h-3.5" />
                                            View All Experiments
                                        </button>
                                    }
                                />
                                {(classesBySubject[selectedSubject.id] || []).length === 0 ? (
                                    <p className="text-sm text-muted text-center py-10">
                                        No classes for this subject.
                                    </p>
                                ) : (
                                    (classesBySubject[selectedSubject.id] || []).map(
                                        (classItem) => (
                                            <ClassCard
                                                key={classItem.id}
                                                className={classItem.name}
                                                section={classItem.section}
                                                students={classItem.students}
                                                experiments={classItem.experiments}
                                                completionRate={classItem.completionRate}
                                                onClick={() => handleClassClick(classItem)}
                                            />
                                        ),
                                    )
                                )}
                            </>
                        )}

                        {/* Experiments View */}
                        {currentView === 'experiments' && selectedClass && (
                            <>
                                <SectionHeader
                                    icon={Beaker}
                                    title={`Experiments for ${selectedClass.name}`}
                                    badge={`${experiments.length} Experiments`}
                                    action={
                                        <button
                                            onClick={() => setShowDataSheet(true)}
                                            className="px-4 py-2 bg-gradient-to-r from-[#1a6b5c] to-[#134d42] text-white text-xs font-bold rounded-xl hover:from-[#134d42] hover:to-[#0f3f36] transition-all duration-200 flex items-center gap-2 shadow-sm"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download Data Sheet
                                        </button>
                                    }
                                />

                                {experiments.map((experiment) => (
                                    <ExperimentCard
                                        key={experiment.id}
                                        experimentName={experiment.name}
                                        experimentNumber={experiment.number}
                                        completedBy={experiment.completedCount || 0}
                                        totalStudents={experiment.totalStudents}
                                        avgScore={experiment.avgScore}
                                        dueDate={experiment.deadline || experiment.dueDate}
                                        onClick={() => handleExperimentClick(experiment)}
                                    />
                                ))}
                            </>
                        )}
                    </>
                )}

                {/* Modal Components */}
                {showExperimentsList && (
                    <ExperimentsList
                        experiments={allSubjectExperiments.length > 0 ? allSubjectExperiments : experiments}
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
                        students={selectedClass?.students || []}
                        onClose={() => setShowStudentCompletion(false)}
                        onRefresh={handleRefresh}
                    />
                )}
            </div>
        </div>
    );
};

export default FacultyLabManagement;
