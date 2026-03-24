import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import brandLogo from "../assets/logo.svg";

// Small inline icons
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

const IconStats = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 00 2 2h2a2 2 0 00 2-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 00 2 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconSettings = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const IconLogout = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-5 w-5 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: IconDash },
  { to: "/labs", label: "Labs", Icon: IconLabs },
  { to: "/statistics", label: "Statistics", Icon: IconStats },
  { to: "/settings", label: "Settings", Icon: IconSettings },
];

export default function Sidebar() {
  const { isCollapsed: collapsed, toggleSidebar: toggleCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const widthDesktop = collapsed ? "md:w-20" : "md:w-64";
  const labelVisibility = collapsed
    ? "md:opacity-0 md:-translate-x-2 md:invisible md:pointer-events-none"
    : "md:opacity-100";

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed left-3 top-3 z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-sm"
        aria-label="Open menu"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-slate-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={[
          "fixed top-4 bottom-4 left-4 z-40 flex flex-col",
          "bg-[#18181b] text-white",
          "rounded-[2.5rem] transition-[width,transform] duration-500 ease-in-out",
          "shadow-2xl overflow-hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-[calc(100%+20px)]",
          "md:translate-x-0",
          collapsed ? "md:w-20" : "md:w-64",
        ].join(" ")}
        aria-label="Student Navigation"
        aria-expanded={!collapsed}
      >
        {/* Header */}
        <div className={`relative flex h-24 items-center ${collapsed ? 'justify-center' : 'justify-between px-6'}`}>
          <NavLink
            to="/dashboard"
            className="flex items-center gap-3 rounded-md focus:outline-none"
          >
            <div className={`rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-indigo-500 flex items-center justify-center p-0.5 transform transition-all duration-300 ${collapsed ? 'h-12 w-12' : 'h-10 w-10'}`}>
              <div className="h-full w-full rounded-full bg-[#18181b] flex items-center justify-center overflow-hidden">
                <img src={brandLogo} alt="Logo" className="h-6 w-6 object-contain" />
              </div>
            </div>
            {!collapsed && (
              <span className="text-xl font-bold tracking-tight text-white animate-in fade-in slide-in-from-left-2 duration-500">
                CodeSphere
              </span>
            )}
          </NavLink>

          <button
            onClick={toggleCollapsed}
            className={`grid h-8 w-8 place-content-center rounded-full hover:bg-white/20 transition-all duration-300 bg-white/5 ${collapsed ? 'absolute -right-1 top-20 shadow-lg border border-white/10' : ''}`}
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

        {/* Nav */}
        <div className="flex-1 px-4 py-2 overflow-y-auto no-scrollbar">
          <nav className="space-y-4">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  [
                    "group relative flex items-center gap-4 rounded-3xl px-4 py-3.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-[#0d9488] text-white shadow-lg shadow-teal-500/25"
                      : "text-white/60 hover:text-white hover:bg-white/5",
                  ].join(" ")
                }
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
                               whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-xs text-white
                               opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none
                               shadow-xl z-[60]"
                  >
                    {label}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="group relative w-full flex items-center gap-4 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200 text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
