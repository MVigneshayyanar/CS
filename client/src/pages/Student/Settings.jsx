import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Palette, 
  BookOpen,
  Mail,
  Save,
  Eye,
  EyeOff,
  ChevronRight,
  Settings as SettingsIcon,
  GraduationCap,
  Code,
  Monitor,
  Shield,
  Hash
} from 'lucide-react';
import axios from 'axios';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Academic profile data (immutable)
  const [academicData] = useState({
    studentId: 'CS2021001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+91 9876543210',
    department: 'Computer Science',
    semester: '6th Semester',
    batch: '2021-2025',
    section: 'A',
    rollNumber: '21CSE001',
    address: '123 Main Street, City, State - 123456',
    dateOfAdmission: '2021-08-15',
    yearOfStudy: '3rd Year',
    program: 'Bachelor of Technology'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    learning: {
      preferredLanguages: {
        'C': false,
        'C++': false,
        'Java': false,
        'Python': false,
        'SQL': false
      },
      codeEditorSettings: {
        autoSave: true,
        syntaxHighlighting: true,
        lineNumbers: true,
        darkTheme: true
      }
    }
  });

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    fetchUserPreferences();
  }, []);

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/preferences?userId=${userId}`);
      setPreferences(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/change-password?userId=${userId}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Your password has been updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please check your current password.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/preferences?userId=${userId}`, preferences);
      setMessage({ type: 'success', text: 'Your preferences have been saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save preferences. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const settingsNavigation = [
    { id: 'profile', label: 'Academic Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'appearance', label: 'Display Settings', icon: Palette },
    { id: 'learning', label: 'Learning Preferences', icon: BookOpen }
  ];

  const renderAcademicProfileSection = () => (
    <div className="space-y-6 ">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">My Academic Profile</h3>
        <p className="text-neutral-400 text-sm mb-6">
          Your academic information is managed by the university administration and cannot be modified here.
        </p>
        
        <div className="space-y-6">
          <div className="bg-neutral-800/30 rounded-lg p-6 border border-neutral-700/50">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-teal-400" />
              Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Full Name</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {academicData.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Student ID</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300 flex items-center">
                  <Hash className="w-4 h-4 mr-2 text-neutral-500" />
                  {academicData.studentId}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Roll Number</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {academicData.rollNumber}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Email Address</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-neutral-500" />
                  {academicData.email}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-800/30 rounded-lg p-6 border border-neutral-700/50">
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-teal-400" />
              Academic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Department</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {academicData.department}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Program</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {academicData.program}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Current Semester</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {academicData.semester}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Year of Study</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {academicData.yearOfStudy}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Batch</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  {academicData.batch}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Section</label>
                <div className="w-full px-4 py-3 bg-neutral-900/50 border border-neutral-700/50 rounded-lg text-neutral-300">
                  Section {academicData.section}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-900/20 border border-amber-700/30 rounded-lg p-4">
            <p className="text-amber-300 text-sm flex items-start">
              <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Note:</strong> Academic information is maintained by the university administration. 
                To update any of these details, please contact the academic office or your department coordinator.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPasswordSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Change My Password</h3>
        <p className="text-neutral-400 text-sm mb-6">Update your account password for security</p>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10 backdrop-blur-sm"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-white transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10 backdrop-blur-sm"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-neutral-400 mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-10 backdrop-blur-sm"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 transition-all duration-300"
          >
            <Lock className="w-4 h-4 mr-2" />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Display Settings</h3>
        <p className="text-neutral-400 text-sm mb-6">Customize how the application looks and feels</p>

        <div className="space-y-4">
          <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50 backdrop-blur-sm">
            <label className="block text-sm font-medium text-white mb-3">Theme Preference</label>
            <div className="flex space-x-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={preferences.theme === 'dark'}
                  onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  className="sr-only peer"
                />
                <div className="flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg peer-checked:bg-teal-600 peer-checked:ring-2 peer-checked:ring-teal-400 transition-all duration-300">
                  <Monitor className="w-4 h-4 text-white" />
                  <span className="text-white">Dark Mode</span>
                </div>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={preferences.theme === 'light'}
                  onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  className="sr-only peer"
                />
                <div className="flex items-center space-x-3 p-3 bg-neutral-700/50 rounded-lg peer-checked:bg-teal-600 peer-checked:ring-2 peer-checked:ring-teal-400 transition-all duration-300">
                  <Monitor className="w-4 h-4 text-white" />
                  <span className="text-white">Light Mode</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLearningSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Learning Preferences</h3>
        <p className="text-neutral-400 text-sm mb-6">Customize your learning experience and code editor</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center">
              <Code className="w-4 h-4 mr-2" />
              My Programming Languages
            </h4>
            <div className="space-y-2">
              {Object.entries(preferences.learning.preferredLanguages).map(([lang, checked]) => (
                <label key={lang} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      learning: {
                        ...preferences.learning,
                        preferredLanguages: {
                          ...preferences.learning.preferredLanguages,
                          [lang]: e.target.checked
                        }
                      }
                    })}
                    className="w-4 h-4 text-teal-600 bg-neutral-700 border-neutral-600 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-neutral-300">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700/50 backdrop-blur-sm">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center">
              <Monitor className="w-4 h-4 mr-2" />
              Code Editor Settings
            </h4>
            <div className="space-y-2">
              {Object.entries(preferences.learning.codeEditorSettings).map(([setting, checked]) => (
                <label key={setting} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      learning: {
                        ...preferences.learning,
                        codeEditorSettings: {
                          ...preferences.learning.codeEditorSettings,
                          [setting]: e.target.checked
                        }
                      }
                    })}
                    className="w-4 h-4 text-teal-600 bg-neutral-700 border-neutral-600 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-neutral-300 capitalize">
                    {setting.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handlePreferenceUpdate}
          disabled={loading}
          className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 transition-all duration-300"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save My Preferences'}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case 'profile': return renderAcademicProfileSection();
      case 'password': return renderPasswordSection();
      case 'appearance': return renderAppearanceSection();
      case 'learning': return renderLearningSection();
      default: return renderAcademicProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 pt-15 pb-12">

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <SettingsIcon className="w-8 h-8 text-teal-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
              MY ACCOUNT
            </h1>
          </div>
          <p className="text-neutral-400 text-lg">View your academic profile and manage account preferences</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-8 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' :
            'bg-red-900/50 text-red-300 border border-red-700/50'
          } backdrop-blur-sm`}>
            {message.text}
          </div>
        )}

        {/* Settings Content */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Navigation */}
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
                              ? 'bg-teal-600 text-white shadow-lg'
                              : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center">
                            <Icon className="w-5 h-5 mr-3" />
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50">
                {renderContent()}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
