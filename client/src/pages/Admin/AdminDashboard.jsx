import React, { useEffect, useState } from 'react';
import { Users, UserCheck, FlaskConical, Activity, Shield, TrendingUp, ArrowUpRight } from 'lucide-react';
import { fetchAdminStudents, fetchAdminFaculty, fetchAdminLabs } from '@/services/adminService';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ students: 0, faculty: 0, labs: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentFaculty, setRecentFaculty] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [studentsResult, facultyResult, labsResult] = await Promise.all([
          fetchAdminStudents(),
          fetchAdminFaculty(),
          fetchAdminLabs(),
        ]);
        const studentsList = studentsResult?.data?.students || [];
        const facultyList = facultyResult?.data?.faculty || [];
        const labsList = labsResult?.data?.labs || [];

        setCounts({
          students: studentsList.length,
          faculty: facultyList.length,
          labs: labsList.length,
        });
        setRecentStudents(studentsList.slice(0, 5));
        setRecentFaculty(facultyList.slice(0, 5));
      } catch (error) {
        // silently handle — stats are non-critical
      } finally {
        setIsLoading(false);
      }
    };
    loadStats();
  }, []);

  const stats = [
    {
      title: 'Students',
      value: isLoading ? '—' : counts.students,
      subtitle: 'Registered students',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Faculty',
      value: isLoading ? '—' : counts.faculty,
      subtitle: 'Active faculty members',
      icon: UserCheck,
      gradient: 'from-[#2a8c78] to-[#1a6b5c]',
      bgLight: 'bg-[#f0f7f5]',
      textColor: 'text-[#1a6b5c]',
    },
    {
      title: 'Labs',
      value: isLoading ? '—' : counts.labs,
      subtitle: 'Programming labs',
      icon: FlaskConical,
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  const quickActions = [
    { label: 'Add Student', description: 'Register a new student', path: '/students', icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Add Faculty', description: 'Add a new faculty member', path: '/faculty', icon: UserCheck, color: 'text-[#1a6b5c] bg-[#f0f7f5]' },
    { label: 'Create Lab', description: 'Set up a programming lab', path: '/labs', icon: FlaskConical, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">

        {/* Hero Header Banner — matching God dashboard */}
        <div className="relative bg-[#1a6b5c] rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs text-teal-100">System overview and management controls</p>
            </div>
          </div>
          <div className="relative z-10 text-xs text-teal-100 font-medium">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-10 w-24 h-24 rounded-full bg-white/5" />
        </div>

        {/* Stats Grid — compact like God dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card border border-theme rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-r ${stat.gradient}`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.textColor} ${stat.bgLight} px-2 py-0.5 rounded-full`}>
                  <TrendingUp className="w-3 h-3" />
                  Live
                </div>
              </div>
              <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-2xl font-extrabold text-heading">{stat.value}</p>
              <p className="text-xs text-body mt-1">{stat.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions + Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-card border border-theme rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="w-full text-left flex items-center gap-4 p-3.5 bg-alt hover:bg-alt border border-theme-light rounded-xl transition-all group"
                >
                  <div className={`p-2.5 rounded-xl ${action.color}`}>
                    <action.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-heading text-sm">{action.label}</div>
                    <div className="text-xs text-body">{action.description}</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-[#2a8c78] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Recent Members */}
          <div className="bg-card border border-theme rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-heading mb-4 uppercase tracking-wider">Recent Members</h3>
            <div className="space-y-2">
              {isLoading ? (
                <p className="text-sm text-muted py-4 text-center">Loading...</p>
              ) : (
                <>
                  {recentStudents.slice(0, 3).map((student, index) => (
                    <div key={`s-${index}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-alt transition-colors">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-heading font-medium truncate">{student.name}</div>
                        <div className="text-xs text-muted">{student.rollNo} · Student</div>
                      </div>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Student</span>
                    </div>
                  ))}
                  {recentFaculty.slice(0, 2).map((member, index) => (
                    <div key={`f-${index}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-alt transition-colors">
                      <div className="w-2 h-2 bg-[#2a8c78] rounded-full flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-heading font-medium truncate">{member.name}</div>
                        <div className="text-xs text-muted">{member.empId} · Faculty</div>
                      </div>
                      <span className="text-[10px] bg-[#f0f7f5] text-[#1a6b5c] px-2 py-0.5 rounded-full font-semibold flex-shrink-0">Faculty</span>
                    </div>
                  ))}
                  {recentStudents.length === 0 && recentFaculty.length === 0 && (
                    <p className="text-sm text-muted py-4 text-center italic">No members yet</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
