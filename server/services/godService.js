const bcrypt = require("bcryptjs");
const crypto = require("node:crypto");
const { supabase } = require("../config/supabaseClient");

const usersTable = process.env.SUPABASE_USERS_TABLE || "app_users";
const collegesTable = process.env.SUPABASE_COLLEGES_TABLE || "colleges";
const superAdminsTable = process.env.SUPABASE_SUPER_ADMINS_TABLE || "super_admin_profiles";
const departmentHeadsTable = process.env.SUPABASE_DEPARTMENT_HEADS_TABLE || "department_heads";

const assertSupabaseConfigured = () => {
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

const mapSupabaseSetupError = (error, fallbackMessage) => {
  const rawMessage = `${error?.message || ""} ${error?.details || ""}`.toLowerCase();
  const errorCode = error?.code || "";
  const isMissingCollegeSchema =
    errorCode === "PGRST205" ||
    rawMessage.includes("public.colleges") ||
    rawMessage.includes("super_admin_profiles") ||
    rawMessage.includes("department_heads") ||
    rawMessage.includes("schema cache");

  if (isMissingCollegeSchema) {
    return createHttpError(
      "Database setup incomplete for God management. Run server/scripts/god_management_setup.sql in Supabase SQL editor, then retry.",
      503
    );
  }

  return createHttpError(fallbackMessage, 500);
};

const buildGeneratedPassword = () => {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  const bytes = crypto.randomBytes(12);
  let password = "";

  for (let i = 0; i < bytes.length; i += 1) {
    password += charset[bytes[i] % charset.length];
  }

  return password;
};

const normalizeCollege = (record) => ({
  id: record.id,
  name: record.name,
  code: record.code,
  location: record.location || "",
  address: record.address || "",
  established: record.established || "",
  type: record.type || "",
  affiliation: record.affiliation || "",
  phone: record.phone || "",
  email: record.email || "",
  website: record.website || "",
  superAdmins: Array.isArray(record.super_admin_profiles)
    ? record.super_admin_profiles.map((admin) => ({
        id: admin.id,
        userId: admin.user_id,
        name: admin.name,
        email: admin.email || "",
        phone: admin.phone || "",
        empId: admin.emp_id,
        username: admin.username || "",
        qualification: admin.qualification || "",
        experience: admin.experience || "",
        specialization: admin.specialization || "",
        joiningDate: admin.joining_date || "",
        assignedCollege: record.name,
      }))
    : [],
});

const getCollegesWithSuperAdmins = async () => {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from(collegesTable)
    .select(
      `
      id,
      name,
      code,
      location,
      address,
      established,
      type,
      affiliation,
      phone,
      email,
      website,
      super_admin_profiles (
        id,
        user_id,
        name,
        email,
        phone,
        emp_id,
        qualification,
        experience,
        specialization,
        joining_date,
        app_users:user_id (username)
      )
    `
    )
    .order("name", { ascending: true });

  if (error) {
    throw mapSupabaseSetupError(error, `Failed to load colleges: ${error.message}`);
  }

  return (data || []).map((college) => {
    const enrichedSuperAdmins = (college.super_admin_profiles || []).map((admin) => ({
      ...admin,
      username: admin.app_users?.username || "",
    }));

    return normalizeCollege({ ...college, super_admin_profiles: enrichedSuperAdmins });
  });
};

const createCollege = async (payload) => {
  assertSupabaseConfigured();

  if (!payload?.name || !payload?.code) {
    throw createHttpError("College name and code are required", 400);
  }

  const newCollege = {
    name: payload.name.trim(),
    code: payload.code.trim().toUpperCase(),
    location: payload.location?.trim() || null,
    address: payload.address?.trim() || null,
    established: payload.established?.toString().trim() || null,
    type: payload.type?.trim() || null,
    affiliation: payload.affiliation?.trim() || null,
    phone: payload.phone?.trim() || null,
    email: payload.email?.trim() || null,
    website: payload.website?.trim() || null,
  };

  const { data, error } = await supabase
    .from(collegesTable)
    .insert(newCollege)
    .select("id, name, code, location, address, established, type, affiliation, phone, email, website")
    .single();

  if (error) {
    const isConflict = error.code === "23505";
    if (isConflict) {
      throw createHttpError("College name or code already exists", 409);
    }
    throw mapSupabaseSetupError(error, `Failed to create college: ${error.message}`);
  }

  return normalizeCollege({ ...data, super_admin_profiles: [] });
};

const createSuperAdmin = async (payload) => {
  assertSupabaseConfigured();

  const required = ["name", "email", "empId", "assignedCollege"];
  const missingField = required.find((key) => !payload?.[key]);

  if (missingField) {
    throw createHttpError(`Missing required field: ${missingField}`, 400);
  }

  const assignedCollegeName = payload.assignedCollege.trim();

  const { data: college, error: collegeError } = await supabase
    .from(collegesTable)
    .select("id, name")
    .eq("name", assignedCollegeName)
    .maybeSingle();

  if (collegeError) {
    throw mapSupabaseSetupError(collegeError, `Failed to verify college: ${collegeError.message}`);
  }

  if (!college) {
    throw createHttpError("Assigned college not found", 404);
  }

  // Password defaults to username (empId)
  const defaultPassword = payload.empId.trim();
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const newUser = {
    username: payload.empId.trim(),
    email: payload.email.trim().toLowerCase(),
    password_hash: passwordHash,
    role: "SuperAdmin",
    is_active: true,
  };

  const { data: user, error: userError } = await supabase
    .from(usersTable)
    .insert(newUser)
    .select("id, username, email, role")
    .single();

  if (userError) {
    const isConflict = userError.code === "23505";
    throw createHttpError(
      isConflict ? "Employee ID or email already exists" : `Failed to create super admin user: ${userError.message}`,
      isConflict ? 409 : 500
    );
  }

  const newProfile = {
    user_id: user.id,
    college_id: college.id,
    name: payload.name.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() || null,
    emp_id: payload.empId.trim(),
    qualification: payload.qualification?.trim() || null,
    experience: payload.experience?.trim() || null,
    specialization: payload.specialization?.trim() || null,
    joining_date: payload.joiningDate || null,
  };

  const { data: profile, error: profileError } = await supabase
    .from(superAdminsTable)
    .insert(newProfile)
    .select("id, user_id, name, email, phone, emp_id, qualification, experience, specialization, joining_date")
    .single();

  if (profileError) {
    await supabase.from(usersTable).delete().eq("id", user.id);

    const isConflict = profileError.code === "23505";
    throw createHttpError(
      isConflict ? "Employee ID is already mapped to another super admin" : `Failed to save super admin profile: ${profileError.message}`,
      isConflict ? 409 : 500
    );
  }

  return {
    superAdmin: {
      id: profile.id,
      userId: profile.user_id,
      name: profile.name,
      email: profile.email || "",
      phone: profile.phone || "",
      empId: profile.emp_id,
      qualification: profile.qualification || "",
      experience: profile.experience || "",
      specialization: profile.specialization || "",
      joiningDate: profile.joining_date || "",
      assignedCollege: college.name,
      role: user.role,
    },
    credentials: {
      username: user.username,
      password: defaultPassword,
    },
  };
};

const normalizeDepartmentHead = (record) => ({
  id: record.id,
  userId: record.user_id,
  name: record.name,
  email: record.email || "",
  phone: record.phone || "",
  empId: record.emp_id,
  username: record.username || record.emp_id,
  password: record.password || record.emp_id,
  department: record.department_name || "",
  qualification: record.qualification || "",
  experience: record.experience || "",
  specialization: record.specialization || "",
  joiningDate: record.joining_date || "",
  role: "Department Head",
  permissions: Array.isArray(record.permissions) ? record.permissions : [],
});

const getSuperAdminCollegeProfile = async (superAdminUserId) => {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from(superAdminsTable)
    .select("college_id, colleges(id, name, code, location, address, established, type, affiliation, phone, email, website)")
    .eq("user_id", superAdminUserId)
    .maybeSingle();

  if (error) {
    throw mapSupabaseSetupError(error, `Failed to resolve SuperAdmin college: ${error.message}`);
  }

  if (!data?.college_id || !data?.colleges) {
    throw createHttpError("No college is assigned to this Super Admin", 404);
  }

  return {
    collegeId: data.college_id,
    college: {
      id: data.colleges.id,
      name: data.colleges.name,
      code: data.colleges.code,
      location: data.colleges.location || "",
      address: data.colleges.address || "",
      established: data.colleges.established || "",
      type: data.colleges.type || "",
      affiliation: data.colleges.affiliation || "",
      phone: data.colleges.phone || "",
      email: data.colleges.email || "",
      website: data.colleges.website || "",
    },
  };
};

const listDepartmentHeadsByCollege = async (collegeId) => {
  assertSupabaseConfigured();

  const { data, error } = await supabase
    .from(departmentHeadsTable)
    .select("id, user_id, name, email, phone, emp_id, department_name, qualification, experience, specialization, joining_date, app_users:user_id(username)")
    .eq("college_id", collegeId)
    .order("name", { ascending: true });

  if (error) {
    throw mapSupabaseSetupError(error, `Failed to load department heads: ${error.message}`);
  }

  return (data || []).map((head) =>
    normalizeDepartmentHead({
      ...head,
      username: head.app_users?.username || head.emp_id,
      password: head.app_users?.username || head.emp_id,
    })
  );
};

const getSuperAdminCollegeData = async (superAdminUserId) => {
  const { collegeId, college } = await getSuperAdminCollegeProfile(superAdminUserId);
  const departmentHeads = await listDepartmentHeadsByCollege(collegeId);
  const departments = [...new Set(departmentHeads.map((head) => head.department).filter(Boolean))];

  return {
    ...college,
    departments,
    departmentHeads,
  };
};

const createDepartmentHead = async ({ superAdminUserId, payload }) => {
  assertSupabaseConfigured();

  const required = ["name", "email", "empId", "department"];
  const missingField = required.find((key) => !payload?.[key]);
  if (missingField) {
    throw createHttpError(`Missing required field: ${missingField}`, 400);
  }

  const { collegeId } = await getSuperAdminCollegeProfile(superAdminUserId);
  const defaultPassword = payload.empId.trim();
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const { data: user, error: userError } = await supabase
    .from(usersTable)
    .insert({
      username: payload.empId.trim(),
      email: payload.email.trim().toLowerCase(),
      password_hash: passwordHash,
      role: "Admin",
      is_active: true,
    })
    .select("id, username")
    .single();

  if (userError) {
    const isConflict = userError.code === "23505";
    throw createHttpError(
      isConflict ? "Employee ID or email already exists" : `Failed to create department head user: ${userError.message}`,
      isConflict ? 409 : 500
    );
  }

  const { data: profile, error: profileError } = await supabase
    .from(departmentHeadsTable)
    .insert({
      user_id: user.id,
      college_id: collegeId,
      name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      phone: payload.phone?.trim() || null,
      emp_id: payload.empId.trim(),
      department_name: payload.department.trim(),
      qualification: payload.qualification?.trim() || null,
      experience: payload.experience?.trim() || null,
      specialization: payload.specialization?.trim() || null,
      joining_date: payload.joiningDate || null,
    })
    .select("id, user_id, name, email, phone, emp_id, department_name, qualification, experience, specialization, joining_date")
    .single();

  if (profileError) {
    await supabase.from(usersTable).delete().eq("id", user.id);
    const isConflict = profileError.code === "23505";
    throw createHttpError(
      isConflict ? "Department head already exists" : `Failed to save department head profile: ${profileError.message}`,
      isConflict ? 409 : 500
    );
  }

  return {
    departmentHead: normalizeDepartmentHead({
      ...profile,
      username: user.username,
      password: defaultPassword,
      permissions: payload.permissions || [],
    }),
    credentials: {
      username: user.username,
      password: defaultPassword,
    },
  };
};

const updateDepartmentHead = async ({ superAdminUserId, departmentHeadId, payload }) => {
  assertSupabaseConfigured();
  const { collegeId } = await getSuperAdminCollegeProfile(superAdminUserId);

  const { data: existing, error: findError } = await supabase
    .from(departmentHeadsTable)
    .select("id, user_id, college_id")
    .eq("id", departmentHeadId)
    .eq("college_id", collegeId)
    .maybeSingle();

  if (findError) {
    throw mapSupabaseSetupError(findError, `Failed to load department head: ${findError.message}`);
  }
  if (!existing) {
    throw createHttpError("Department head not found", 404);
  }

  const updatePayload = {
    name: payload.name?.trim(),
    email: payload.email?.trim().toLowerCase(),
    phone: payload.phone?.trim() || null,
    emp_id: payload.empId?.trim(),
    department_name: payload.department?.trim(),
    qualification: payload.qualification?.trim() || null,
    experience: payload.experience?.trim() || null,
    specialization: payload.specialization?.trim() || null,
    joining_date: payload.joiningDate || null,
  };

  const { data: updated, error: updateError } = await supabase
    .from(departmentHeadsTable)
    .update(updatePayload)
    .eq("id", departmentHeadId)
    .select("id, user_id, name, email, phone, emp_id, department_name, qualification, experience, specialization, joining_date")
    .single();

  if (updateError) {
    throw createHttpError(`Failed to update department head: ${updateError.message}`, 500);
  }

  if (payload.empId || payload.email) {
    const newUsername = payload.empId?.trim();
    const userUpdate = {};
    if (newUsername) {
      userUpdate.username = newUsername;
      userUpdate.password_hash = await bcrypt.hash(newUsername, 10);
    }
    if (payload.email) {
      userUpdate.email = payload.email.trim().toLowerCase();
    }

    userUpdate.role = "Admin";

    if (Object.keys(userUpdate).length) {
      const { error: userUpdateError } = await supabase
        .from(usersTable)
        .update(userUpdate)
        .eq("id", existing.user_id);
      if (userUpdateError) {
        throw createHttpError(`Failed to update linked user: ${userUpdateError.message}`, 500);
      }
    }
  }

  return normalizeDepartmentHead({
    ...updated,
    username: updated.emp_id,
    password: updated.emp_id,
    permissions: payload.permissions || [],
  });
};

const deleteDepartmentHead = async ({ superAdminUserId, departmentHeadId }) => {
  assertSupabaseConfigured();
  const { collegeId } = await getSuperAdminCollegeProfile(superAdminUserId);

  const { data: existing, error: findError } = await supabase
    .from(departmentHeadsTable)
    .select("id, user_id")
    .eq("id", departmentHeadId)
    .eq("college_id", collegeId)
    .maybeSingle();

  if (findError) {
    throw mapSupabaseSetupError(findError, `Failed to load department head: ${findError.message}`);
  }
  if (!existing) {
    throw createHttpError("Department head not found", 404);
  }

  const { error: deleteProfileError } = await supabase
    .from(departmentHeadsTable)
    .delete()
    .eq("id", departmentHeadId);

  if (deleteProfileError) {
    throw createHttpError(`Failed to delete department head: ${deleteProfileError.message}`, 500);
  }

  // cleanup linked login user
  await supabase.from(usersTable).delete().eq("id", existing.user_id);
};

module.exports = {
  buildGeneratedPassword,
  getCollegesWithSuperAdmins,
  createCollege,
  createSuperAdmin,
  getSuperAdminCollegeData,
  listDepartmentHeadsByCollege,
  createDepartmentHead,
  updateDepartmentHead,
  deleteDepartmentHead,
};

