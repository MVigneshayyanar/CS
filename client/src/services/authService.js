import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const authApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const godModeLogin = async ({ username, password }) => {
  const response = await authApi.post("/auth/login/god", {
    identifier: username,
    password,
  });

  return response.data;
};

export const loginByPortal = async ({ identifier, password, portal }) => {
  const response = await authApi.post("/auth/login", {
    identifier,
    password,
    portal,
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

  return response.data;
};
