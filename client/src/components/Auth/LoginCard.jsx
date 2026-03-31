import React, { useState } from "react";
import logo from "@/assets/logo.svg";
import { loginByPortal } from "@/services/authService";

const LoginCard = ({ onLogin }) => {
  const [userType, setUserType] = useState("Student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      setIsLoading(false);
      alert("Please enter both username and password.");
      return;
    }

    try {
      const result = await loginByPortal({
        identifier: username,
        password,
        portal: userType,
      });

      const { accessToken, refreshToken, user } = result?.data || {};
      const actualUserType = user?.role;

      if (!actualUserType || !accessToken || !refreshToken) {
        throw new Error(
          "Login failed: backend did not provide valid token pair",
        );
      }

      if (onLogin) {
        onLogin(actualUserType);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Login failed. Please check your credentials.";
      const normalized = String(message).toLowerCase();
      if (
        normalized.includes("cors") ||
        normalized.includes("blocked for origin")
      ) {
        alert(
          "Unable to reach server from this environment. Please restart frontend and try again.",
        );
      } else {
        alert(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white rounded-2xl p-8 w-[420px] max-w-[92vw] shadow-lg" style={{ background: '#132820', border: '1px solid rgba(42,140,120,0.22)' }}>
      <form onSubmit={handleLogin}>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Lab Management Logo" className="h-12 w-auto" />
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative flex rounded-full overflow-hidden w-[220px]" style={{ background: '#0f2420' }}>
            <span
              className={`absolute top-0 bottom-0 w-1/2 rounded-full transition-transform duration-300 ease-in-out ${
                userType === "Student" ? "translate-x-0" : "translate-x-full"
              }`}
              style={{ background: '#1a6b5c' }}
            />
            <button
              type="button"
              onClick={() => setUserType("Student")}
              disabled={isLoading}
              className={`relative z-10 w-1/2 py-1 text-sm font-semibold rounded-full transition-all duration-300 disabled:opacity-50 ${
                userType === "Student" ? "text-black" : "text-white"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setUserType("Staff")}
              disabled={isLoading}
              className={`relative z-10 w-1/2 py-1 text-sm font-semibold rounded-full transition-all duration-300 disabled:opacity-50 ${
                userType === "Staff" ? "text-black" : "text-white"
              }`}
            >
              Staff
            </button>
          </div>
        </div>

        <div className="text-center mb-4">
          <p className="text-sm text-gray-400">
            Logging in as{" "}
            <span className="font-semibold" style={{ color: '#2a8c78' }}>{userType}</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="text-sm block mb-1">Username :</label>
          <input
            type="text"
            autoComplete="username"
            className="w-full px-4 py-3 rounded-md text-white outline-none focus:ring-2 focus:ring-[#3aa892]"
            style={{ background: '#0f2420', border: '1px solid rgba(42,140,120,0.18)' }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={`Enter ${userType.toLowerCase()} username`}
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label className="text-sm block mb-1">Password :</label>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-md text-white outline-none focus:ring-2 focus:ring-[#3aa892]"
            style={{ background: '#0f2420', border: '1px solid rgba(42,140,120,0.18)' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white font-semibold py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #1a6b5c, #2a8c78)' }}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Authenticating...
            </>
          ) : (
            `Login as ${userType}`
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginCard;
