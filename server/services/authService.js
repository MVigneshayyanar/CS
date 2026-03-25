const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
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

const usersTable = process.env.SUPABASE_USERS_TABLE || "app_users";
const refreshTokenStore = new Map();
const activeRefreshByFamily = new Map();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "dev-jwt-refresh-secret-change-me";
const accessTokenTtl = process.env.ACCESS_TOKEN_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "15m";
const refreshTokenTtl = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const loadUserByIdentifier = async (identifier) => {
  if (!supabase) {
    const configError = new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables");
    configError.statusCode = 500;
    throw configError;
  }

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

const loadUserById = async (userId) => {
  if (!supabase) {
    const configError = new Error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables");
    configError.statusCode = 500;
    throw configError;
  }

  const { data, error } = await supabase
    .from(usersTable)
    .select("id, username, email, role, password_hash, is_active")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    const serviceError = new Error(`Supabase query failed: ${error.message}`);
    serviceError.statusCode = 500;
    throw serviceError;
  }

  return data ? normalizeUserRecord(data) : null;
};

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
      tokenType: "access",
    },
    accessTokenSecret,
    {
      expiresIn: accessTokenTtl,
    }
  );

const decodeTokenWithoutVerify = (token) => {
  try {
    return jwt.decode(token) || null;
  } catch (_error) {
    return null;
  }
};

const signRefreshToken = ({ user, familyId, tokenId }) =>
  jwt.sign(
    {
      sub: user.id,
      username: user.username,
      role: user.role,
      tokenType: "refresh",
      familyId,
      tokenId,
    },
    refreshTokenSecret,
    {
      expiresIn: refreshTokenTtl,
    }
  );

const issueTokenPair = (user, existingFamilyId) => {
  const familyId = existingFamilyId || crypto.randomUUID();
  const tokenId = crypto.randomUUID();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken({ user, familyId, tokenId });
  const decodedRefresh = decodeTokenWithoutVerify(refreshToken);

  refreshTokenStore.set(tokenId, {
    tokenId,
    familyId,
    userId: user.id,
    revoked: false,
    expiresAt: decodedRefresh?.exp ? decodedRefresh.exp * 1000 : null,
  });
  activeRefreshByFamily.set(familyId, tokenId);

  return {
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    accessTokenExpiresIn: accessTokenTtl,
    refreshTokenExpiresIn: refreshTokenTtl,
  };
};

const verifyAccessToken = (token) => {
  const payload = jwt.verify(token, accessTokenSecret);
  if (payload.tokenType && payload.tokenType !== "access") {
    const error = new Error("Invalid access token type");
    error.statusCode = 401;
    throw error;
  }
  return payload;
};

const verifyRefreshToken = (refreshToken) => {
  const payload = jwt.verify(refreshToken, refreshTokenSecret);
  if (payload.tokenType !== "refresh") {
    const error = new Error("Invalid refresh token type");
    error.statusCode = 401;
    throw error;
  }
  return payload;
};

const revokeRefreshFamily = (familyId) => {
  for (const record of refreshTokenStore.values()) {
    if (record.familyId === familyId) {
      record.revoked = true;
    }
  }
  activeRefreshByFamily.delete(familyId);
};

const rotateRefreshToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token is required");
    error.statusCode = 400;
    throw error;
  }

  const payload = verifyRefreshToken(refreshToken);
  let storedRecord = refreshTokenStore.get(payload.tokenId);

  // Tokens are kept in memory; when server restarts the map is empty.
  // If JWT is valid, rehydrate minimal state so users stay logged in.
  if (!storedRecord) {
    storedRecord = {
      tokenId: payload.tokenId,
      familyId: payload.familyId,
      userId: payload.sub,
      revoked: false,
      expiresAt: payload.exp ? payload.exp * 1000 : null,
    };
    refreshTokenStore.set(payload.tokenId, storedRecord);
  }

  if (storedRecord.revoked || storedRecord.userId !== payload.sub) {
    const error = new Error("Refresh token is invalid");
    error.statusCode = 401;
    throw error;
  }

  const activeTokenId = activeRefreshByFamily.get(payload.familyId);
  if (!activeTokenId) {
    activeRefreshByFamily.set(payload.familyId, payload.tokenId);
  } else if (activeTokenId !== payload.tokenId) {
    // Stale refresh token reuse can happen with multi-tab or request races.
    // Do not revoke the active family; just reject this stale token.
    const error = new Error("Refresh token is stale. Use latest refresh token.");
    error.statusCode = 401;
    throw error;
  }

  const user = await loadUserById(payload.sub);
  if (!user || !user.isActive) {
    revokeRefreshFamily(payload.familyId);
    const error = new Error("User account is not active");
    error.statusCode = 403;
    throw error;
  }

  storedRecord.revoked = true;
  const tokenPair = issueTokenPair(user, payload.familyId);

  return {
    ...tokenPair,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

const logoutWithRefreshToken = (refreshToken) => {
  if (!refreshToken) {
    const error = new Error("Refresh token is required for logout");
    error.statusCode = 400;
    throw error;
  }

  const payload = verifyRefreshToken(refreshToken);
  revokeRefreshFamily(payload.familyId);

  return {
    revoked: true,
  };
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

  const tokenPair = issueTokenPair(user);

  return {
    token: tokenPair.accessToken,
    accessToken: tokenPair.accessToken,
    refreshToken: tokenPair.refreshToken,
    tokenType: tokenPair.tokenType,
    accessTokenExpiresIn: tokenPair.accessTokenExpiresIn,
    refreshTokenExpiresIn: tokenPair.refreshTokenExpiresIn,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
};

const changePasswordForUser = async ({ userId, currentPassword, newPassword, allowedRoles }) => {
  if (!userId || !currentPassword || !newPassword) {
    const error = new Error("Current password and new password are required");
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 8) {
    const error = new Error("New password must be at least 8 characters long");
    error.statusCode = 400;
    throw error;
  }

  const user = await loadUserById(userId);

  if (!user || !user.passwordHash) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User account is disabled");
    error.statusCode = 403;
    throw error;
  }

  ensureRoleIsAllowed(user.role, allowedRoles);

  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

  if (!isCurrentPasswordValid) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 401;
    throw error;
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);

  const { error: updateError } = await supabase
    .from(usersTable)
    .update({
      password_hash: newPasswordHash,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    const error = new Error(`Supabase update failed: ${updateError.message}`);
    error.statusCode = 500;
    throw error;
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  };
};

module.exports = {
  getAllowedRolesByPortal,
  getAllowedRolesByLoginType,
  loginWithRoles,
  changePasswordForUser,
  rotateRefreshToken,
  logoutWithRefreshToken,
  verifyAccessToken,
};
