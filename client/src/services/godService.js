import axios from "axios";
import { getAuthHeaders } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const godApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchColleges = async () => {
  const headers = await getAuthHeaders();
  const response = await godApi.get("/god/colleges", {
    headers,
  });

  return response.data;
};

export const addCollege = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await godApi.post("/god/colleges", payload, {
    headers,
  });

  return response.data;
};

export const addSuperAdmin = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await godApi.post("/god/super-admins", payload, {
    headers,
  });

  return response.data;
};

