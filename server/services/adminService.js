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

const listUsersByRole = async (role, { collegeId, departmentName } = {}) => {
  ensureSupabase();

  let query = supabase
    .from(usersTable)
    .select("*, full_name")
    .eq("role", role)
    .eq("is_active", true);

  if (collegeId) {
    query = query.eq("college_id", collegeId);
  }
  
  if (departmentName) {
    query = query.eq("department_name", departmentName);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    throw createHttpError(`Failed to load ${role} users: ${error.message}`, 500);
  }

  return data || [];
};

const getStudents = async (scope) => {
  const users = await listUsersByRole("Student", scope);

  return users.map((user) => ({
    id: user.id,
    name: user.full_name || user.username,
    email: user.email || "",
    rollNo: user.username,
    year: user.year || "N/A",
    branch: user.branch || "N/A",
    department: user.department_name || "N/A",
  }));
};

const getFaculty = async (scope) => {
  const users = await listUsersByRole("Faculty", scope);

  return users.map((user) => ({
    id: user.id,
    name: user.full_name || user.username,
    email: user.email || "",
    empId: user.username,
    qualification: user.qualification || "N/A",
    designation: user.designation || "N/A",
    department: user.department_name || "N/A",
    specialization: user.specialization || "N/A",
  }));
};

const getLabs = async ({ collegeId, departmentName } = {}) => {
  ensureSupabase();

  let query = supabase
    .from(labsTable)
    .select("*");

  if (collegeId) {
    query = query.eq("college_id", collegeId);
  }
  
  if (departmentName) {
    query = query.eq("department_name", departmentName);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

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

const createUserWithDefaultPassword = async ({ username, full_name, email, role, collegeId, departmentName, extraFields = {} }) => {
  const passwordHash = await bcrypt.hash(username, 10);

  const insertPayload = {
      username,
      full_name: full_name || null,
      email: email || null,
      password_hash: passwordHash,
      role,
      is_active: true,
      college_id: collegeId || null,
      department_name: departmentName || null,
      ...extraFields
  };

  const { data, error } = await supabase
    .from(usersTable)
    .insert(insertPayload)
    .select("id, username, email, role, college_id, department_name")
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

const updateRoleUser = async ({ id, role, username, email, collegeId, departmentName, extraFields = {} }) => {
  ensureSupabase();

  const { data: existing, error: findError } = await supabase
    .from(usersTable)
    .select("id, role, college_id, department_name")
    .eq("id", id)
    .eq("role", role)
    .maybeSingle();

  if (findError) {
    throw createHttpError(`Failed to load ${role} user: ${findError.message}`, 500);
  }

  if (!existing) {
    throw createHttpError(`${role} user not found`, 404);
  }

  const updatePayload = { ...extraFields };
  if (username) {
    updatePayload.username = username;
    updatePayload.password_hash = await bcrypt.hash(username, 10);
  }
  if (arguments[0].full_name !== undefined) {
    updatePayload.full_name = arguments[0].full_name || null;
  }
  if (typeof email === "string") {
    updatePayload.email = email || null;
  }
  
  if (collegeId) updatePayload.college_id = collegeId;
  if (departmentName) updatePayload.department_name = departmentName;

  const { data, error } = await supabase
    .from(usersTable)
    .update(updatePayload)
    .eq("id", id)
    .eq("role", role)
    .select("id, username, email, role, college_id, department_name")
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

const createStudent = async (scope, payload) => {
  ensureSupabase();

  const rollNo = safeTrim(payload?.rollNo);
  const email = safeTrim(payload?.email).toLowerCase();
  if (!rollNo) {
    throw createHttpError("rollNo is required", 400);
  }

  // Auto-map branch from department scoping if not provided
  const branch = safeTrim(payload?.branch) || scope.departmentName || "N/A";
  const year = safeTrim(payload?.year) || "I";

  const user = await createUserWithDefaultPassword({
    username: rollNo,
    full_name: safeTrim(payload?.name),
    email,
    role: "Student",
    extraFields: {
      year,
      branch
    },
    ...scope
  });

  return {
    id: user.id,
    name: user.full_name || safeTrim(payload?.name) || user.username,
    email: user.email || "",
    rollNo: user.username,
    year: year,
    branch: branch,
    credentials: {
      username: user.username,
      password: user.username,
    },
  };
};

const updateStudent = async (scope, id, payload) => {
  const rollNo = safeTrim(payload?.rollNo);
  const email = safeTrim(payload?.email).toLowerCase();
  if (!rollNo) {
    throw createHttpError("rollNo is required", 400);
  }

  const user = await updateRoleUser({
    id,
    role: "Student",
    username: rollNo,
    full_name: safeTrim(payload?.name),
    email,
    extraFields: {
      year: safeTrim(payload?.year) || "N/A",
      branch: safeTrim(payload?.branch) || "N/A"
    },
    ...scope
  });

  return {
    id: user.id,
    name: user.full_name || safeTrim(payload?.name) || user.username,
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

const createFaculty = async (scope, payload) => {
  ensureSupabase();

  const empId = safeTrim(payload?.empId);
  const email = safeTrim(payload?.email).toLowerCase();
  if (!empId) {
    throw createHttpError("empId is required", 400);
  }

  // Auto-map department from scoping if not provided
  const department = safeTrim(payload?.department) || scope.departmentName || "N/A";

  const user = await createUserWithDefaultPassword({
    username: empId,
    full_name: safeTrim(payload?.name),
    email,
    role: "Faculty",
    extraFields: {
      qualification: safeTrim(payload?.qualification) || null,
      designation: safeTrim(payload?.designation) || null,
      specialization: safeTrim(payload?.specialization) || null,
    },
    ...scope
  });

  return {
    id: user.id,
    name: user.full_name || safeTrim(payload?.name) || user.username,
    email: user.email || "",
    empId: user.username,
    qualification: safeTrim(payload?.qualification) || "N/A",
    designation: safeTrim(payload?.designation) || "N/A",
    department: department,
    specialization: safeTrim(payload?.specialization) || "N/A",
    credentials: {
      username: user.username,
      password: user.username,
    },
  };
};

const updateFaculty = async (scope, id, payload) => {
  const empId = safeTrim(payload?.empId);
  const email = safeTrim(payload?.email).toLowerCase();
  if (!empId) {
    throw createHttpError("empId is required", 400);
  }

  const user = await updateRoleUser({
    id,
    role: "Faculty",
    username: empId,
    full_name: safeTrim(payload?.name),
    email,
    extraFields: {
      qualification: safeTrim(payload?.qualification) || null,
      designation: safeTrim(payload?.designation) || null,
      specialization: safeTrim(payload?.specialization) || null,
    },
    ...scope
  });

  return {
    id: user.id,
    name: user.full_name || safeTrim(payload?.name) || user.username,
    email: user.email || "",
    empId: user.username,
    qualification: safeTrim(payload?.qualification) || "N/A",
    designation: safeTrim(payload?.designation) || "N/A",
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

const createLab = async ({ collegeId, departmentName }, payload) => {
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
      college_id: collegeId,
      department_name: departmentName,
    })
    .select("id, name, language, faculty, students, experiments, college_id, department_name")
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

const updateLab = async ({ collegeId, departmentName }, labId, payload) => {
  ensureSupabase();

  const { data, error } = await supabase
    .from(labsTable)
    .update({
      name: safeTrim(payload?.name) || null,
      language: safeTrim(payload?.language) || null,
      faculty: safeTrim(payload?.faculty) || null,
      students: Array.isArray(payload?.students) ? payload.students : [],
      experiments: Array.isArray(payload?.experiments) ? payload.experiments : [],
      college_id: collegeId,
      department_name: departmentName,
    })
    .eq("id", labId)
    .select("id, name, language, faculty, students, experiments, college_id, department_name")
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

