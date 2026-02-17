import React from 'react';
import { Users, UserCheck, FlaskConical, Activity, TrendingUp, Shield } from 'lucide-react';
import StudentManagement from '../../components/Admin/StudentManagement';
import FacultyManagement from '../../components/Admin/FacultyManagement';
import LabManagement from '../../components/Admin/LabManagement';
import AdminSidebar from '../../components/Admin/AdminSidebar';

const AdminDashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Faculty Members',
      value: '89',
      change: '+3%',
      trend: 'up',
      icon: UserCheck,
      color: 'from-green-600 to-green-700'
    },
    {
      title: 'Active Labs',
      value: '45',
      change: '+8%',
      trend: 'up',
      icon: FlaskConical,
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'System Health',
      value: '98.5%',
      change: '+0.2%',
      trend: 'up',
      icon: Activity,
      color: 'from-red-600 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-red-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-neutral-400 text-lg">System overview and management controls</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-neutral-400">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-neutral-700/50 hover:bg-neutral-600/50 rounded-lg transition-colors">
                <div className="font-medium text-white">Add New Student</div>
                <div className="text-sm text-neutral-400">Register a new student in the system</div>
              </button>
              <button className="w-full text-left p-3 bg-neutral-700/50 hover:bg-neutral-600/50 rounded-lg transition-colors">
                <div className="font-medium text-white">Create Lab</div>
                <div className="text-sm text-neutral-400">Set up a new programming lab</div>
              </button>
              <button className="w-full text-left p-3 bg-neutral-700/50 hover:bg-neutral-600/50 rounded-lg transition-colors">
                <div className="font-medium text-white">System Backup</div>
                <div className="text-sm text-neutral-400">Create a full system backup</div>
              </button>
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-white">New student registered: John Doe</div>
                  <div className="text-xs text-neutral-400">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-white">Lab "Python Basics" created</div>
                  <div className="text-xs text-neutral-400">15 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-white">System maintenance completed</div>
                  <div className="text-xs text-neutral-400">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
