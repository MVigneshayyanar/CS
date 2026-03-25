const { supabase } = require("../config/supabaseClient");
const bcrypt = require("bcryptjs");
const {
  syncUserToSupabaseAuth,
  deleteUserFromSupabaseAuth,
} = require("./supabaseAuthSyncService");

const usersTable = process.env.SUPABASE_USERS_TABLE || "app_users";
const labsTable = process.env.SUPABASE_LABS_TABLE || "labs";

const ensureSupabase = () => {
  if (!supabase) {
    const error = new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables");
    error.statusCode = 500;
    throw error;
  }
};

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const safeTrim = (value) => (typeof value === "string" ? value.trim() : "");

const listUsersByRole = async (role) => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(usersTable)
    .select("id, username, email, role, created_at")
    .eq("role", role)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw createHttpError(`Failed to load ${role} users: ${error.message}`, 500);
  }

  return data || [];
};

const getStudents = async () => {
  const users = await listUsersByRole("Student");

  return users.map((user) => ({
    id: user.id,
    name: user.username,
    email: user.email || "",
    rollNo: user.username,
    year: "N/A",
    branch: "N/A",
  }));
};

const getFaculty = async () => {
  const users = await listUsersByRole("Faculty");

  return users.map((user) => ({
    id: user.id,
    name: user.username,
    email: user.email || "",
    empId: user.username,
    department: "N/A",
    specialization: "N/A",
  }));
};

const getLabs = async () => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(labsTable)
    .select("id, name, language, faculty, students, experiments, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    if (error.code === "PGRST205") {
      return [];
    }
    throw createHttpError(`Failed to load labs: ${error.message}`, 500);
  }

  return (data || []).map((lab) => ({
    id: lab.id,
    name: lab.name,
    language: lab.language || "N/A",
    faculty: lab.faculty || "N/A",
    students: Array.isArray(lab.students) ? lab.students : [],
    experiments: Array.isArray(lab.experiments) ? lab.experiments : [],
  }));
};

const createUserWithDefaultPassword = async ({ username, email, role }) => {
  const passwordHash = await bcrypt.hash(username, 10);

  const { data, error } = await supabase
    .from(usersTable)
    .insert({
      username,
      email: email || null,
      password_hash: passwordHash,
      role,
      is_active: true,
    })
    .select("id, username, email, role")
    .single();

  if (error) {
    const isConflict = error.code === "23505";
    throw createHttpError(
      isConflict ? "Username or email already exists" : `Failed to create ${role} user: ${error.message}`,
      isConflict ? 409 : 500
    );
  }

  // Best-effort sync to Supabase Auth so users appear in Authentication tab.
  await syncUserToSupabaseAuth({
    id: data.id,
    email: data.email,
    password: username,
    username: data.username,
    role: data.role,
  });

  return data;
};

const updateRoleUser = async ({ id, role, username, email }) => {
  ensureSupabase();

  const { data: existing, error: findError } = await supabase
    .from(usersTable)
    .select("id, role")
    .eq("id", id)
    .eq("role", role)
    .maybeSingle();

  if (findError) {
    throw createHttpError(`Failed to load ${role} user: ${findError.message}`, 500);
  }

  if (!existing) {
    throw createHttpError(`${role} user not found`, 404);
  }

  const updatePayload = {};
  if (username) {
    updatePayload.username = username;
    updatePayload.password_hash = await bcrypt.hash(username, 10);
  }
  if (typeof email === "string") {
    updatePayload.email = email || null;
  }

  const { data, error } = await supabase
    .from(usersTable)
    .update(updatePayload)
    .eq("id", id)
    .eq("role", role)
    .select("id, username, email, role")
    .single();

  if (error) {
    const isConflict = error.code === "23505";
    throw createHttpError(
      isConflict ? "Username or email already exists" : `Failed to update ${role} user: ${error.message}`,
      isConflict ? 409 : 500
    );
  }

  return data;
};

const deleteRoleUser = async ({ id, role }) => {
  ensureSupabase();

  // Best-effort cleanup from Supabase Auth.
  await deleteUserFromSupabaseAuth(id);

  const { error } = await supabase
    .from(usersTable)
    .delete()
    .eq("id", id)
    .eq("role", role);

  if (error) {
    throw createHttpError(`Failed to delete ${role} user: ${error.message}`, 500);
  }
};

const createStudent = async (payload) => {
  ensureSupabase();

  const rollNo = safeTrim(payload?.rollNo);
  const email = safeTrim(payload?.email).toLowerCase();
  if (!rollNo) {
    throw createHttpError("rollNo is required", 400);
  }

  const user = await createUserWithDefaultPassword({
    username: rollNo,
    email,
    role: "Student",
  });

  return {
    id: user.id,
    name: safeTrim(payload?.name) || user.username,
    email: user.email || "",
    rollNo: user.username,
    year: safeTrim(payload?.year) || "N/A",
    branch: safeTrim(payload?.branch) || "N/A",
    credentials: {
      username: user.username,
      password: user.username,
    },
  };
};

const updateStudent = async (id, payload) => {
  const rollNo = safeTrim(payload?.rollNo);
  const email = safeTrim(payload?.email).toLowerCase();
  if (!rollNo) {
    throw createHttpError("rollNo is required", 400);
  }

  const user = await updateRoleUser({
    id,
    role: "Student",
    username: rollNo,
    email,
  });

  return {
    id: user.id,
    name: safeTrim(payload?.name) || user.username,
    email: user.email || "",
    rollNo: user.username,
    year: safeTrim(payload?.year) || "N/A",
    branch: safeTrim(payload?.branch) || "N/A",
    credentials: {
      username: user.username,
      password: user.username,
    },
  };
};

const deleteStudent = async (id) => {
  await deleteRoleUser({ id, role: "Student" });
};

const createFaculty = async (payload) => {
  ensureSupabase();

  const empId = safeTrim(payload?.empId);
  const email = safeTrim(payload?.email).toLowerCase();
  if (!empId) {
    throw createHttpError("empId is required", 400);
  }

  const user = await createUserWithDefaultPassword({
    username: empId,
    email,
    role: "Faculty",
  });

  return {
    id: user.id,
    name: safeTrim(payload?.name) || user.username,
    email: user.email || "",
    empId: user.username,
    department: safeTrim(payload?.department) || "N/A",
    specialization: safeTrim(payload?.specialization) || "N/A",
    credentials: {
      username: user.username,
      password: user.username,
    },
  };
};

const updateFaculty = async (id, payload) => {
  const empId = safeTrim(payload?.empId);
  const email = safeTrim(payload?.email).toLowerCase();
  if (!empId) {
    throw createHttpError("empId is required", 400);
  }

  const user = await updateRoleUser({
    id,
    role: "Faculty",
    username: empId,
    email,
  });

  return {
    id: user.id,
    name: safeTrim(payload?.name) || user.username,
    email: user.email || "",
    empId: user.username,
    department: safeTrim(payload?.department) || "N/A",
    specialization: safeTrim(payload?.specialization) || "N/A",
    credentials: {
      username: user.username,
      password: user.username,
    },
  };
};

const deleteFaculty = async (id) => {
  await deleteRoleUser({ id, role: "Faculty" });
};

const createLab = async (payload) => {
  ensureSupabase();

  const name = safeTrim(payload?.name);
  if (!name) {
    throw createHttpError("Lab name is required", 400);
  }

  const { data, error } = await supabase
    .from(labsTable)
    .insert({
      name,
      language: safeTrim(payload?.language) || null,
      faculty: safeTrim(payload?.faculty) || null,
      students: Array.isArray(payload?.students) ? payload.students : [],
      experiments: Array.isArray(payload?.experiments) ? payload.experiments : [],
    })
    .select("id, name, language, faculty, students, experiments")
    .single();

  if (error) {
    if (error.code === "PGRST205") {
      throw createHttpError("Labs table is missing. Create table 'labs' in Supabase first.", 503);
    }
    throw createHttpError(`Failed to create lab: ${error.message}`, 500);
  }

  return {
    id: data.id,
    name: data.name,
    language: data.language || "N/A",
    faculty: data.faculty || "N/A",
    students: Array.isArray(data.students) ? data.students : [],
    experiments: Array.isArray(data.experiments) ? data.experiments : [],
  };
};

const updateLab = async (labId, payload) => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(labsTable)
    .update({
      name: safeTrim(payload?.name) || null,
      language: safeTrim(payload?.language) || null,
      faculty: safeTrim(payload?.faculty) || null,
      students: Array.isArray(payload?.students) ? payload.students : [],
      experiments: Array.isArray(payload?.experiments) ? payload.experiments : [],
    })
    .eq("id", labId)
    .select("id, name, language, faculty, students, experiments")
    .single();

  if (error) {
    throw createHttpError(`Failed to update lab: ${error.message}`, 500);
  }

  return {
    id: data.id,
    name: data.name,
    language: data.language || "N/A",
    faculty: data.faculty || "N/A",
    students: Array.isArray(data.students) ? data.students : [],
    experiments: Array.isArray(data.experiments) ? data.experiments : [],
  };
};

const deleteLab = async (labId) => {
  ensureSupabase();

  const { error } = await supabase
    .from(labsTable)
    .delete()
    .eq("id", labId);

  if (error) {
    throw createHttpError(`Failed to delete lab: ${error.message}`, 500);
  }
};

module.exports = {
  getStudents,
  getFaculty,
  getLabs,
  createStudent,
  updateStudent,
  deleteStudent,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  createLab,
  updateLab,
  deleteLab,
};

