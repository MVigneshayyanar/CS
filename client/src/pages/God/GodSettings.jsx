import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Lock,
  Monitor,
  Clock3,
  LogOut,
  Palette,
  ChevronRight,
  Save,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
} from 'lucide-react';
import { changePassword, logoutUser } from '@/services/authService';
import { addGod, deleteGodUser, fetchGodUsers } from '@/services/godService';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

const Field = ({ label, value }) => (
  <div>
    <label className="block text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 text-xs font-semibold">
      {value}
    </div>
  </div>
);

const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-teal-600" />
      </div>
      <h3 className="text-sm font-extrabold text-slate-800">{title}</h3>
    </div>
    {children}
  </div>
);

const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-b-0">
    <div>
      <p className="text-xs font-bold text-slate-700">{label}</p>
      <p className="text-[11px] text-slate-400">{description}</p>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-all duration-200 ${checked ? 'bg-teal-500' : 'bg-slate-200'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? 'left-4' : 'left-0.5'}`}
      />
    </button>
  </div>
);

const PwField = ({ label, show, onToggle, value, onChange, placeholder, hint }) => (
  <div>
    <label className="block text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-3 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      </button>
    </div>
    {hint && <p className="text-[10px] text-slate-400 mt-1 font-medium">{hint}</p>}
  </div>
);

const GodSettings = () => {
  const [activeSection, setActiveSection] = useState('password');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [creatingGod, setCreatingGod] = useState(false);
  const [loadingGodUsers, setLoadingGodUsers] = useState(false);
  const [deletingGodUserId, setDeletingGodUserId] = useState('');
  const [pendingDeleteGodUser, setPendingDeleteGodUser] = useState(null);
  const [godCredentials, setGodCredentials] = useState(null);
  const [godForm, setGodForm] = useState({ username: '', email: '' });
  const [godUsers, setGodUsers] = useState([]);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [preferences, setPreferences] = useState({
    securityAlerts: true,
    requireActionConfirmation: true,
    twoFactorAuthentication: true,
  });

  const adminName =
    sessionStorage.getItem('username') ||
    sessionStorage.getItem('userName') ||
    'God User';
  const adminEmail =
    sessionStorage.getItem('userEmail') ||
    sessionStorage.getItem('email') ||
    'Not available';
  const [sessionInfo] = useState(() => ({
    device: navigator?.platform || 'Unknown Device',
    browser: navigator?.userAgent?.includes('Chrome')
      ? 'Chrome'
      : navigator?.userAgent?.includes('Firefox')
        ? 'Firefox'
        : 'Browser',
    startedAt: new Date().toLocaleString(),
  }));

  useEffect(() => {
    try {
      const saved = localStorage.getItem('god_settings_preferences');
      if (saved) {
        setPreferences((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch (error) {
      console.error('Failed to load god settings', error);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      localStorage.setItem('god_settings_preferences', JSON.stringify(preferences));
      setMessage({ type: 'success', text: 'Settings saved successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please retry.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }

    setLoadingPassword(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage({ type: 'success', text: res?.message || 'Password updated successfully.' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPw({ current: false, new: false, confirm: false });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to change password.',
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleSignOutAllSessions = async () => {
    const confirmed = window.confirm('Sign out from all sessions? You will need to login again.');
    if (!confirmed) return;

    try {
      await logoutUser();
    } catch (_error) {
      // Continue local cleanup even if remote logout fails.
    }

    sessionStorage.clear();
    window.location.href = '/';
  };

  const handleAddGod = async (e) => {
    e.preventDefault();

    if (!godForm.username || !godForm.email) {
      setMessage({ type: 'error', text: 'Username and email are required.' });
      return;
    }

    setCreatingGod(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await addGod({
        username: godForm.username,
        email: godForm.email,
      });

      setGodCredentials(res?.data?.credentials || null);
      setGodForm({ username: '', email: '' });
      await loadGodUsers();
      setMessage({ type: 'success', text: res?.message || 'God account created successfully.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to create God account.',
      });
    } finally {
      setCreatingGod(false);
    }
  };

  const loadGodUsers = async () => {
    setLoadingGodUsers(true);
    try {
      const res = await fetchGodUsers();
      setGodUsers(res?.data?.users || []);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to load God accounts.',
      });
    } finally {
      setLoadingGodUsers(false);
    }
  };

  const handleDeleteGod = async (userId) => {
    setDeletingGodUserId(userId);
    setMessage({ type: '', text: '' });
    try {
      const res = await deleteGodUser(userId);
      setGodUsers((prev) => prev.filter((u) => u.id !== userId));
      setMessage({ type: 'success', text: res?.message || 'God account deleted successfully.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Failed to delete God account.',
      });
    } finally {
      setDeletingGodUserId('');
    }
  };

  const requestDeleteGod = (user) => {
    setPendingDeleteGodUser(user);
  };

  const confirmDeleteGod = async () => {
    if (!pendingDeleteGodUser) return;
    await handleDeleteGod(pendingDeleteGodUser.id);
    setPendingDeleteGodUser(null);
  };

  useEffect(() => {
    if (activeSection === 'add-god') {
      loadGodUsers();
    }
  }, [activeSection]);

  const navItems = [
    { id: 'password', label: 'Change Password', icon: Lock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'add-god', label: 'Add God', icon: UserPlus },
  ];

  const pwStrength = Math.min(
    4,
    [
      passwordData.newPassword.length >= 8,
      /[A-Z]/.test(passwordData.newPassword),
      /[0-9]/.test(passwordData.newPassword),
      /[^A-Za-z0-9]/.test(passwordData.newPassword),
    ].filter(Boolean).length,
  );

  const strengthColors = ['bg-slate-200', 'bg-red-400', 'bg-amber-400', 'bg-teal-400', 'bg-teal-600'];

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-200">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight">God Settings</h1>
              <p className="text-xs text-slate-400">Manage your profile and preferences</p>
            </div>
          </div>
        </div>

        {message.text && (
          <div
            className={`mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold border ${message.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-red-50 text-red-600 border-red-200'
              }`}
          >
            {message.text}
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className="ml-auto text-lg leading-none opacity-40 hover:opacity-80"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex flex-col xl:flex-row gap-5 items-start">
          <div className="w-full xl:w-56 flex-shrink-0 flex flex-col gap-4 xl:sticky xl:top-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="relative bg-teal-600 h-16 overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white opacity-10" />
                <div className="absolute -right-1 top-6 w-14 h-14 rounded-full bg-white opacity-10" />
              </div>
              <div className="px-5 pb-5 text-center">
                <div className="relative inline-block -mt-7 mb-2.5">
                  <div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-700 border-3 border-white flex items-center justify-center text-white text-lg font-extrabold shadow-lg"
                    style={{ border: '3px solid white' }}
                  >
                    {adminName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <p className="text-sm font-extrabold text-slate-900">{adminName}</p>
                <p className="text-[11px] text-teal-600 font-bold mt-0.5">{adminEmail}</p>
                <p className="text-[10.5px] text-slate-400 mt-0.5">Platform Governance</p>
                <span className="inline-block mt-2 text-[10px] font-extrabold bg-teal-50 text-teal-700 px-3 py-1 rounded-full">
                  God Access
                </span>
              </div>
            </div>

            <nav className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2.5 overflow-x-auto">
              <ul className="space-y-1 min-w-[220px]">
                {navItems.map(({ id, label, icon: Icon }) => {
                  const active = activeSection === id;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => {
                          setActiveSection(id);
                          setMessage({ type: '', text: '' });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${active ? 'bg-teal-50' : 'hover:bg-slate-50'
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? 'bg-teal-100' : 'bg-slate-100'
                              }`}
                          >
                            <Icon
                              className={`w-3.5 h-3.5 ${active ? 'text-teal-600' : 'text-slate-400'}`}
                            />
                          </div>
                          <span
                            className={`text-[11.5px] font-bold ${active ? 'text-teal-700' : 'text-slate-500'
                              }`}
                          >
                            {label}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-3 h-3 flex-shrink-0 ${active ? 'text-teal-400' : 'text-slate-300'
                            }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-4 w-full">
            <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex items-start sm:items-center justify-between overflow-hidden gap-4">
              <div className="relative z-10">
                <h2 className="text-lg font-extrabold text-white mb-1">
                  {activeSection === 'password' && 'Change Password'}
                  {activeSection === 'security' && 'Security Controls'}
                  {activeSection === 'add-god' && 'Add God Account'}
                </h2>
                <p className="text-teal-100 text-xs max-w-sm leading-relaxed">
                  {activeSection === 'password' &&
                    'Keep your account secure by updating your password regularly.'}
                  {activeSection === 'security' &&
                    'Strengthen safeguards for sensitive administrative actions.'}
                  {activeSection === 'add-god' &&
                    'Create another God account with auto-generated password.'}
                </p>
              </div>
              <div className="flex gap-2 opacity-90 pointer-events-none select-none">
                <div className="flex flex-col gap-2">
                  <div
                    style={{
                      width: 44,
                      height: 52,
                      background: 'rgba(255,255,255,.15)',
                      clipPath:
                        'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                    }}
                  />
                  <div
                    style={{
                      width: 28,
                      height: 34,
                      background: 'rgba(255,215,0,.3)',
                      clipPath:
                        'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                      alignSelf: 'flex-end',
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  <div
                    style={{
                      width: 28,
                      height: 34,
                      background: 'rgba(255,215,0,.3)',
                      clipPath:
                        'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                    }}
                  />
                  <div
                    style={{
                      width: 44,
                      height: 52,
                      background: 'rgba(255,255,255,.15)',
                      clipPath:
                        'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
                    }}
                  />
                </div>
              </div>
            </div>

            {activeSection === 'password' && (
              <SectionCard icon={Lock} title="Update Your Password">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <PwField
                      label="Current Password"
                      show={showPw.current}
                      onToggle={() => setShowPw((prev) => ({ ...prev, current: !prev.current }))}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                      }
                      placeholder="Enter your current password"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <PwField
                          label="New Password"
                          show={showPw.new}
                          onToggle={() => setShowPw((prev) => ({ ...prev, new: !prev.new }))}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                          }
                          placeholder="Enter new password"
                          hint="At least 8 characters"
                        />
                        {passwordData.newPassword && (
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColors[pwStrength] : 'bg-slate-100'
                                  }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <PwField
                        label="Confirm New Password"
                        show={showPw.confirm}
                        onToggle={() => setShowPw((prev) => ({ ...prev, confirm: !prev.confirm }))}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingPassword}
                    className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-xs font-extrabold rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-sm shadow-teal-200"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {loadingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </SectionCard>
            )}

            {activeSection === 'security' && (
              <SectionCard icon={Shield} title="Administrative Security">
                <div className="pt-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Monitor className="w-4 h-4 text-teal-600" />
                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      Sessions
                    </h4>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3">
                    <p className="text-xs font-bold text-slate-700 mb-1">Current Session</p>
                    <div className="text-[11px] text-slate-500 space-y-1">
                      <p>Device: {sessionInfo.device}</p>
                      <p>Browser: {sessionInfo.browser}</p>
                      <p className="flex items-center gap-1">
                        <Clock3 className="w-3 h-3" />
                        Started: {sessionInfo.startedAt}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={handleSignOutAllSessions}
                      className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out All Sessions
                    </button>
                  </div>
                </div>
              </SectionCard>
            )}


            {activeSection === 'add-god' && (
              <SectionCard icon={UserPlus} title="Create God Account">
                {godCredentials && (
                  <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900">
                    <div className="text-xs font-bold mb-1">God account created successfully</div>
                    <div className="text-xs">Username: <span className="font-mono">{godCredentials.username}</span></div>
                    <div className="text-xs">Password: <span className="font-mono">{godCredentials.password}</span></div>
                  </div>
                )}

                <form onSubmit={handleAddGod} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                        Username
                      </label>
                      <input
                        type="text"
                        value={godForm.username}
                        onChange={(e) => setGodForm((prev) => ({ ...prev, username: e.target.value }))}
                        placeholder="Enter username"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        value={godForm.email}
                        onChange={(e) => setGodForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-400 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={creatingGod}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-xs font-extrabold rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-sm shadow-teal-200 w-full sm:w-auto"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {creatingGod ? 'Creating...' : 'Create God'}
                  </button>
                </form>

                <div className="mt-6 pt-5 border-t border-slate-100">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">
                    Existing God Accounts
                  </h4>

                  {loadingGodUsers ? (
                    <p className="text-xs text-slate-400">Loading God accounts...</p>
                  ) : godUsers.length === 0 ? (
                    <p className="text-xs text-slate-400">No God accounts found.</p>
                  ) : (
                    <div className="space-y-2">
                      {godUsers.map((user) => {
                        const isCurrent = user.id === sessionStorage.getItem('userId');
                        return (
                          <div
                            key={user.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5"
                          >
                            <div>
                              <p className="text-xs font-bold text-slate-700">{user.username}</p>
                              <p className="text-[11px] text-slate-500">{user.email || 'No email'}</p>
                            </div>
                            <button
                              type="button"
                              disabled={isCurrent || deletingGodUserId === user.id}
                              onClick={() => requestDeleteGod(user)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={isCurrent ? 'Current logged in account cannot be deleted' : 'Delete account'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {deletingGodUserId === user.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </SectionCard>
            )}

            {(activeSection === 'security') && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-xs font-extrabold rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-all shadow-sm shadow-teal-200"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            )}

            <DeleteConfirmationModal
              isOpen={Boolean(pendingDeleteGodUser)}
              title="Delete God account"
              message="This will permanently remove this God account from the system."
              itemName={pendingDeleteGodUser ? `${pendingDeleteGodUser.username} (${pendingDeleteGodUser.email || 'No email'})` : ''}
              isProcessing={Boolean(deletingGodUserId)}
              onCancel={() => setPendingDeleteGodUser(null)}
              onConfirm={confirmDeleteGod}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GodSettings;