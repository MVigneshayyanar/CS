import React, { useState } from 'react';
import SettingsSidebar from '../../components/Faculty/Settings/SettingsSidebar';
import FacultyProfileSection from '../../components/Faculty/Settings/FacultyProfileSection';
import PasswordSection from '../../components/Faculty/Settings/PasswordSection';
import TeachingSection from '../../components/Faculty/Settings/TeachingSection';
import NotificationsSection from '../../components/Faculty/Settings/NotificationsSection';
import AppearanceSection from '../../components/Faculty/Settings/AppearanceSection';
import PrivacySection from '../../components/Faculty/Settings/PrivacySection';
import MessageAlert from '../../components/Faculty/Settings/MessageAlert';
import { SettingsIcon } from '../../components/Faculty/Settings/SettingsIcons';

const FacultySettings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    theme: 'dark',
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      assignmentReminders: true,
      gradeNotifications: true,
      classReminders: true,
      systemUpdates: false
    },
    teaching: {
      preferredLanguages: {
        'C': true,
        'C++': true,
        'Java': true,
        'Python': true,
        'SQL': true,
        'JavaScript': false,
        'R': false
      },
      gradingSystem: 'percentage',
      autoGrading: true,
      deadlineReminders: true,
      allowLateSubmissions: true,
      showSolutions: true
    },
    privacy: {
      showEmail: false,
      showPhone: false,
      showOfficeHours: true,
      profileVisibility: 'students'
    }
  });

  React.useEffect(() => {
    try {
      const userId = sessionStorage.getItem('userId') || 'default';
      const storageKey = `faculty_preferences_${userId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setPreferences((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (error) {
      console.error('Error loading faculty preferences:', error);
    }
  }, []);

  const handlePreferenceUpdate = async () => {
    setLoading(true);
    try {
      const userId = sessionStorage.getItem('userId') || 'default';
      const storageKey = `faculty_preferences_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(preferences));
      setMessage({ type: 'success', text: 'Your preferences have been saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save preferences. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    const commonProps = {
      loading,
      setLoading,
      message,
      setMessage,
      preferences,
      setPreferences,
      handlePreferenceUpdate
    };

    switch(activeSection) {
      case 'profile': return <FacultyProfileSection {...commonProps} />;
      case 'password': return <PasswordSection passwordData={passwordData} setPasswordData={setPasswordData} {...commonProps} />;
      case 'teaching': return <TeachingSection {...commonProps} />;
      case 'notifications': return <NotificationsSection {...commonProps} />;
      case 'appearance': return <AppearanceSection {...commonProps} />;
      case 'privacy': return <PrivacySection {...commonProps} />;
      default: return <FacultyProfileSection {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 pt-15 pb-12">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              FACULTY SETTINGS
            </h1>
          </div>
          <p className="text-neutral-400 text-lg">Manage your faculty profile and account preferences</p>
        </div>

        <MessageAlert message={message} />

        {/* Settings Content */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <SettingsSidebar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
            />
            
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

export default FacultySettings;
