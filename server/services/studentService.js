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

const isCompletedProgram = (program) => {
  const status = (program?.status || "").toString().toLowerCase();
  return status === "completed" || Number(program?.progress || 0) >= 100;
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
    (lab.students || []).some((student) => {
      const studentVal =
        typeof student === "object" && student !== null
          ? student.username || student.name || student.rollNo || student.id || ""
          : student || "";
      return studentVal.toString().toLowerCase() === usernameLower;
    })
  );
};

const getUserByUsername = async (username) => {
  ensureSupabase();
  const { data, error } = await supabase
    .from(process.env.SUPABASE_USERS_TABLE || "app_users")
    .select("id, username, email, role, created_at")
    .eq("username", username)
    .single();

  if (error) return null;
  return data;
};

const getStudentDashboardData = async (username) => {
  const assignedLabs = await getAssignedLabsForStudent(username);
  const user = await getUserByUsername(username);

  const progressData = assignedLabs.map((lab, index) => {
    const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
    const completed = experiments.filter((exp) => exp.status === "completed" || exp.progress >= 100).length;
    const percentage = experiments.length ? Math.round((completed / experiments.length) * 100) : 0;

    return {
      percentage,
      label: lab.language || lab.name || `Lab ${index + 1}`,
      color: index % 2 === 0 ? "teal" : "blue",
    };
  });

  const allTasks = assignedLabs.flatMap((lab) =>
    (Array.isArray(lab.experiments) ? lab.experiments : []).map((experiment, expIndex) => ({
      title: experiment.title || `${lab.name} Experiment ${expIndex + 1}`,
      deadline: experiment.deadline || lab.created_at,
      date: formatDate(experiment.deadline || lab.created_at),
      status: experiment.status || "pending",
      labName: lab.name
    }))
  );

  const incompleteTasks = allTasks.filter(task => task.status !== "completed").slice(0, 5);
  const avgProgress = progressData.length
    ? Math.round(progressData.reduce((sum, item) => sum + item.percentage, 0) / progressData.length)
    : 0;

  return {
    user: {
      name: user?.username || "Student",
      username: user?.username,
      email: user?.email,
      location: "Active Student",
    },
    progressData,
    stats: [
      { value: `${assignedLabs.length}`, label: "Total Labs", color: "teal" },
      { value: `${avgProgress}%`, label: "Avg Progress", color: "emerald" },
      { value: `${allTasks.filter(t => t.status !== "completed").length}`, label: "Pending Tasks", color: "cyan" },
      { value: `${allTasks.filter(t => t.status === "completed").length}`, label: "Completed Tasks", color: "amber" },
    ],
    assignedTasks: allTasks.slice(0, 5),
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
      originalName: lab.name,
      language: lab.language,
      fullName: lab.name,
      instructor: lab.faculty || "N/A",
      progress,
      date: formatDate(lab.created_at),
      students: Array.isArray(lab.students) ? lab.students.length : 0,
      duration: `${Math.max(1, experiments.length)} week${experiments.length === 1 ? "" : "s"}`,
      experiments: experiments.map((exp, i) => ({
        ...exp,
        id: `${lab.id}-${i}`,
        sno: i + 1,
        dateDue: exp.deadline || lab.created_at
      })),
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
    { skill: "Logic", A: Math.max(20, avgProgress) },
    { skill: "Syntax", A: Math.max(30, avgProgress + 5) },
    { skill: "Efficiency", A: Math.max(25, avgProgress - 5) },
    { skill: "Debugging", A: Math.max(20, avgProgress - 10) },
    { skill: "Design", A: Math.max(15, avgProgress - 15) },
    { skill: "Documentation", A: Math.max(10, avgProgress - 20) },
  ];

  const activityItems = assignedLabs.slice(0, 5).map((lab, index) => ({
    id: index + 1,
    title: `Accessed ${lab.name} Portal`,
    time: `Active Now`,
  }));

  return {
    metrics: {
      labsCompleted: `${myLabsData.filter((lab) => lab.progress >= 100).length}/${myLabsData.length}`,
      studyHours: `${Math.max(1, Math.round(completedAssignments * 1.5))}h`,
      assignmentsDue: Math.max(0, totalAssignments - completedAssignments),
      accuracy: `${Math.max(70, avgProgress + 5)}%`,
      overallProgress: avgProgress
    },
    myLabsData,
    skillRadarData,
    activityItems,
    avgProgress,
  };
};

const getStudentReportsData = async (username) => {
  const assignedLabs = await getAssignedLabsForStudent(username);

  const allPrograms = assignedLabs.flatMap((lab) => {
    const sectionName = lab.language || lab.name || "General";
    const programs = Array.isArray(lab.experiments) ? lab.experiments : [];

    return programs.map((program, index) => {
      const completed = isCompletedProgram(program);
      return {
        id: `${lab.id || sectionName}-${index + 1}`,
        section: sectionName,
        programName: program.title || `${sectionName} Program ${index + 1}`,
        status: completed ? "completed" : "not_completed",
        progress: Math.max(0, Math.min(100, Number(program.progress || (completed ? 100 : 0)))),
        deadline: formatDate(program.deadline || lab.created_at),
      };
    });
  });

  const completedPrograms = allPrograms.filter((program) => program.status === "completed");
  const notCompletedPrograms = allPrograms.filter((program) => program.status === "not_completed");

  const sectionMap = new Map();
  allPrograms.forEach((program) => {
    if (!sectionMap.has(program.section)) {
      sectionMap.set(program.section, []);
    }
    sectionMap.get(program.section).push(program);
  });

  const sections = Array.from(sectionMap.entries()).map(([section, programs]) => ({
    section,
    completed: programs.filter((program) => program.status === "completed").length,
    notCompleted: programs.filter((program) => program.status === "not_completed").length,
    programs,
  }));

  return {
    summary: {
      totalPrograms: allPrograms.length,
      completedPrograms: completedPrograms.length,
      notCompletedPrograms: notCompletedPrograms.length,
    },
    sections,
    completedPrograms,
    generatedAt: new Date().toISOString(),
  };
};

const updateStudentExperimentProgress = async (username, labId, experimentIndex, status, progress) => {
  ensureSupabase();

  const { data: lab, error: fetchError } = await supabase
    .from(labsTable)
    .select("id, name, experiments, students")
    .eq("id", labId)
    .single();

  if (fetchError || !lab) {
    throw createHttpError("Lab not found", 404);
  }

  const usernameLower = (username || "").toLowerCase();
  const isAssigned = (lab.students || []).some((student) => {
    const studentVal =
      typeof student === "object" && student !== null
        ? student.username || student.name || student.rollNo || student.id || ""
        : student || "";
    return studentVal.toString().toLowerCase() === usernameLower;
  });

  if (!isAssigned) {
    throw createHttpError("Student not assigned to this lab", 403);
  }

  const experiments = [...(lab.experiments || [])];
  if (experimentIndex < 0 || experimentIndex >= experiments.length) {
    throw createHttpError("Invalid experiment index", 400);
  }

  experiments[experimentIndex] = {
    ...experiments[experimentIndex],
    status: status || "completed",
    progress: progress !== undefined ? progress : 100,
    completedAt: new Date().toISOString(),
    completedBy: username,
  };

  const { data: updatedLab, error: updateError } = await supabase
    .from(labsTable)
    .update({ experiments })
    .eq("id", labId)
    .select()
    .single();

  if (updateError) {
    throw createHttpError(`Failed to update experiment progress: ${updateError.message}`, 500);
  }

  return updatedLab;
};

module.exports = {
  getStudentDashboardData,
  getStudentLabsData,
  getStudentStatisticsData,
  getStudentReportsData,
  updateStudentExperimentProgress,
};

