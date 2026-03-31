import React from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Save } from './SettingsIcons';

const AppearanceSection = ({ preferences, setPreferences, loading, handlePreferenceUpdate }) => {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Display Settings</h3>
        <p className="text-muted text-sm mb-6">Customize how the application looks and feels</p>

        <div className="space-y-4">
          <div className="p-4 bg-alt rounded-lg border border-theme backdrop-blur-sm">
            <label className="block text-sm font-medium text-white mb-3">Theme Preference</label>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === 'dark' || preferences.theme === 'dark'}
                  onChange={(e) => {
                    setPreferences({...preferences, theme: e.target.value});
                    setTheme(e.target.value);
                  }}
                  className="sr-only peer"
                />
                <div className="flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg peer-checked:bg-[#1a6b5c] peer-checked:ring-2 peer-checked:ring-teal-400 transition-all duration-300">
                  <Monitor />
                  <span className="text-white">Dark Mode</span>
                </div>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === 'light' || preferences.theme === 'light'}
                  onChange={(e) => {
                    setPreferences({...preferences, theme: e.target.value});
                    setTheme(e.target.value);
                  }}
                  className="sr-only peer"
                />
                <div className="flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg peer-checked:bg-[#1a6b5c] peer-checked:ring-2 peer-checked:ring-teal-400 transition-all duration-300">
                  <Monitor />
                  <span className="text-white">Light Mode</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handlePreferenceUpdate}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-[#1a6b5c] text-white rounded-lg hover:bg-[#134d42] focus:ring-2 focus:ring-[#2a8c78] focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 transition-all duration-300"
        >
          <Save />
          <span className="ml-2">{loading ? 'Saving...' : 'Save Display Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default AppearanceSection;
