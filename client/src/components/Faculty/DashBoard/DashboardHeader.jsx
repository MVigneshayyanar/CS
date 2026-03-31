import React, { useState } from 'react';

const DashboardHeader = ({ facultyName = "Dr. Sarah Johnson", department = "Computer Science" }) => {
    const [showProfile, setShowProfile] = useState(false);

    return (
        <div className="bg-card backdrop-blur-sm border-b border-theme px-6 py-4 sticky top-0 z-40">
            <div className="flex items-center justify-between">
                {/* Logo and Welcome */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-lg text-muted">Welcome back</h1>
                        </div>
                    </div>
                </div>

                {/* Search and Actions */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div
                            className="flex items-center gap-3 p-2 bg-alt border border-theme-light rounded-lg hover:bg-neutral-700/50 hover:border-theme transition-all duration-200"
                        >
                            <div className="w-8 h-8 bg-gradient-to-r from-[#3aa892] to-[#3aa892] rounded-full flex items-center justify-center">
                                <span className="text-sm font-semibold text-white">
                                    {facultyName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </span>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-white">{facultyName}</p>
                                <p className="text-xs text-muted">{department}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;