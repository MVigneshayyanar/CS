import React, { useState } from "react";
import logo from "@/assets/logo.svg";
import { loginByPortal } from "@/services/authService";

const LoginCard = ({ onLogin }) => {
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
        portal: "All",
      });

      const { accessToken, refreshToken, user } = result?.data || {};
      const actualUserType = user?.role;

      if (!actualUserType || !accessToken || !refreshToken) {
        throw new Error("Login failed: backend did not provide valid token pair");
      }

      if (onLogin) {
        onLogin(actualUserType);
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed. Please check your credentials.";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1e1e1e] text-white rounded-2xl p-8 w-[420px] max-w-[92vw] shadow-lg">
      <form onSubmit={handleLogin}>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Lab Management Logo" className="h-12 w-auto" />
        </div>

        <div className="mb-4">
          <label className="text-sm block mb-1">Username / ID :</label>
          <input
            type="text"
            autoComplete="username"
            className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white outline-none focus:ring-2 focus:ring-green-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username or roll number"
            disabled={isLoading}
          />
        </div>

        <div className="mb-6">
          <label className="text-sm block mb-1">Password :</label>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-md bg-[#2c2c2c] text-white outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-black font-semibold py-3 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
            "Login"
          )}
        </button>
      </form>

      {/* Login Source */}
      {/* <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg"> */}
      {/* <h4 className="text-xs font-semibold text-gray-300 mb-2">
          Authentication:
        </h4> */}
      {/* <div className="text-xs text-gray-400 space-y-1">
          <div>
            Uses backend API and Supabase users table for all roles.
          </div>
        </div> */}
      {/* </div> */}
    </div>
  );
};

export default LoginCard;
