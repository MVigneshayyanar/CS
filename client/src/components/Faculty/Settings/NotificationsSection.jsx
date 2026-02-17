import React from 'react';
import { Bell, Save } from './SettingsIcons';

const NotificationsSection = ({ preferences, setPreferences, loading, handlePreferenceUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Notification Preferences</h3>
        <p className="text-neutral-400 text-sm mb-6">Choose how you want to receive notifications</p>

        <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50 backdrop-blur-sm">
          <h4 className="text-sm font-medium text-white mb-4 flex items-center">
            <Bell />
            <span className="ml-2">Notification Settings</span>
          </h4>
          <div className="space-y-4">
            {[
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
              { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser and mobile notifications' },
              { key: 'assignmentReminders', label: 'Assignment Reminders', desc: 'Reminders for assignment deadlines' },
              { key: 'gradeNotifications', label: 'Grade Notifications', desc: 'When students submit assignments' },
              { key: 'classReminders', label: 'Class Reminders', desc: 'Upcoming class notifications' },
              { key: 'systemUpdates', label: 'System Updates', desc: 'Platform updates and maintenance alerts' }
            ].map((option) => (
              <div key={option.key} className="flex items-start justify-between p-3 bg-neutral-900/50 rounded-lg">
                <div>
                  <h5 className="text-sm font-medium text-white">{option.label}</h5>
                  <p className="text-xs text-neutral-400 mt-1">{option.desc}</p>
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.notifications[option.key]}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      notifications: {
                        ...preferences.notifications,
                        [option.key]: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-emerald-600 bg-neutral-700 border-neutral-600 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePreferenceUpdate}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 transition-all duration-300"
        >
          <Save />
          <span className="ml-2">{loading ? 'Saving...' : 'Save Notification Preferences'}</span>
        </button>
      </div>
    </div>
  );
};

export default NotificationsSection;
