import axios from "axios";
import { getAuthHeaders } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const studentApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchStudentDashboard = async () => {
  const headers = await getAuthHeaders();
  const response = await studentApi.get("/student/dashboard", {
    headers,
  });
  return response.data;
};

export const fetchStudentLabs = async () => {
  const headers = await getAuthHeaders();
  const response = await studentApi.get("/student/labs", {
    headers,
  });
  return response.data;
};

export const fetchStudentStatistics = async () => {
  const headers = await getAuthHeaders();
  const response = await studentApi.get("/student/statistics", {
    headers,
  });
  return response.data;
};

export const fetchStudentReports = async () => {
  const headers = await getAuthHeaders();
  const response = await studentApi.get("/student/reports", {
    headers,
  });
  return response.data;
};

export const updateExperimentStatus = async (labId, experimentIndex, status, progress, code, testResults) => {
  const headers = await getAuthHeaders();
  const response = await studentApi.put(
    "/student/experiment-status",
    { labId, experimentIndex, status, progress, code, testResults },
    { headers }
  );
  return response.data;
};

