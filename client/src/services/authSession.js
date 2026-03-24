import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const sessionApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let refreshPromise = null;

const parseJwt = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    if (!base64Payload) {
      return null;
    }
    const normalized = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch (_error) {
    return null;
  }
};

const isTokenExpiringSoon = (token, skewSeconds = 30) => {
  const payload = parseJwt(token);
  if (!payload?.exp) {
    return true;
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowSeconds + skewSeconds;
};

export const clearAuthSession = () => {
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("userType");
  sessionStorage.removeItem("userId");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("refreshToken");
};

export const applyAuthSession = ({ accessToken, refreshToken, user }) => {
  if (!accessToken || !refreshToken || !user?.role) {
    throw new Error("Invalid authentication response from backend");
  }

  sessionStorage.setItem("isAuthenticated", "true");
  sessionStorage.setItem("authToken", accessToken);
  sessionStorage.setItem("refreshToken", refreshToken);
  sessionStorage.setItem("userType", user.role);
  sessionStorage.setItem("userId", user.id || "");
  sessionStorage.setItem("username", user.username || "");
};

export const refreshAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshToken = sessionStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  refreshPromise = sessionApi
    .post("/auth/refresh", { refreshToken })
    .then((response) => {
      const data = response?.data?.data || {};
      const nextAccessToken = data.accessToken;
      const nextRefreshToken = data.refreshToken;
      const user = data.user;

      if (!nextAccessToken || !nextRefreshToken) {
        throw new Error("Invalid refresh response");
      }

      sessionStorage.setItem("authToken", nextAccessToken);
      sessionStorage.setItem("refreshToken", nextRefreshToken);

      if (user?.role) {
        sessionStorage.setItem("userType", user.role);
      }
      if (user?.id) {
        sessionStorage.setItem("userId", user.id);
      }
      if (user?.username) {
        sessionStorage.setItem("username", user.username);
      }

      return nextAccessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

export const getValidAccessToken = async () => {
  const accessToken = sessionStorage.getItem("authToken");

  if (!accessToken) {
    throw new Error("Missing access token");
  }

  if (isTokenExpiringSoon(accessToken)) {
    return refreshAccessToken();
  }

  return accessToken;
};

export const getAuthHeaders = async () => {
  const token = await getValidAccessToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const logoutBackendSession = async () => {
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!refreshToken) {
    throw new Error("Missing refresh token for logout");
  }

  const accessToken = sessionStorage.getItem("authToken");
  const headers = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};

  await sessionApi.post(
    "/auth/logout",
    { refreshToken },
    { headers }
  );

  clearAuthSession();
};
