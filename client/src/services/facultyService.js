import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const facultyApi = axios.create({
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

export const fetchFacultyDashboard = async () => {
  const response = await facultyApi.get("/faculty/dashboard", {
    headers: authHeaders(),
  });
  return response.data;
};

