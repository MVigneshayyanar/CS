import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
  Hash,
  Sun,
  Moon
} from 'lucide-react';
import { changePassword } from '@/services/authService';

const Settings = () => {
  const { theme: globalTheme, setTheme: setGlobalTheme } = useTheme();
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
  const authToken = sessionStorage.getItem('authToken');

  useEffect(() => {
    fetchUserPreferences();
  }, [userId]);

  const fetchUserPreferences = async () => {
    try {
      const storageKey = `student_preferences_${userId || 'default'}`;
      const savedPreferences = localStorage.getItem(storageKey);
      if (savedPreferences) {
        const parsed = JSON.parse(savedPreferences);
        setPreferences(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!authToken) {
      setMessage({ type: 'error', text: 'Session expired. Please login again.' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters long' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        token: authToken,
      });

      setMessage({ type: 'success', text: response?.message || 'Your password has been updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to change password. Please check your current password.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceUpdate = async () => {
    setLoading(true);
    try {
      const storageKey = `student_preferences_${userId || 'default'}`;
      localStorage.setItem(storageKey, JSON.stringify(preferences));
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
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-extrabold text-slate-800 mb-1">My Academic Profile</h3>
        <p className="text-slate-400 text-xs mb-5">
          Your academic information is managed by the university administration and cannot be modified here.
        </p>
        
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center mr-2">
                <User className="w-3.5 h-3.5 text-teal-600" />
              </div>
              Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                  {academicData.name}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Student ID</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium flex items-center">
                  <Hash className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  {academicData.studentId}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Roll Number</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                  {academicData.rollNumber}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  {academicData.email}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center mr-2">
                <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
              </div>
              Academic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Department</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                  {academicData.department}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Program</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                  {academicData.program}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Current Semester</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                  {academicData.semester}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Year of Study</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                  {academicData.yearOfStudy}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Batch</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                  {academicData.batch}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Section</label>
                <div className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-medium">
                  Section {academicData.section}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4">
            <p className="text-amber-700 text-xs flex items-start font-medium">
              <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-amber-500" />
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
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-extrabold text-slate-800 mb-1">Change My Password</h3>
        <p className="text-slate-400 text-xs mb-5">Update your account password for security</p>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-300 pr-10 transition-all"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-300 pr-10 transition-all"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-300 pr-10 transition-all"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 focus:ring-2 focus:ring-teal-200 disabled:opacity-50 transition-all duration-300 shadow-sm shadow-teal-200"
          >
            <Lock className="w-3.5 h-3.5 mr-2" />
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-extrabold text-slate-800 mb-1">Display Settings</h3>
        <p className="text-slate-400 text-xs mb-5">Customize how the application looks and feels</p>

        <div className="space-y-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-wider">Theme Preference</label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={globalTheme === 'dark'}
                  onChange={(e) => {
                    setPreferences({...preferences, theme: e.target.value});
                    setGlobalTheme(e.target.value);
                  }}
                  className="sr-only peer"
                />
                <div className="flex items-center justify-center gap-2 p-3 bg-white border-2 border-slate-200 rounded-xl text-slate-500 text-sm font-semibold peer-checked:border-teal-500 peer-checked:bg-teal-50 peer-checked:text-teal-700 transition-all duration-300">
                  <Moon className="w-4 h-4" />
                  Dark Mode
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={globalTheme === 'light'}
                  onChange={(e) => {
                    setPreferences({...preferences, theme: e.target.value});
                    setGlobalTheme(e.target.value);
                  }}
                  className="sr-only peer"
                />
                <div className="flex items-center justify-center gap-2 p-3 bg-white border-2 border-slate-200 rounded-xl text-slate-500 text-sm font-semibold peer-checked:border-teal-500 peer-checked:bg-teal-50 peer-checked:text-teal-700 transition-all duration-300">
                  <Sun className="w-4 h-4" />
                  Light Mode
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLearningSection = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-extrabold text-slate-800 mb-1">Learning Preferences</h3>
        <p className="text-slate-400 text-xs mb-5">Customize your learning experience and code editor</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center">
              <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center mr-2">
                <Code className="w-3 h-3 text-teal-600" />
              </div>
              My Programming Languages
            </h4>
            <div className="space-y-2.5">
              {Object.entries(preferences.learning.preferredLanguages).map(([lang, checked]) => (
                <label key={lang} className="flex items-center gap-3 cursor-pointer group">
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
                    className="w-4 h-4 text-teal-600 bg-white border-slate-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800">{lang}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center">
              <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center mr-2">
                <Monitor className="w-3 h-3 text-teal-600" />
              </div>
              Code Editor Settings
            </h4>
            <div className="space-y-2.5">
              {Object.entries(preferences.learning.codeEditorSettings).map(([setting, checked]) => (
                <label key={setting} className="flex items-center gap-3 cursor-pointer group">
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
                    className="w-4 h-4 text-teal-600 bg-white border-slate-300 rounded focus:ring-teal-500 focus:ring-2"
                  />
                  <span className="text-sm text-slate-600 font-medium capitalize group-hover:text-slate-800">
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
          className="mt-5 flex items-center px-5 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 focus:ring-2 focus:ring-teal-200 disabled:opacity-50 transition-all duration-300 shadow-sm shadow-teal-200"
        >
          <Save className="w-3.5 h-3.5 mr-2" />
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
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-200">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
                MY ACCOUNT
              </h1>
              <p className="text-xs text-slate-400">View your academic profile and manage account preferences</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-2xl text-sm font-medium ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Settings Content */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <nav className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm sticky top-8">
              <ul className="space-y-1">
                {settingsNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-xl transition-all duration-200 ${
                          activeSection === item.id
                            ? 'bg-teal-50 text-teal-700 shadow-sm shadow-teal-100/50'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                            activeSection === item.id ? 'bg-teal-100' : 'bg-slate-100'
                          }`}>
                            <Icon className={`w-4 h-4 ${activeSection === item.id ? 'text-teal-600' : 'text-slate-400'}`} />
                          </div>
                          <span className="font-semibold text-sm">{item.label}</span>
                        </div>
                        <ChevronRight className={`w-3.5 h-3.5 ${activeSection === item.id ? 'text-teal-500' : 'text-slate-300'}`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              {renderContent()}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
