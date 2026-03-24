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
        <div className="top-bar bg-neutral-900/80 backdrop-blur-sm border-b border-neutral-700/50 px-6 py-3 sticky top-0 z-10">
            <div className="flex items-center justify-between">
                {/* Logo and Welcome */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-lg text-neutral-300">Welcome back</h1>
                        </div>
                    </div>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-4">
                    {/* Profile Section */}
                    <div className="relative">
                        <div
                            className="flex items-center gap-3 p-2 bg-neutral-800/50 border border-neutral-700/30 rounded-lg hover:bg-neutral-700/50 hover:border-neutral-600/50 transition-all duration-200"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                    {facultyName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-white">{facultyName}</p>
                                <p className="text-xs text-neutral-400">{department}</p>
                            </div>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="text-red-400 hover:text-red-300 hover:bg-[#2a2a2a] p-2 rounded-lg transition-all duration-200"
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
