const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { supabase } = require("../config/supabaseClient");

const PORTAL_ROLE_MAP = {
  God: ["God"],
  Student: ["Student"],
  Staff: ["Faculty", "Admin", "SuperAdmin", "God"],
};

const ROLE_LOGIN_MAP = {
  God: ["God"],
  SuperAdmin: ["SuperAdmin"],
  Admin: ["Admin"],
  Faculty: ["Faculty"],
  Student: ["Student"],
};

const getAllowedRolesByPortal = (portal) => PORTAL_ROLE_MAP[portal] || [];
const getAllowedRolesByLoginType = (loginType) => ROLE_LOGIN_MAP[loginType] || [];

const normalizeUserRecord = (record) => ({
  id: record.id,
  username: record.username,
  email: record.email,
  role: record.role,
  passwordHash: record.password_hash,
  isActive: record.is_active !== false,
});

const loadUserByIdentifier = async (identifier) => {
  if (!supabase) {
    const configError = new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables");
    configError.statusCode = 500;
    throw configError;
  }

  const usersTable = process.env.SUPABASE_USERS_TABLE || "app_users";

  const { data, error } = await supabase
    .from(usersTable)
    .select("id, username, email, role, password_hash, is_active")
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .limit(1)
    .maybeSingle();

  if (error) {
    const serviceError = new Error(`Supabase query failed: ${error.message}`);
    serviceError.statusCode = 500;
    throw serviceError;
  }

  return data ? normalizeUserRecord(data) : null;
};

const signToken = (user) => {
  const secret = process.env.JWT_SECRET || "dev-jwt-secret-change-me";

  return jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
    },
    secret,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

const ensureRoleIsAllowed = (role, allowedRoles) => {
  if (!allowedRoles.includes(role)) {
    const error = new Error("Role is not allowed for this login");
    error.statusCode = 403;
    throw error;
  }
};

const loginWithRoles = async ({ identifier, password, allowedRoles }) => {
  if (!identifier || !password) {
    const error = new Error("Identifier and password are required");
    error.statusCode = 400;
    throw error;
  }

  const user = await loadUserByIdentifier(identifier);

  if (!user || !user.passwordHash) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User account is disabled");
    error.statusCode = 403;
    throw error;
  }

  ensureRoleIsAllowed(user.role, allowedRoles);

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = signToken(user);

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

module.exports = {
  getAllowedRolesByPortal,
  getAllowedRolesByLoginType,
  loginWithRoles,
};
