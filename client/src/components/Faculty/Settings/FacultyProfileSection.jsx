import React, { useState, useEffect } from 'react';
import { User, Hash, Mail, Building, GraduationCap, Calendar, Shield } from './SettingsIcons';
import { fetchFacultyProfile } from '@/services/facultyService';

const FacultyProfileSection = () => {
  const [facultyData, setFacultyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const result = await fetchFacultyProfile();
        setFacultyData(result.data);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <div className="p-10 text-center text-muted">Loading profile...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!facultyData) return <div className="p-10 text-center text-muted">No profile data found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">My Faculty Profile</h3>
        
        <div className="space-y-6">
          <div className="bg-neutral-800/30 rounded-lg p-6 border border-theme">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <User />
              <span className="ml-2 text-[#3aa892]">Personal Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Full Name</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-theme rounded-lg text-muted">
                  {facultyData.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Username</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-theme rounded-lg text-muted flex items-center">
                  <Hash />
                  <span className="ml-2">{facultyData.username}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-theme rounded-lg text-muted flex items-center">
                  <Mail />
                  <span className="ml-2">{facultyData.email || 'Not provided'}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Role</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-theme rounded-lg text-muted">
                  {facultyData.role}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/30 rounded-lg p-6 border border-theme">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <GraduationCap />
              <span className="ml-2 text-[#3aa892]">Academic Information</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Department</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-theme rounded-lg text-muted">
                  {facultyData.department || 'Computer Science'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Designation</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-theme rounded-lg text-muted">
                  {facultyData.designation || 'Faculty'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted mb-2">Joining Date</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-theme rounded-lg text-muted flex items-center">
                  <Calendar />
                  <span className="ml-2">
                    {facultyData.joinedAt ? new Date(facultyData.joinedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
            <p className="text-amber-300 text-sm flex items-start">
              <Shield className="mt-1" size={16} />
              <span className="ml-2">
                <strong>Note:</strong> Faculty profile information is maintained by the institution. 
                To update any of these details, please contact the administration department.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyProfileSection;
