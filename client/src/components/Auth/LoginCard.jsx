import React, { useState } from "react";
import logo from "@/assets/logo.svg";

const LoginCard = ({ onLogin }) => {
  const [userType, setUserType] = useState("Student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mock user database
  const mockUsers = {
    Student: {
      student1: "pass123",
      john: "password",
      jane: "secret",
      demo: "demo",
    },
    Staff: {
      staff1: "pass123",
      admin: "admin123",       // Admin user
      superadmin: "super123",  // Super admin
      god: "godmode",          // God mode
      teacher: "teach123",
      demo: "demo",
    },
  };

  // Map special users to higher roles
  const roleMap = {
    admin: "Admin",
    superadmin: "SuperAdmin",
    god: "God",
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      setIsLoading(false);
      alert("Please enter both username and password.");
      return;
    }

    setTimeout(() => {
      const userDatabase = mockUsers[userType];

      if (userDatabase && userDatabase[username] === password) {
        // Default user role
        let actualUserType = userType === "Staff" ? "Faculty" : userType;

        // Override if in roleMap
        if (userType === "Staff" && roleMap[username]) {
          actualUserType = roleMap[username];
        }

        console.log("Login successful for:", username, "as", actualUserType);

        // Store authentication data
        sessionStorage.setItem("isAuthenticated", "true");
        sessionStorage.setItem("userType", actualUserType);
        sessionStorage.setItem("userId", `mock_${actualUserType}_${username}`);
        sessionStorage.setItem("username", username);

        // Call parent login handler
        if (onLogin) {
          onLogin(actualUserType);
        }
      } else {
        alert("Invalid username or password. Please try again.");
      }

      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="bg-[#1e1e1e] text-white rounded-2xl p-6 w-[340px] shadow-lg">
      <form onSubmit={handleLogin}>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Lab Management Logo" className="h-12 w-auto" />
        </div>

        <div className="flex justify-center mb-6">
          <div className="relative flex bg-[#3a3a3a] rounded-full overflow-hidden w-[180px]">
            <span
              className={`absolute top-0 bottom-0 w-1/2 bg-green-500 rounded-full transition-transform duration-300 ease-in-out ${
                userType === "Student" ? "translate-x-0" : "translate-x-full"
              }`}
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
            <span className="text-green-400 font-semibold">{userType}</span>
          </p>
        </div>

        <div className="mb-4">
          <label className="text-sm block mb-1">Username :</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-md bg-[#2c2c2c] text-white outline-none focus:ring-2 focus:ring-green-400"
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
            className="w-full px-3 py-2 rounded-md bg-[#2c2c2c] text-white outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-black font-semibold py-2 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

      {/* Demo Credentials */}
      <div className="mt-4 p-3 bg-[#2a2a2a] rounded-lg">
        <h4 className="text-xs font-semibold text-gray-300 mb-2">
          Demo Credentials:
        </h4>
        <div className="text-xs text-gray-400 space-y-1">
          <div>
            <strong>Student:</strong> demo/demo, student1/pass123
          </div>
          <div>
            <strong>Faculty:</strong> demo/demo, teacher/teach123
          </div>
          <div>
            <strong>Admin:</strong> admin/admin123
          </div>
          <div>
            <strong>Super Admin:</strong> superadmin/super123
          </div>
          <div>
            <strong>God Mode:</strong> god/godmode
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
