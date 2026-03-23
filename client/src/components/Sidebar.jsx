import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import brandLogo from "../assets/logo.svg";

// ====== THEME SWITCH ======
const VARIANT = "glow"; // "glow" | "glass" | "soft" | "outline"
const ACCENT = "teal"; // Using teal for student theme

// Small inline icons
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

const IconStats = () => (
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
      d="M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"
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

// ====== Theme tokens per variant ======
const themes = {
  glow: {
    container: "bg-[#151515]",
    border: "border border-white/10",
    itemBase:
      "group relative mx-2 my-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors cursor-pointer min-h-12 overflow-visible",
    itemIdle: "text-gray-400 hover:text-white hover:bg-white/5",
    itemActive: `text-white bg-${ACCENT}-500/15 shadow-[0_0_0_2px_rgba(45,212,191,0.35),0_8px_24px_rgba(45,212,191,0.25)]`,
    iconWrap: `grid h-9 w-9 place-content-center rounded-lg bg-${ACCENT}-500/20 group-hover:bg-${ACCENT}-500/25 flex-shrink-0 relative`,
    pillLeft: `absolute inset-y-0 left-0 w-1 rounded-l-xl bg-${ACCENT}-400`,
    pillLeftCollapsed: `absolute top-1/2 -translate-y-1/2 left-0 w-1 h-9 rounded-l-xl bg-${ACCENT}-400`,
    logoutButton: "text-red-400 hover:text-red-300 hover:bg-red-10/10",
    logoutIconWrap:
      "grid h-9 w-9 place-content-center rounded-lg bg-red-500/20 group-hover:bg-red-500/25 flex-shrink-100 relative",
  },
};

export default function Sidebar() {
  const { isCollapsed: collapsed, toggleSidebar: toggleCollapsed } = useSidebar();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const t = themes[VARIANT];
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
        className="md:hidden fixed left-3 top-3 z-50 rounded-md border border-white/10 bg-[#1b1b1b] p-2"
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
          "w-64 transform transition-[width,transform] duration-500 ease-in-out",
          "overflow-hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          widthDesktop,
        ].join(" ")}
        aria-label="Student Navigation"
        aria-expanded={!collapsed}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-3 md:px-4">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2 rounded-md focus:outline-none"
          >
            <img
              src={brandLogo}
              alt="Code Sphere"
              className={`h-9 object-contain transition-all duration-500 ease-in-out ${
                collapsed ? "md:w-10" : "w-36"
              }`}
            />
          </NavLink>

          <button
            onClick={toggleCollapsed}
            className="hidden md:grid h-8 w-8 place-content-center rounded-full hover:bg-white/10 transition-colors duration-200"
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

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden grid h-8 w-8 place-content-center rounded-full hover:bg-white/10"
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
                    {isActive && t.pillLeft !== "hidden" && (
                      <span
                        className={`${
                          collapsed ? t.pillLeftCollapsed : t.pillLeft
                        } transition-all duration-500`}
                      />
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
                    {collapsed && (
                      <span
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-3
                                   whitespace-nowrap rounded-md bg-[#111] px-3 py-1.5 text-xs text-white
                                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                                   border border-white/10 shadow-xl z-[60]"
                      >
                        {label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="border-t border-white/10">
          <button
            onClick={handleLogout}
            className={[t.itemBase, t.logoutButton].join(" ")}
          >
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
            {collapsed && (
              <span
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3
                           whitespace-nowrap rounded-md bg-[#111] px-3 py-1.5 text-xs text-white
                           opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
                           border border-white/10 shadow-xl z-[60]"
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
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
