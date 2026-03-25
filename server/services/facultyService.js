const { supabase } = require("../config/supabaseClient");

const labsTable = process.env.SUPABASE_LABS_TABLE || "labs";
const usersTable = process.env.SUPABASE_USERS_TABLE || "app_users";

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

const loadScopedLabs = async (facultyIdentifier) => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(labsTable)
    .select("id, name, language, faculty, students, experiments, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205") {
      return [];
    }
    throw createHttpError(`Failed to load faculty dashboard: ${error.message}`, 500);
  }

  const key = (facultyIdentifier || "").toLowerCase();
  const matchedLabs = (data || []).filter((lab) => {
    const faculty = (lab.faculty || "").toLowerCase();
    return faculty === key || faculty.includes(key);
  });
  
  return matchedLabs;
};

const getFacultyDashboardData = async (facultyIdentifier) => {
  const scopedLabs = await loadScopedLabs(facultyIdentifier);

  const classes = scopedLabs.map((lab, index) => {
    const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
    const studentsCount = Array.isArray(lab.students) ? lab.students.length : 0;
    
    // Calculate real completion rate for this lab
    const completedExps = experiments.filter(e => e.status === 'completed' || e.progress >= 100).length;
    const completionRate = experiments.length > 0 
      ? Math.round((completedExps / experiments.length) * 100) 
      : 0;

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
    avgScore: classItem.completionRate, // Real score-based avg would be better if we had scores
    completion: classItem.completionRate,
  }));

  const totalStudents = classes.reduce((sum, item) => sum + item.students, 0);
  const overallCompletion = classes.length
    ? Math.round(classes.reduce((sum, item) => sum + item.completionRate, 0) / classes.length)
    : 0;

  // Real distribution based on completion rates
  const progressDistributionData = [
    { range: "90-100%", students: classes.filter(c => c.completionRate >= 90).length, color: "#10b981" },
    { range: "70-89%", students: classes.filter(c => c.completionRate >= 70 && c.completionRate < 90).length, color: "#3b82f6" },
    { range: "50-69%", students: classes.filter(c => c.completionRate >= 50 && c.completionRate < 70).length, color: "#f59e0b" },
    { range: "Below 50%", students: classes.filter(c => c.completionRate < 50).length, color: "#ef4444" },
  ];

  const activeQueue = scopedLabs.flatMap((lab, index) => {
    const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
    return experiments.map((exp, expIdx) => {
      const studentsCount = Array.isArray(lab.students) ? lab.students.length : 0;
      const completionCount = exp.status === 'completed' ? 1 : 0; // Current schema limit
      return {
        id: `${lab.id}-${expIdx}`,
        title: exp.title || `Experiment ${expIdx + 1}`,
        classes: [toClassName(lab, index)],
        deadline: exp.deadline || new Date(Date.now() + 86400000).toISOString(),
        submitted: completionCount,
        total: studentsCount,
        avgScore: exp.progress || 0,
        priority: exp.status === 'completed' ? "low" : "high",
        status: exp.status || "active",
      };
    });
  });

  const recentActivities = scopedLabs.flatMap(lab => 
    (Array.isArray(lab.experiments) ? lab.experiments : [])
      .filter(exp => exp.status === 'completed' && exp.completedBy)
      .map((exp, idx) => ({
        id: `act-${lab.id}-${idx}`,
        type: "submission",
        student: exp.completedBy,
        class: lab.name,
        experiment: exp.title || "Experiment",
        time: "Recently",
      }))
  ).slice(0, 5);

  const pendingSubmissions = activeQueue.filter(q => q.status !== 'completed').length;

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
    pendingActions: pendingSubmissions > 0 ? [
      {
        id: 1,
        type: "grade",
        title: `Review ${pendingSubmissions} experiments`,
        description: "New experiments pending review",
        priority: "high",
        count: pendingSubmissions,
        action: "Review Now",
      },
    ] : [],
    classes,
    experimentQueue: activeQueue.slice(0, 5),
  };
};

const getFacultyLabsData = async (facultyIdentifier) => {
  const scopedLabs = await loadScopedLabs(facultyIdentifier);

  const subjectsMap = new Map();
  scopedLabs.forEach((lab) => {
    const subjectName = lab.name || "Unnamed Subject";
    const studentsCount = Array.isArray(lab.students) ? lab.students.length : 0;
    if (!subjectsMap.has(subjectName)) {
      subjectsMap.set(subjectName, {
        id: subjectsMap.size + 1,
        name: subjectName,
        totalClasses: 0,
        totalStudents: 0,
      });
    }
    const entry = subjectsMap.get(subjectName);
    entry.totalClasses += 1;
    entry.totalStudents += studentsCount;
  });

  const subjects = Array.from(subjectsMap.values());
  const classData = scopedLabs.map((lab, index) => ({
    id: lab.id,
    subjectId: subjects.find((subject) => subject.name === (lab.name || "Unnamed Subject"))?.id,
    name: toClassName(lab, index),
    section: `Section ${String.fromCharCode(65 + (index % 4))}`,
    students: Array.isArray(lab.students) ? lab.students : [],
    experiments: Array.isArray(lab.experiments) ? lab.experiments.length : 0,
    completionRate: Array.isArray(lab.experiments) && lab.experiments.length
      ? Math.round(
          (lab.experiments.filter((exp) => exp.status === "completed" || exp.progress >= 100).length /
            lab.experiments.length) *
            100
        )
      : 0,
  }));

  const experiments = scopedLabs.flatMap((lab) =>
    (Array.isArray(lab.experiments) ? lab.experiments : []).map((exp, index) => ({
      id: `${lab.id}-${index}`,
      subject: lab.name,
      className: classData.find((item) => item.id === lab.id)?.name || "N/A",
      name: exp.title || `Experiment ${index + 1}`,
      number: index + 1,
      completedBy: exp.completedBy || null,
      completedCount: exp.status === "completed" ? 1 : 0,
      totalStudents: Array.isArray(lab.students) ? lab.students.length : 0,
      avgScore: exp.avgScore || (exp.status === "completed" ? 100 : exp.progress || 0),
      description: exp.description || "",
      testCases: Array.isArray(exp.testCases) ? exp.testCases : [],
      deadline: exp.deadline || null,
      status: exp.status || "pending",
    }))
  );

  return {
    subjects,
    classes: classData,
    experiments,
  };
};

const updateLabExperimentDeadline = async (labId, experimentIndex, deadline, facultyIdentifier) => {
  ensureSupabase();

  if (!labId || experimentIndex === undefined) {
    throw createHttpError("labId and experimentIndex are required", 400);
  }

  const { data: lab, error: fetchError } = await supabase
    .from(labsTable)
    .select("experiments, faculty")
    .eq("id", labId)
    .single();

  if (fetchError || !lab) {
    throw createHttpError("Lab not found", 404);
  }

  const labFaculty = (lab.faculty || "").toLowerCase();
  const currentFaculty = (facultyIdentifier || "").toLowerCase();
  if (labFaculty !== currentFaculty && !labFaculty.includes(currentFaculty)) {
    throw createHttpError("You are not authorized to update this lab's experiments", 403);
  }

  const experiments = Array.isArray(lab.experiments) ? [...lab.experiments] : [];
  if (experimentIndex < 0 || experimentIndex >= experiments.length) {
    throw createHttpError("Invalid experiment index", 400);
  }

  experiments[experimentIndex] = {
    ...experiments[experimentIndex],
    deadline: deadline,
  };

  const { data: updated, error: updateError } = await supabase
    .from(labsTable)
    .update({ experiments })
    .eq("id", labId)
    .select("experiments")
    .single();

  if (updateError) {
    throw createHttpError(`Failed to update deadline: ${updateError.message}`, 500);
  }

  return updated;
};

const getFacultyProfile = async (facultyIdentifier) => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(usersTable)
    .select("id, username, email, role, created_at")
    .eq("username", facultyIdentifier)
    .single();

  if (error || !data) {
    throw createHttpError("Faculty profile not found", 404);
  }

  return {
    id: data.id,
    name: data.username,
    email: data.email || "",
    role: data.role,
    username: data.username,
    joinedAt: data.created_at,
    department: "Computer Science", // Default or could be fetched if we had a profile table
    designation: "Faculty",
  };
};

module.exports = {
  getFacultyDashboardData,
  getFacultyLabsData,
  updateLabExperimentDeadline,
  getFacultyProfile,
};

