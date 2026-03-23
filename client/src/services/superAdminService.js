import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const superAdminApi = axios.create({
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

export const fetchSuperAdminCollege = async () => {
  const response = await superAdminApi.get("/super-admin/college", {
    headers: authHeaders(),
  });
  return response.data;
};

export const createDepartmentHead = async (payload) => {
  const response = await superAdminApi.post("/super-admin/department-heads", payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const updateDepartmentHead = async (id, payload) => {
  const response = await superAdminApi.put(`/super-admin/department-heads/${id}`, payload, {
    headers: authHeaders(),
  });
  return response.data;
};

export const deleteDepartmentHead = async (id) => {
  const response = await superAdminApi.delete(`/super-admin/department-heads/${id}`, {
    headers: authHeaders(),
  });
  return response.data;
};

