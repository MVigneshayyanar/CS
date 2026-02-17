import React, { useState } from 'react';
import { User, Hash, Mail, Building, GraduationCap, Calendar, Award, Code, Shield } from './SettingsIcons';

const FacultyProfileSection = () => {
  const [facultyData] = useState({
    employeeId: 'FAC2021001',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+91 9876543210',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor',
    qualification: 'Ph.D. in Computer Science',
    experience: '12 years',
    specialization: 'Data Structures, Algorithms, Machine Learning',
    office: 'Room 304, CS Block',
    joiningDate: '2012-08-15',
    employeeType: 'Permanent Faculty',
    address: '456 Faculty Colony, University Campus, City - 123456',
    emergencyContact: '+91 9876543211',
    researchInterests: 'Artificial Intelligence, Data Mining, Software Engineering'
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">My Faculty Profile</h3>
        <p className="text-neutral-400 text-sm mb-6">
          Your faculty information is managed by the HR department and cannot be modified here. 
          Contact HR for any updates to your profile.
        </p>
        
        <div className="space-y-6">
          <div className="bg-neutral-800/30 rounded-lg p-6 border border-neutral-700/50">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <User />
              <span className="ml-2 text-emerald-400">Personal Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Employee ID</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300 flex items-center">
                  <Hash />
                  <span className="ml-2">{facultyData.employeeId}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300 flex items-center">
                  <Mail />
                  <span className="ml-2">{facultyData.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Phone Number</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.phone}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Office Location</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300 flex items-center">
                  <Building />
                  <span className="ml-2">{facultyData.office}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Emergency Contact</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.emergencyContact}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/30 rounded-lg p-6 border border-neutral-700/50">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <GraduationCap />
              <span className="ml-2 text-emerald-400">Academic Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Department</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.department}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Designation</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.designation}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Qualification</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300 flex items-center">
                  <Award />
                  <span className="ml-2">{facultyData.qualification}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Experience</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.experience}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Joining Date</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300 flex items-center">
                  <Calendar />
                  <span className="ml-2">{new Date(facultyData.joiningDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Employee Type</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.employeeType}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/30 rounded-lg p-6 border border-neutral-700/50">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <Code />
              <span className="ml-2 text-emerald-400">Specialization & Research</span>
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Areas of Specialization</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.specialization}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Research Interests</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {facultyData.researchInterests}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
            <p className="text-amber-300 text-sm flex items-start">
              <Shield />
              <span className="ml-2">
                <strong>Note:</strong> Faculty profile information is maintained by the HR department. 
                To update any of these details, please contact HR or submit a request through the faculty portal.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfileSection;
