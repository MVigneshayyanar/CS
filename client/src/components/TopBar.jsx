import React, { useState } from "react";

const TopBar = ({
  facultyName = "Dr. Sarah Johnson",
  department = "Computer Science",
}) => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div 
      className="top-bar backdrop-blur-md px-6 py-3 sticky top-0 z-10"
      style={{ 
        background: 'var(--topbar-bg)', 
        borderBottom: '1px solid var(--topbar-border)' 
      }}
    >
      <div className="flex items-center justify-between">
        {/* Logo and Welcome */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg" style={{ color: 'var(--text-muted)' }}></h1>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
      </div>
    </div>
  );
};

export default TopBar;
