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

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }
  return date.toLocaleDateString("en-GB");
};

const getAssignedLabsForStudent = async (username) => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(labsTable)
    .select("id, name, language, faculty, students, experiments, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205") {
      return [];
    }
    throw createHttpError(`Failed to load student labs: ${error.message}`, 500);
  }

  const usernameLower = (username || "").toLowerCase();
  return (data || []).filter((lab) =>
    (lab.students || []).some((student) => (student || "").toString().toLowerCase() === usernameLower)
  );
};

const getStudentDashboardData = async (username) => {
  const assignedLabs = await getAssignedLabsForStudent(username);

  const progressData = assignedLabs.map((lab, index) => {
    const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
    const completedEst = Math.min(100, 25 + experiments.length * 15);
    return {
      percentage: completedEst,
      label: lab.language || lab.name || `Lab ${index + 1}`,
      color: index % 2 === 0 ? "teal" : "blue",
    };
  });

  const assignedTasks = assignedLabs.flatMap((lab) =>
    (Array.isArray(lab.experiments) ? lab.experiments : []).map((experiment, expIndex) => ({
      title: experiment.title || `${lab.name} Experiment ${expIndex + 1}`,
      date: formatDate(experiment.deadline || lab.created_at),
    }))
  );

  const incompleteTasks = assignedTasks.slice(0, Math.max(1, Math.floor(assignedTasks.length / 3)));
  const avgProgress = progressData.length
    ? Math.round(progressData.reduce((sum, item) => sum + item.percentage, 0) / progressData.length)
    : 0;

  return {
    progressData,
    stats: [
      { value: `${assignedLabs.length}`, label: "Total Labs", color: "teal" },
      { value: `${avgProgress}%`, label: "Avg Progress", color: "emerald" },
      { value: `${Math.max(0, assignedTasks.length - incompleteTasks.length)}`, label: "Completed Tasks", color: "amber" },
      { value: `${incompleteTasks.length}`, label: "Pending Tasks", color: "cyan" },
    ],
    assignedTasks,
    incompleteTasks,
  };
};

const getStudentLabsData = async (username) => {
  const assignedLabs = await getAssignedLabsForStudent(username);

  return assignedLabs.map((lab) => {
    const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
    const completed = experiments.filter((exp) => exp.status === "completed" || exp.progress >= 100).length;
    const progress = experiments.length ? Math.round((completed / experiments.length) * 100) : 0;

    return {
      id: lab.id,
      name: lab.language || lab.name,
      fullName: lab.name,
      instructor: lab.faculty || "N/A",
      progress,
      date: formatDate(lab.created_at),
      students: Array.isArray(lab.students) ? lab.students.length : 0,
      duration: `${Math.max(1, experiments.length)} week${experiments.length === 1 ? "" : "s"}`,
    };
  });
};

const getStudentStatisticsData = async (username) => {
  const assignedLabs = await getAssignedLabsForStudent(username);

  const myLabsData = assignedLabs.map((lab) => {
    const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
    const completed = experiments.filter((exp) => exp.status === "completed" || exp.progress >= 100).length;
    const progress = experiments.length ? Math.round((completed / experiments.length) * 100) : 0;
    return {
      name: (lab.language || lab.name || "LAB").toUpperCase(),
      progress,
      assignments: experiments.length,
      completed,
    };
  });

  const totalAssignments = myLabsData.reduce((sum, item) => sum + item.assignments, 0);
  const completedAssignments = myLabsData.reduce((sum, item) => sum + item.completed, 0);
  const avgProgress = myLabsData.length
    ? Math.round(myLabsData.reduce((sum, item) => sum + item.progress, 0) / myLabsData.length)
    : 0;

  const skillRadarData = [
    { skill: "OOP", A: Math.max(40, avgProgress - 5) },
    { skill: "Arrays", A: Math.max(45, avgProgress + 2) },
    { skill: "Data Structures", A: Math.max(35, avgProgress - 8) },
    { skill: "Algorithms", A: Math.max(30, avgProgress - 12) },
    { skill: "Recursion", A: Math.max(30, avgProgress - 10) },
    { skill: "Debugging", A: Math.max(45, avgProgress + 4) },
  ];

  const activityItems = assignedLabs.slice(0, 5).map((lab, index) => ({
    id: index + 1,
    title: `Worked on ${lab.name}`,
    time: `${index + 1} day${index ? "s" : ""} ago`,
  }));

  return {
    metrics: {
      labsCompleted: `${myLabsData.filter((lab) => lab.progress >= 100).length}/${myLabsData.length}`,
      studyHours: `${Math.max(8, totalAssignments * 3)}h`,
      assignmentsDue: Math.max(0, totalAssignments - completedAssignments),
    },
    myLabsData,
    skillRadarData,
    activityItems,
    avgProgress,
  };
};

module.exports = {
  getStudentDashboardData,
  getStudentLabsData,
  getStudentStatisticsData,
};

