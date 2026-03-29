import axios from "axios";
import { getAuthHeaders } from "./authSession";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const facultyApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const fetchFacultyDashboard = async () => {
  const headers = await getAuthHeaders();
  const response = await facultyApi.get("/faculty/dashboard", {
    headers,
  });
  return response.data;
};

export const fetchFacultyLabs = async () => {
  const headers = await getAuthHeaders();
  const response = await facultyApi.get("/faculty/labs", {
    headers,
  });
  return response.data;
};

export const updateExperimentDeadline = async (labId, experimentIndex, deadline, section) => {
  const headers = await getAuthHeaders();
  const response = await facultyApi.put(
    "/faculty/experiment-deadline",
    { labId, experimentIndex, deadline, section },
    { headers }
  );
  return response.data;
};

export const fetchFacultyProfile = async () => {
  const headers = await getAuthHeaders();
  const response = await facultyApi.get("/faculty/profile", {
    headers,
  });
  return response.data;
};

