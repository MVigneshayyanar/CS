import axios from "axios";
import {
  applyAuthSession,
  getAuthHeaders,
  logoutBackendSession,
} from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const godModeLogin = async ({ username, password }) => {
  const response = await authApi.post("/auth/login/god", {
    identifier: username,
    password,
  });

  const data = response?.data?.data || {};
  applyAuthSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  });

  return response.data;
};

export const loginByPortal = async ({ identifier, password, portal }) => {
  const response = await authApi.post("/auth/login", {
    identifier,
    password,
    portal,
  });

  const data = response?.data?.data || {};
  applyAuthSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  });

  return response.data;
};

export const loginByRole = async ({ identifier, password, role }) => {
  const rolePathMap = {
    Student: "/auth/login/student",
    Faculty: "/auth/login/faculty",
    Admin: "/auth/login/admin",
    SuperAdmin: "/auth/login/super-admin",
    God: "/auth/login/god",
  };

  const path = rolePathMap[role];

  if (!path) {
    throw new Error("Unsupported role login route");
  }

  const response = await authApi.post(path, {
    identifier,
    password,
  });

  const data = response?.data?.data || {};
  applyAuthSession({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  });

  return response.data;
};

export const changePassword = async ({ currentPassword, newPassword, token }) => {
  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : await getAuthHeaders();

  const response = await authApi.put(
    "/auth/password/change",
    {
      currentPassword,
      newPassword,
    },
    {
      headers,
    }
  );

  return response.data;
};

export const changeStudentPassword = async ({ currentPassword, newPassword, token }) =>
  changePassword({ currentPassword, newPassword, token });

export const logoutUser = async () => logoutBackendSession();
