import React from 'react';
import { useSidebar } from '../../context/SidebarContext';
import {
  Users, 
  UserCheck, 
  FlaskConical, 
  ChevronLeft, 
  Building2,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const AdminSidebar = ({ onLogout }) => {
  const { isCollapsed, toggleSidebar: setIsCollapsed } = useSidebar();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      title: 'Student Management',
      icon: Users,
      path: '/students'
    },
    {
      title: 'Faculty Management',
      icon: UserCheck,
      path: '/faculty'
    },
    {
      title: 'Lab Management',
      icon: FlaskConical,
      path: '/labs'
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
    <aside
      className={[
        "fixed top-4 bottom-4 left-4 z-40 flex flex-col",
        "bg-[#18181b] text-white",
        "rounded-[2.5rem] transition-[width,transform] duration-500 ease-in-out",
        "shadow-2xl overflow-hidden",
        isCollapsed ? "md:w-20" : "md:w-64",
      ].join(" ")}
      aria-label="Admin Navigation"
      aria-expanded={!isCollapsed}
    >
      {/* Header */}
      <div className={`relative flex h-24 items-center ${isCollapsed ? 'justify-center mx-auto' : 'justify-between px-6'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center mx-auto' : 'gap-3'}`}>
          <div className="rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center p-0.5 transform transition-all duration-300 h-10 w-10">
            <div className="h-full w-full rounded-full bg-[#18181b] flex items-center justify-center overflow-hidden">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-left-2 duration-500">
              Admin Panel
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar">
        <nav className="space-y-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/students' || item.path === '/faculty' || item.path === '/labs'}
              className={({ isActive }) => [
                "group relative flex items-center rounded-3xl py-3.5 text-sm font-medium transition-all duration-300",
                isCollapsed ? "justify-center px-0" : "px-4 gap-4",
                isActive
                  ? "bg-[#0d9488] text-white shadow-lg shadow-teal-500/25"
                  : "text-white/60 hover:text-white hover:bg-white/5",
              ].join(" ")}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`} />
                  {!isCollapsed && (
                    <span className="whitespace-nowrap transition-all duration-500">
                      {item.title}
                    </span>
                  )}
                  {isCollapsed && (
                    <span
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-4
                                 whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-xs text-white
                                 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none
                                 shadow-xl z-[60]"
                    >
                      {item.title}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>


      {/* Theme and Logout at Bottom */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-2 relative" style={{paddingBottom: !isCollapsed ? '56px' : undefined}}>
        <ThemeToggle collapsed={isCollapsed} />
        
        <button
          onClick={onLogout}
          className={`group relative w-full flex items-center rounded-3xl py-3 text-sm font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10 ${isCollapsed ? 'justify-center px-0' : 'px-4 gap-4'}`}
        >
          <LogOut className="w-5 h-5 text-neutral-500 group-hover:text-red-300" />
          {!isCollapsed && (
            <span className="whitespace-nowrap transition-all duration-500">
              Logout
            </span>
          )}
          {isCollapsed && (
            <span
              className="absolute left-full top-1/2 -translate-y-1/2 ml-4
                         whitespace-nowrap rounded-xl bg-red-900 px-4 py-2 text-xs text-white
                         opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none
                         shadow-xl z-[60]"
            >
              Logout
            </span>
          )}
        </button>
        {/* Shrink button absolutely at bottom center when expanded, below logout */}
        <div className={`w-full ${isCollapsed ? 'flex justify-center' : ''}`} style={{ position: !isCollapsed ? 'absolute' : 'static', left: 0, right: 0, bottom: 16, display: !isCollapsed ? 'flex' : undefined, justifyContent: !isCollapsed ? 'center' : undefined, pointerEvents: 'auto' }}>
          <button
            onClick={setIsCollapsed}
            className={`grid h-8 w-8 place-content-center rounded-full hover:bg-white/20 transition-all duration-300 bg-white/5 ${isCollapsed ? 'shadow-lg border border-white/10 self-center' : ''}`}
            style={!isCollapsed ? { zIndex: 10 } : {}}
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 text-white transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
