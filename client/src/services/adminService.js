import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const adminApi = axios.create({
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

export const fetchAdminStudents = async () => {
  const response = await adminApi.get("/admin/students", {
    headers: authHeaders(),
  });
  return response.data;
};

export const fetchAdminFaculty = async () => {
  const response = await adminApi.get("/admin/faculty", {
    headers: authHeaders(),
  });
  return response.data;
};

export const fetchAdminLabs = async () => {
  const response = await adminApi.get("/admin/labs", {
    headers: authHeaders(),
  });
  return response.data;
};

export const createAdminStudent = async (payload) => {
  const response = await adminApi.post("/admin/students", payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const updateAdminStudent = async (id, payload) => {
  const response = await adminApi.put(`/admin/students/${id}`, payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const deleteAdminStudent = async (id) => {
  const response = await adminApi.delete(`/admin/students/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};

export const createAdminFaculty = async (payload) => {
  const response = await adminApi.post("/admin/faculty", payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const updateAdminFaculty = async (id, payload) => {
  const response = await adminApi.put(`/admin/faculty/${id}`, payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const deleteAdminFaculty = async (id) => {
  const response = await adminApi.delete(`/admin/faculty/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};

export const createAdminLab = async (payload) => {
  const response = await adminApi.post("/admin/labs", payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const updateAdminLab = async (id, payload) => {
  const response = await adminApi.put(`/admin/labs/${id}`, payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const deleteAdminLab = async (id) => {
  const response = await adminApi.delete(`/admin/labs/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};

