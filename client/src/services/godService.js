import axios from "axios";
import { getAuthHeaders } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

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

export const fetchCollegeById = async (collegeId) => {
  const headers = await getAuthHeaders();
  const response = await godApi.get(`/god/colleges/${collegeId}`, {
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

export const updateCollege = async (collegeId, payload) => {
  const headers = await getAuthHeaders();
  const response = await godApi.put(`/god/colleges/${collegeId}`, payload, {
    headers,
  });

  return response.data;
};

export const deleteCollegeRecord = async (collegeId) => {
  const headers = await getAuthHeaders();
  const response = await godApi.delete(`/god/colleges/${collegeId}`, {
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

export const deleteCollege = async (collegeId) => {
  const headers = await getAuthHeaders();
  const response = await godApi.delete(`/god/colleges/${collegeId}`, {
    headers,
  });

  return response.data;
};

export const deleteSuperAdmin = async (superAdminId) => {
  const headers = await getAuthHeaders();
  const response = await godApi.delete(`/god/super-admins/${superAdminId}`, {
    headers,
  });

  return response.data;
};

export const updateSuperAdmin = async (adminId, payload) => {
  const headers = await getAuthHeaders();
  const response = await godApi.put(`/god/super-admins/${adminId}`, payload, {
    headers,
  });

  return response.data;
};

export const deleteSuperAdminRecord = async (adminId) => {
  const headers = await getAuthHeaders();
  const response = await godApi.delete(`/god/super-admins/${adminId}`, {
    headers,
  });

  return response.data;
};

export const addGod = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await godApi.post("/god/users", payload, {
    headers,
  });

  return response.data;
};

export const fetchGodUsers = async () => {
  const headers = await getAuthHeaders();
  const response = await godApi.get("/god/users", {
    headers,
  });

  return response.data;
};

export const deleteGodUser = async (userId) => {
  const headers = await getAuthHeaders();
  const response = await godApi.delete(`/god/users/${userId}`, {
    headers,
  });

  return response.data;
};

