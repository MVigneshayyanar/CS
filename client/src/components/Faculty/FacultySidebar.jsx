import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSidebar } from "../../context/SidebarContext";
import brandLogo from "../../assets/logo.svg";

// ====== THEME SWITCH ======
const VARIANT = "glow"; // "glow" | "glass" | "soft" | "outline"
const ACCENT = "teal"; // Using teal for student theme

// Small inline icons (kept self-contained)
const IconDash = () => (
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
      d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 1-2-2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6H8V5z"
    />
  </svg>
);

const IconLabs = () => (
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
      d="M8 4h8l-1 1v5.172a2 2 0 0 0 .586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 0 0 9 7.172V5L8 4z"
    />
  </svg>
);

const IconSettings = () => (
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
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
    />
  </svg>
);

// Logout icon
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

// Updated navItems - removed statistics
const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: IconDash },
  { to: "/labs", label: "Labs", Icon: IconLabs },
  { to: "/settings", label: "Settings", Icon: IconSettings },
];

// ====== Theme tokens per variant ======
const themes = {
  glow: {
    container: "bg-[#151515]",
    border: "border border-white/10",
    itemBase:
      "group relative mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer min-h-12",
    itemIdle: "text-gray-400 hover:text-white hover:bg-white/5",
    itemActive: `text-white bg-${ACCENT}-500/15 shadow-[0_0_0_2px_rgba(45,212,191,0.35),0_8px_24px_rgba(45,212,191,0.25)]`,
    iconWrap: `grid h-9 w-9 place-content-center rounded-lg bg-${ACCENT}-500/20 group-hover:bg-${ACCENT}-500/25 flex-shrink-0 relative`,
    pillLeft: `absolute inset-y-0 left-0 w-1 rounded-l-xl bg-${ACCENT}-400`,
    pillLeftCollapsed: `absolute top-1/2 -translate-y-1/2 left-0 w-1 h-9 rounded-l-xl bg-${ACCENT}-400`,
    logoutButton: "text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors duration-200",
    logoutIconWrap: "grid h-9 w-9 place-content-center rounded-lg bg-red-500/20 group-hover:bg-red-500/25 flex-shrink-0 relative transition-colors duration-200",
  },
  glass: {
    container: "bg-white/10 backdrop-blur-xl",
    border: "border border-white/20",
    itemBase:
      "group relative mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors min-h-12",
    itemIdle: "text-white/70 hover:text-white hover:bg-white/10",
    itemActive: "text-white bg-white/20 ring-1 ring-white/30",
    iconWrap:
      "grid h-9 w-9 place-content-center rounded-lg bg-white/10 group-hover:bg-white/20 flex-shrink-0 relative",
    pillLeft: "hidden",
    pillLeftCollapsed: "hidden",
    logoutButton: "text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors duration-200",
    logoutIconWrap: "grid h-9 w-9 place-content-center rounded-lg bg-red-500/20 group-hover:bg-red-500/30 flex-shrink-0 relative transition-colors duration-200",
  },
  soft: {
    container: "bg-[#242424]",
    border:
      "shadow-[inset_6px_6px_12px_rgba(0,0,0,0.35),inset_-6px_-6px_12px_rgba(255,255,255,0.05)] rounded-2xl",
    itemBase:
      "group relative mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors min-h-12",
    itemIdle:
      "text-gray-300 hover:text-white hover:bg-[#2a2a2a] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.35),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]",
    itemActive:
      "text-white bg-[#2d2d2d] ring-1 ring-black/20 shadow-[4px_4px_12px_rgba(0,0,0,0.45),-4px_-4px_12px_rgba(255,255,255,0.03)]",
    iconWrap: "grid h-9 w-9 place-content-center rounded-lg bg-[#2a2a2a] flex-shrink-0 relative",
    pillLeft: "hidden",
    pillLeftCollapsed: "hidden",
    logoutButton: "text-red-400 hover:text-red-300 hover:bg-[#2a2a2a] transition-colors duration-200",
    logoutIconWrap: "grid h-9 w-9 place-content-center rounded-lg bg-red-900/30 group-hover:bg-red-900/40 flex-shrink-0 relative transition-colors duration-200",
  },
  outline: {
    container: "bg-[#1f1f1f]",
    border: "border border-white/10",
    itemBase:
      "group relative mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors min-h-12",
    itemIdle:
      "text-gray-400 hover:text-white border border-transparent hover:border-white/10",
    itemActive: "text-white bg-white/5 border border-white/20",
    iconWrap: "grid h-9 w-9 place-content-center rounded-lg bg-white/5 flex-shrink-0 relative",
    pillLeft: `absolute inset-y-0 left-0 w-[3px] rounded-l-xl bg-${ACCENT}-400`,
    pillLeftCollapsed: `absolute top-1/2 -translate-y-1/2 left-0 w-[3px] h-9 rounded-l-xl bg-${ACCENT}-400`,
    logoutButton: "text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/20 transition-colors duration-200",
    logoutIconWrap: "grid h-9 w-9 place-content-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 flex-shrink-0 relative transition-colors duration-200",
  },
};

export default function Sidebar({ onLogout }) {
  const { isCollapsed: collapsed, toggleSidebar: toggleCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  // Get current student info
  const currentUser = sessionStorage.getItem('username') || 'User';
  const userType = sessionStorage.getItem('userType') || 'Student';
  const department = "Computer Science";

  // Logout handler
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const t = themes[VARIANT];

  // Updated width classes - collapsed is now wider (80px instead of 64px)
  const widthDesktop = collapsed ? "md:w-20" : "md:w-64";
  const labelVisibility = collapsed
    ? "md:opacity-0 md:-translate-x-2 md:invisible md:pointer-events-none"
    : "md:opacity-100";
  const chevronRotation = collapsed ? "md:rotate-180" : "";

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed left-3 top-3 z-50 rounded-md border border-white/10 bg-[#1b1b1b] p-2 hover:bg-white/10 transition-colors duration-200"
        aria-label="Open menu"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
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
          "fixed inset-y-0 left-0 z-40 shadow-lg flex flex-col",
          t.container,
          t.border,
          "w-64 transform transition-[width,transform] duration-500 ease-in-out",  // Smooth width transition
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          widthDesktop,
        ].join(" ")}
        aria-label="Student Navigation"
        aria-expanded={!collapsed}
      >
        {/* Header with logo + toggle */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-3 md:px-4">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 rounded-md focus:outline-none"
            aria-label="Code Sphere Home"
          >
            <img
              src={brandLogo}
              alt="Code Sphere"
              className={`h-9 object-contain transition-all duration-500 ease-in-out ${collapsed ? "md:w-10" : "w-36"}`}
            />
          </NavLink>

          <button
            onClick={toggleCollapsed}
            className="hidden md:grid h-8 w-8 place-content-center rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform duration-500 text-white dark:text-white dark:invert-0 light:invert ${collapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Close (mobile) */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden grid h-8 w-8 place-content-center rounded-full hover:bg-white/10 transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Sections */}
        <div className={`px-3 pt-3 text-xs uppercase tracking-wider text-white/40 transition-opacity duration-500 ${collapsed ? "md:opacity-0" : "opacity-100"}`}>
          Faculty Portal
        </div>

        {/* Nav */}
        <div className="flex-1">
          <nav className="py-2">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard"}
                className={({ isActive }) =>
                  [t.itemBase, isActive ? t.itemActive : t.itemIdle].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left rail - positioned differently when collapsed */}
                    {isActive && t.pillLeft !== "hidden" && (
                      <span className={`${collapsed ? t.pillLeftCollapsed : t.pillLeft} transition-all duration-500`} />
                    )}

                    <span className={t.iconWrap}>
                      <Icon />
                    </span>

                    <span
                      className={[
                        "whitespace-nowrap transition-all duration-500 min-w-0",
                        labelVisibility,
                      ].join(" ")}
                    >
                      {label}
                    </span>

                    {/* Tooltip while collapsed */}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 rounded-md bg-[#111] px-2 py-1 text-xs text-white shadow-lg md:ml-3 md:block md:opacity-0 md:transition-opacity md:duration-300 group-hover:md:opacity-100 z-50">
                        {label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom section with logout only */}
        <div className="border-t border-white/10">
          {/* Logout button - fixed hover states */}
          <button
            onClick={handleLogout}
            className={[t.itemBase, t.logoutButton].join(" ")}
          >
            {/* optional left rail for logout */}
            {t.pillLeft !== "hidden" && (
              <span className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}

            <span className={t.logoutIconWrap}>
              <IconLogout />
            </span>

            <span
              className={[
                "whitespace-nowrap transition-all duration-500 min-w-0",
                labelVisibility,
              ].join(" ")}
            >
              Logout
            </span>

            {/* Tooltip while collapsed */}
            {collapsed && (
              <span className="pointer-events-none absolute left-full top-1/2 hidden -translate-y-1/2 rounded-md bg-[#111] px-2 py-1 text-xs text-white shadow-lg md:ml-3 md:block md:opacity-0 md:transition-opacity md:duration-300 group-hover:md:opacity-100 z-50">
                Logout
              </span>
            )}
          </button>

          

        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
