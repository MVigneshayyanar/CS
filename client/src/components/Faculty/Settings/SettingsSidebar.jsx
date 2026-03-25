import React from 'react';
import { User, Lock, Palette, ChevronRight } from './SettingsIcons';

const SettingsSidebar = ({ activeSection, setActiveSection }) => {
  const settingsNavigation = [
    { id: 'profile', label: 'Faculty Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'appearance', label: 'Display Settings', icon: Palette }
  ];

  return (
    <div className="lg:w-1/4">
      <nav className="bg-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-800/50 sticky top-28">
        <ul className="space-y-2">
          {settingsNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon />
                    <span className="font-medium ml-3">{item.label}</span>
                  </div>
                  <ChevronRight />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default SettingsSidebar;
