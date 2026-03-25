import axios from "axios";
import { getAuthHeaders } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const superAdminApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchSuperAdminCollege = async () => {
  const headers = await getAuthHeaders();
  const response = await superAdminApi.get("/super-admin/college", {
    headers,
  });
  return response.data;
};

export const createDepartmentHead = async (payload) => {
  const headers = await getAuthHeaders();
  const response = await superAdminApi.post("/super-admin/department-heads", payload, {
    headers,
  });
  return response.data;
};

export const updateDepartmentHead = async (id, payload) => {
  const headers = await getAuthHeaders();
  const response = await superAdminApi.put(`/super-admin/department-heads/${id}`, payload, {
    headers,
  });
  return response.data;
};

export const deleteDepartmentHead = async (id) => {
  const headers = await getAuthHeaders();
  const response = await superAdminApi.delete(`/super-admin/department-heads/${id}`, {
    headers,
  });
  return response.data;
};

