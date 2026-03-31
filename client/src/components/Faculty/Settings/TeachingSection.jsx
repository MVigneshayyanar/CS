import React from 'react';
import { Code, Award, Monitor, Save } from './SettingsIcons';

const TeachingSection = ({ preferences, setPreferences, loading, handlePreferenceUpdate }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Teaching Preferences</h3>
        <p className="text-muted text-sm mb-6">Customize your teaching tools and grading preferences</p>

        <div className="space-y-6">
          <div className="bg-alt rounded-lg p-6 border border-theme backdrop-blur-sm">
            <h4 className="text-sm font-medium text-white mb-4 flex items-center">
              <Code />
              <span className="ml-2">Programming Languages I Teach</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(preferences.teaching.preferredLanguages).map(([lang, checked]) => (
                <label key={lang} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      teaching: {
                        ...preferences.teaching,
                        preferredLanguages: {
                          ...preferences.teaching.preferredLanguages,
                          [lang]: e.target.checked
                        }
                      }
                    })}
                    className="w-4 h-4 text-[#1a6b5c] bg-neutral-700 border-neutral-600 rounded focus:ring-[#2a8c78] focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-muted">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-alt rounded-lg p-6 border border-theme backdrop-blur-sm">
              <h4 className="text-sm font-medium text-white mb-4 flex items-center">
                <Award />
                <span className="ml-2">Grading System</span>
              </h4>
              <div className="space-y-3">
                {[
                  { value: 'percentage', label: 'Percentage (0-100%)' },
                  { value: 'gpa', label: 'GPA Scale (0-4.0)' },
                  { value: 'letter', label: 'Letter Grades (A-F)' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="gradingSystem"
                      value={option.value}
                      checked={preferences.teaching.gradingSystem === option.value}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        teaching: {
                          ...preferences.teaching,
                          gradingSystem: e.target.value
                        }
                      })}
                      className="w-4 h-4 text-[#1a6b5c] bg-neutral-700 border-neutral-600 focus:ring-[#2a8c78] focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-muted">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-alt rounded-lg p-6 border border-theme backdrop-blur-sm">
              <h4 className="text-sm font-medium text-white mb-4 flex items-center">
                <Monitor />
                <span className="ml-2">Teaching Options</span>
              </h4>
              <div className="space-y-3">
                {[
                  { key: 'autoGrading', label: 'Enable Auto-Grading' },
                  { key: 'deadlineReminders', label: 'Send Deadline Reminders' },
                  { key: 'allowLateSubmissions', label: 'Allow Late Submissions' },
                  { key: 'showSolutions', label: 'Show Solutions After Deadline' }
                ].map((option) => (
                  <label key={option.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.teaching[option.key]}
                      onChange={(e) => setPreferences({
                        ...preferences,
                        teaching: {
                          ...preferences.teaching,
                          [option.key]: e.target.checked
                        }
                      })}
                      className="w-4 h-4 text-[#1a6b5c] bg-neutral-700 border-neutral-600 rounded focus:ring-[#2a8c78] focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-muted">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handlePreferenceUpdate}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-[#1a6b5c] text-white rounded-lg hover:bg-[#134d42] focus:ring-2 focus:ring-[#2a8c78] focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 transition-all duration-300"
        >
          <Save />
          <span className="ml-2">{loading ? 'Saving...' : 'Save Teaching Preferences'}</span>
        </button>
      </div>
    </div>
  );
};

export default TeachingSection;
