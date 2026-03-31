import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ collapsed }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div 
      className={`flex items-center rounded-3xl transition-all duration-300 ${collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 py-3 gap-3 p-1'}`}
      style={{ 
        background: 'var(--toggle-bg)', 
        border: '1.5px solid var(--toggle-border)' 
      }}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4 w-full'}`}>
        <div className="flex-shrink-0 relative w-6 h-6 flex items-center justify-center">
            <Sun className={`absolute h-5 w-5 transition-all duration-500 ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} style={{ color: 'var(--accent)' }} />
            <Moon className={`absolute h-5 w-5 transition-all duration-500 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} style={{ color: 'var(--teal-light)' }} />
        </div>
        
        {!collapsed && (
          <span className="flex-1 text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--sidebar-text)' }}>
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        )}

        {!collapsed && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="relative w-10 h-5 rounded-full transition-all duration-300 focus:outline-none"
            style={{ background: 'var(--toggle-active-bg)' }}
          >
            <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300" 
                 style={{ left: theme === 'dark' ? 'calc(100% - 1.125rem)' : '0.125rem' }}
            />
          </button>
        )}

        {collapsed && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Toggle Theme"
          />
        )}
      </div>
    </div>
  );
};

export default ThemeToggle;
