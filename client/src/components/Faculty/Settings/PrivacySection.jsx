import React from 'react';
import { Users, Globe, Save } from './SettingsIcons';

const PrivacySection = ({ preferences, setPreferences, loading, handlePreferenceUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Privacy & Security</h3>
        <p className="text-neutral-400 text-sm mb-6">Manage your privacy settings and profile visibility</p>

        <div className="space-y-6">
          <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-white mb-4 flex items-center">
              <Users />
              <span className="ml-2">Profile Visibility</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">Who can see your profile?</label>
                <select
                  value={preferences.privacy.profileVisibility}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    privacy: {
                      ...preferences.privacy,
                      profileVisibility: e.target.value
                    }
                  })}
                  className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="public">Everyone</option>
                  <option value="students">My Students Only</option>
                  <option value="faculty">Faculty Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-white mb-4 flex items-center">
              <Globe />
              <span className="ml-2">Contact Information Visibility</span>
            </h4>
            <div className="space-y-3">
              {[
                { key: 'showEmail', label: 'Show Email Address' },
                { key: 'showPhone', label: 'Show Phone Number' },
                { key: 'showOfficeHours', label: 'Show Office Hours' }
              ].map((option) => (
                <label key={option.key} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-300">{option.label}</span>
                  <input
                    type="checkbox"
                    checked={preferences.privacy[option.key]}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      privacy: {
                        ...preferences.privacy,
                        [option.key]: e.target.checked
                      }
                    })}
                    className="w-4 h-4 text-emerald-600 bg-neutral-700 border-neutral-600 rounded focus:ring-emerald-500 focus:ring-2"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handlePreferenceUpdate}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 transition-all duration-300"
        >
          <Save />
          <span className="ml-2">{loading ? 'Saving...' : 'Save Privacy Settings'}</span>
        </button>
      </div>
    </div>
  );
};

export default PrivacySection;
