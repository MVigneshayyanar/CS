import React, { useState } from 'react';
import { Users, UserCheck, FlaskConical } from 'lucide-react';
import StudentManagement from '../../components/Admin/StudentManagement';
import FacultyManagement from '../../components/Admin/FacultyManagement';
import LabManagement from '../../components/Admin/LabManagement';

const TabButton = ({ id, label, icon: Icon, activeTab, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center px-6 py-4 font-medium transition-all border-b-2 ${
      activeTab === id
        ? 'text-[#3aa892] border-[#3aa892] bg-alt'
        : 'text-muted border-transparent hover:text-[#5c9088] hover:bg-neutral-800/30'
    }`}
  >
    <Icon className="w-5 h-5 mr-3" />
    {label}
  </button>
);

const DigitalLabAdmin = () => {
  const [activeTab, setActiveTab] = useState('students');

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#3aa892] to-[#3aa892] bg-clip-text text-transparent">
                Digital Lab Admin Panel
              </h1>
              <p className="text-muted mt-1">Programming Lab Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-body">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto">
        <div className="border-b border-neutral-800 bg-neutral-900/30 backdrop-blur-sm">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            <TabButton id="students" label="Students" icon={Users} activeTab={activeTab} onClick={setActiveTab} />
            <TabButton id="faculty" label="Faculty" icon={UserCheck} activeTab={activeTab} onClick={setActiveTab} />
            <TabButton id="labs" label="Labs" icon={FlaskConical} activeTab={activeTab} onClick={setActiveTab} />
          </nav>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          {activeTab === 'students' && <StudentManagement />}
          {activeTab === 'faculty' && <FacultyManagement />}
          {activeTab === 'labs' && <LabManagement />}
        </div>
      </div>
    </div>
  );
};

export default DigitalLabAdmin;
