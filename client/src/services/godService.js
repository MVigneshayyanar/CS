import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const godApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

const authHeaders = () => {
  const token = sessionStorage.getItem("authToken");

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const fetchColleges = async () => {
  const response = await godApi.get("/god/colleges", {
    headers: authHeaders(),
  });

  return response.data;
};

export const addCollege = async (payload) => {
  const response = await godApi.post("/god/colleges", payload, {
    headers: authHeaders(),
  });

  return response.data;
};

export const addSuperAdmin = async (payload) => {
  const response = await godApi.post("/god/super-admins", payload, {
    headers: authHeaders(),
  });

  return response.data;
};

