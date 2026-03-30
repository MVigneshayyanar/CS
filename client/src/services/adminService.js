import axios from "axios";
import { getAuthHeaders } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchAdminStudents = async () => {
  const headers = await getAuthHeaders();
  const response = await adminApi.get("/admin/students", {
    headers,
  });
  return response.data;
};

export const fetchAdminFaculty = async () => {
  const headers = await getAuthHeaders();
  const response = await adminApi.get("/admin/faculty", {
    headers,
  });
  return response.data;
};

export const fetchAdminLabs = async () => {
  const headers = await getAuthHeaders();
  const response = await adminApi.get("/admin/labs", {
    headers,
  });
  return response.data;
};

export const fetchAdminLab = async (id) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.get(`/admin/labs/${id}`, {
    headers,
  });
  return response.data;
};

export const createAdminStudent = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.post("/admin/students", payload, {
    headers,
  });
  return response.data;
};

export const updateAdminStudent = async (id, payload) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.put(`/admin/students/${id}`, payload, {
    headers,
  });
  return response.data;
};

export const bulkUploadAdminStudents = async (file) => {
  const headers = await getAuthHeaders();
  const formData = new FormData();
  formData.append("file", file);

  const response = await adminApi.post("/admin/students/bulk-upload", formData, {
    headers,
  });
  return response.data;
};

export const deleteAdminStudent = async (id) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.delete(`/admin/students/${id}`, {
    headers,
  });
  return response.data;
};

export const createAdminFaculty = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.post("/admin/faculty", payload, {
    headers,
  });
  return response.data;
};

export const updateAdminFaculty = async (id, payload) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.put(`/admin/faculty/${id}`, payload, {
    headers,
  });
  return response.data;
};

export const deleteAdminFaculty = async (id) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.delete(`/admin/faculty/${id}`, {
    headers,
  });
  return response.data;
};

export const createAdminLab = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.post("/admin/labs", payload, {
    headers,
  });
  return response.data;
};

export const updateAdminLab = async (id, payload) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.put(`/admin/labs/${id}`, payload, {
    headers,
  });
  return response.data;
};

export const deleteAdminLab = async (id) => {
  const headers = await getAuthHeaders();
  const response = await adminApi.delete(`/admin/labs/${id}`, {
    headers,
  });
  return response.data;
};

