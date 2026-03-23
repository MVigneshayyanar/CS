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

const getStudentDashboardData = async (username) => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(labsTable)
    .select("name, language, students, experiments, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205") {
      return {
        progressData: [],
        stats: [
          { value: "0", label: "Total Labs", color: "teal" },
          { value: "0%", label: "Avg Progress", color: "emerald" },
          { value: "0", label: "Pending Tasks", color: "amber" },
          { value: "0", label: "Due This Week", color: "cyan" },
        ],
        assignedTasks: [],
        incompleteTasks: [],
      };
    }
    throw createHttpError(`Failed to load student dashboard: ${error.message}`, 500);
  }

  const usernameLower = (username || "").toLowerCase();
  const assignedLabs = (data || []).filter((lab) =>
    (lab.students || []).some((student) => (student || "").toString().toLowerCase() === usernameLower)
  );

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

module.exports = {
  getStudentDashboardData,
};

