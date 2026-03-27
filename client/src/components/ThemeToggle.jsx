import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ collapsed }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`flex items-center rounded-3xl bg-white/5 border border-white/10 transition-all duration-300 ${collapsed ? 'w-12 h-12 justify-center mx-auto' : 'w-full px-4 py-3 gap-3 p-1'}`}>
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-4 w-full'}`}>
        <div className="flex-shrink-0 relative w-6 h-6 flex items-center justify-center">
            <Sun className={`absolute h-5 w-5 transition-all duration-500 text-amber-400 ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
            <Moon className={`absolute h-5 w-5 transition-all duration-500 text-indigo-400 ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
        </div>
        
        {!collapsed && (
          <span className="flex-1 text-sm font-semibold text-white/80 whitespace-nowrap">
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </span>
        )}

        {!collapsed && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`relative w-10 h-5 rounded-full transition-all duration-300 focus:outline-none ${theme === 'dark' ? 'bg-teal-500' : 'bg-slate-500'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${theme === 'dark' ? 'left-5.5 right-0.5 ml-auto mr-0.5' : 'left-0.5'}`} 
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
