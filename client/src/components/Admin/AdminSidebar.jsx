import React, { useState } from 'react';
import { useSidebar } from '../../context/SidebarContext';
import {
  Users, 
  UserCheck, 
  FlaskConical, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  Shield, 
  Database, 
  Activity
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const { isCollapsed, toggleSidebar: setIsCollapsed } = useSidebar();

  const menuItems = [
    {
      title: 'Student Management',
      icon: Users,
      path: '/students',
      active: location.pathname.startsWith('/students')
    },
    {
      title: 'Faculty Management',
      icon: UserCheck,
      path: '/faculty',
      active: location.pathname.startsWith('/faculty')
    },
    {
      title: 'Lab Management',
      icon: FlaskConical,
      path: '/labs',
      active: location.pathname.startsWith('/labs')
    // },
    // {
    //   title: 'System Analytics',
    //   icon: Activity,
    //   path: '/analytics',
    //   active: location.pathname.startsWith('/analytics')
    // },
    // {
    //   title: 'Data Management',
    //   icon: Database,
    //   path: '/data',
    //   active: location.pathname.startsWith('/data')
    // },
    // {
    //   title: 'System Settings',
    //   icon: Settings,
    //   path: '/settings',
    //   active: location.pathname.startsWith('/settings')
    }
  ];

  return (
    <div className={`bg-gradient-to-b from-neutral-900 to-neutral-950 border-r border-neutral-800 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen relative`}>
      
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-neutral-800 border border-neutral-700 rounded-full p-1 hover:bg-neutral-700 transition-colors"
      >
        <ChevronLeft className={`w-4 h-4 text-neutral-400 transition-transform ${isCollapsed ? 'rotate-180' : ''} dark:invert-0 light:invert`} />
      </button>

      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-white font-bold text-lg">Admin Panel</h2>
              <p className="text-neutral-400 text-xs">System Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg mb-1 transition-all group relative ${
              item.active
                ? 'bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 text-red-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'text-red-400' : 'text-neutral-500 group-hover:text-white'}`} />
            {!isCollapsed && (
              <span className="font-medium">{item.title}</span>
            )}
            
            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 
                             whitespace-nowrap px-3 py-1.5 rounded-md bg-neutral-900 
                             text-white text-xs border border-neutral-700 shadow-xl 
                             opacity-0 group-hover:opacity-100 transition-opacity 
                             pointer-events-none z-50">
                {item.title}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Admin Status */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-300 text-sm font-medium">Admin Access</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
