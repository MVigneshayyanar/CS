const { supabase } = require("../config/supabaseClient");

const labsTable = process.env.SUPABASE_LABS_TABLE || "labs";

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const ensureSupabase = () => {
  if (!supabase) {
    throw createHttpError("Missing SUPABASE_URL or SUPABASE_KEY in environment variables", 500);
  }
};

const toClassName = (lab, index) => `CLS-${(index + 1).toString().padStart(2, "0")}`;

const getFacultyDashboardData = async (facultyIdentifier) => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(labsTable)
    .select("id, name, language, faculty, students, experiments, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205") {
      return {
        quickStats: {
          totalClasses: 0,
          totalStudents: 0,
          pendingSubmissions: 0,
          overallCompletion: 0,
        },
        classPerformanceData: [],
        progressDistributionData: [],
        recentActivities: [],
        pendingActions: [],
        classes: [],
        experimentQueue: {
          active: [],
          pending: [],
          completed: [],
        },
      };
    }
    throw createHttpError(`Failed to load faculty dashboard: ${error.message}`, 500);
  }

  const key = (facultyIdentifier || "").toLowerCase();
  const labs = (data || []).filter((lab) => (lab.faculty || "").toLowerCase().includes(key));
  const scopedLabs = labs.length ? labs : data || [];

  const classes = scopedLabs.map((lab, index) => {
    const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
    const completionRate = Math.min(100, 30 + experiments.length * 12);
    const studentsCount = Array.isArray(lab.students) ? lab.students.length : 0;
    return {
      id: lab.id,
      name: toClassName(lab, index),
      subject: lab.name,
      students: studentsCount,
      completionRate,
      year: ["I", "II", "III", "IV"][index % 4],
    };
  });

  const classPerformanceData = classes.map((classItem) => ({
    className: classItem.name,
    avgScore: Math.max(60, Math.min(98, classItem.completionRate - 5)),
    completion: classItem.completionRate,
  }));

  const totalStudents = classes.reduce((sum, item) => sum + item.students, 0);
  const overallCompletion = classes.length
    ? Math.round(classes.reduce((sum, item) => sum + item.completionRate, 0) / classes.length)
    : 0;

  const progressDistributionData = [
    { range: "90-100%", students: Math.round(totalStudents * 0.35), color: "#10b981" },
    { range: "80-89%", students: Math.round(totalStudents * 0.28), color: "#3b82f6" },
    { range: "70-79%", students: Math.round(totalStudents * 0.2), color: "#f59e0b" },
    { range: "60-69%", students: Math.round(totalStudents * 0.12), color: "#ef4444" },
    { range: "<60%", students: Math.max(0, totalStudents - Math.round(totalStudents * 0.95)), color: "#6b7280" },
  ];

  const activeQueue = scopedLabs.map((lab, index) => {
    const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
    const studentsCount = Array.isArray(lab.students) ? lab.students.length : 0;
    const submitted = Math.max(0, studentsCount - (index % 3));
    return {
      id: lab.id,
      title: lab.name,
      classes: [toClassName(lab, index)],
      deadline: new Date(Date.now() + (index + 2) * 86400000).toISOString(),
      submitted,
      total: studentsCount,
      avgScore: Math.max(65, 90 - index * 2),
      priority: index % 3 === 0 ? "high" : index % 3 === 1 ? "medium" : "low",
      status: submitted < studentsCount ? "active" : "grading",
    };
  });

  const pendingQueue = scopedLabs.slice(0, 3).map((lab, index) => ({
    id: `${lab.id}-pending`,
    title: `${lab.name} - Next Module`,
    classes: [toClassName(lab, index)],
    scheduledDate: new Date(Date.now() + (index + 7) * 86400000).toISOString(),
    estimatedTime: `${2 + index} hours`,
    difficulty: index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard",
    status: "pending",
  }));

  const completedQueue = scopedLabs.slice(0, 3).map((lab, index) => ({
    id: `${lab.id}-completed`,
    title: `${lab.name} - Intro`,
    classes: [toClassName(lab, index)],
    completedDate: new Date(Date.now() - (index + 4) * 86400000).toISOString(),
    avgScore: Math.max(70, 95 - index * 3),
    completion: 100,
    feedback: 4.5,
  }));

  const recentActivities = activeQueue.slice(0, 4).map((item, index) => ({
    id: index + 1,
    type: index % 2 === 0 ? "submission" : "grade",
    student: `Student ${index + 1}`,
    class: item.classes[0],
    experiment: item.title,
    time: `${(index + 1) * 12} min ago`,
  }));

  const pendingSubmissions = activeQueue.reduce((sum, item) => sum + Math.max(0, item.total - item.submitted), 0);

  return {
    quickStats: {
      totalClasses: classes.length,
      totalStudents,
      pendingSubmissions,
      overallCompletion,
    },
    classPerformanceData,
    progressDistributionData,
    recentActivities,
    pendingActions: [
      {
        id: 1,
        type: "grade",
        title: `Grade ${pendingSubmissions} submissions`,
        description: "New submissions waiting in queue",
        priority: pendingSubmissions > 10 ? "high" : "medium",
        count: pendingSubmissions,
        action: "Grade Now",
      },
    ],
    classes,
    experimentQueue: {
      active: activeQueue,
      pending: pendingQueue,
      completed: completedQueue,
    },
  };
};

module.exports = {
  getFacultyDashboardData,
};

