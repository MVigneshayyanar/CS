import { NavLink, useLocation } from "react-router-dom";

import { useTheme } from "next-themes";
import iconJpeg from "../../assets/icon.jpeg";
import logoLight from "../../assets/logo.png";
import logoDark from "../../assets/logow.png";
import { useEffect, useState } from "react";
import { useSidebar } from "../../context/SidebarContext";

const IconDash = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const IconLabs = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const IconSettings = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const IconLogout = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: IconDash },
  { to: "/labs", label: "Labs", Icon: IconLabs },
  { to: "/settings", label: "Settings", Icon: IconSettings },
];

import ThemeToggle from "../ThemeToggle";
import LogoutConfirmation from "../LogoutConfirmation";

export default function FacultySidebar({ onLogout }) {
  const { isCollapsed: collapsed, toggleSidebar: toggleCollapsed } = useSidebar();
  const { resolvedTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <>
      <>
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed left-3 top-3 z-50 rounded-xl p-2 shadow-sm"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" style={{ color: 'var(--text-body)' }} fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      <aside
        className={[
          "fixed top-4 bottom-4 left-4 z-40 flex flex-col",
          "text-white",
          "rounded-[2.5rem] transition-[width,transform] duration-500 ease-in-out",
          "shadow-2xl overflow-hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+20px)]",
          "md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-64",
        ].join(" ")}
        style={{ background: 'var(--sidebar-bg)' }}
        aria-label="Faculty Navigation"
        aria-expanded={!collapsed}
      >
        <div className={`relative flex h-24 items-center ${collapsed ? "justify-center" : "justify-center w-full"}`}>
          <NavLink
            to="/dashboard"
            className={`flex items-center rounded-md focus:outline-none ${collapsed ? 'justify-center mx-auto' : 'gap-3'}`}
          >
            {collapsed ? (
              <div 
                className={`rounded-full flex items-center justify-center p-0.5 transform transition-all duration-300 h-10 w-10 sm:h-12 sm:w-12`}
                style={{ background: 'var(--gradient-logo)' }}
              >
                <div 
                  className="h-full w-full rounded-full flex items-center justify-center overflow-hidden"
                  style={{ background: '#ffffff' }}
                >
                  <img src={iconJpeg} alt="Logo Icon" className="h-full w-full object-contain p-1" />
                </div>
              </div>
            ) : (
              <img 
                src={resolvedTheme === 'light' ? logoLight : logoDark} 
                alt="CodeSphere" 
                className="h-9 w-auto object-contain animate-in fade-in slide-in-from-left-2 duration-500" 
              />
            )}
          </NavLink>
        </div>

        <div className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar">
          <nav className="space-y-4">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center rounded-3xl py-3.5 text-sm font-medium transition-all duration-300",
                    collapsed ? "justify-center px-0" : "px-4 gap-4",
                    isActive
                      ? "text-white shadow-lg"
                      : "hover:bg-white/5",
                  ].join(" ")
                }
                style={({ isActive }) => isActive ? {
                  background: 'var(--sidebar-active)',
                  boxShadow: `0 8px 25px var(--sidebar-active-shadow)`,
                  color: 'var(--sidebar-text-active)',
                } : {
                  color: 'var(--sidebar-text)',
                }}
              >
                <div className="flex-shrink-0">
                  <Icon />
                </div>
                {!collapsed && (
                  <span className="whitespace-nowrap transition-all duration-500">
                    {label}
                  </span>
                )}
                {collapsed && (
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-4
                               whitespace-nowrap rounded-xl px-4 py-2 text-xs text-white
                               opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none
                               shadow-xl z-[60]"
                    style={{ background: 'var(--sidebar-bg)' }}
                  >
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>


        <div className="p-4 flex flex-col gap-2 relative" style={{ borderTop: '1px solid var(--sidebar-border)', paddingBottom: !collapsed ? '56px' : undefined }}>
          <ThemeToggle collapsed={collapsed} />

          <button
            onClick={handleLogout}
            className={`group relative w-full flex items-center rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? 'justify-center px-0' : 'px-4 gap-4'}`}
          >
            <div className="flex-shrink-0">
              <IconLogout />
            </div>
            {!collapsed && (
              <span className="whitespace-nowrap transition-all duration-500">
                Logout
              </span>
            )}
            {collapsed && (
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
          <div className={`w-full ${collapsed ? 'flex justify-center' : ''}`} style={{ position: !collapsed ? 'absolute' : 'static', left: 0, right: 0, bottom: 16, display: !collapsed ? 'flex' : undefined, justifyContent: !collapsed ? 'center' : undefined, pointerEvents: 'auto' }}>
            <button
              onClick={toggleCollapsed}
              className={`grid h-8 w-8 place-content-center rounded-full hover:bg-white/20 transition-all duration-300 bg-white/5 ${collapsed ? 'shadow-lg border border-white/10 self-center' : ''}`}
              style={!collapsed ? { zIndex: 10 } : {}}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 text-white transition-transform duration-500 ${collapsed ? 'rotate-180' : ''}`}
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

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

        <LogoutConfirmation
          isOpen={showLogoutConfirm}
          onConfirm={() => {
            setShowLogoutConfirm(false);
            onLogout();
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      </>
    </>
  );
}
