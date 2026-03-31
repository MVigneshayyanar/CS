import React from "react";
import LoginCard from "../../components/Auth/LoginCard.jsx";
import bgImage from "@/assets/loginbg.png";

const LoginPage = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: 'var(--login-bg)' }}>
      {/* Background Image with Blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110 z-0"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Content on Top */}
      <div className="z-10">
        <LoginCard onLogin={onLogin} />
      </div>
    </div>
  );
};

export default LoginPage;