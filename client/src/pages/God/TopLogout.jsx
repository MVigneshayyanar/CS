import React, { useState } from 'react';
import { LogOut } from 'lucide-react';

const TopLogout = ({ onLogout, facultyName = "Dr. Sarah Johnson", department = "Computer Science" }) => {
    const [showProfile, setShowProfile] = useState(false);

      const handleLogout = () => {
        if (onLogout) {
            onLogout();
        }
    };

    return (
        <div 
          className="top-bar backdrop-blur-sm px-6 py-3 sticky top-0 z-10"
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
                            <h1 className="text-lg" style={{ color: 'var(--text-muted)' }}>Welcome back</h1>
                        </div>
                    </div>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-4">
                    {/* Profile Section */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-3 p-2 rounded-lg hover:opacity-80 transition-all duration-200"
                            style={{ 
                              background: 'var(--bg-card)', 
                              border: '1px solid var(--border-color)' 
                            }}
                        >
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--gradient-accent)' }}>
                                <span className="text-sm font-semibold text-white">
                                    {facultyName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium" style={{ color: 'var(--text-heading)' }}>{facultyName}</p>
                                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{department}</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 p-2 rounded-lg transition-all duration-200"
                        style={{ background: 'transparent' }}
                        title="Logout"
                    >
                        <div className="grid h-9 w-9 place-content-center rounded-lg bg-red-900/30 flex-shrink-0 relative">
                            <LogOut className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopLogout;
