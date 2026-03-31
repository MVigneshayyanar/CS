import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from './SettingsIcons';
import { changePassword } from '@/services/authService';

const PasswordSection = ({ passwordData, setPasswordData, loading, setLoading, setMessage }) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
        <p className="text-muted text-sm mb-6">Update your account password for security</p>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-3 bg-alt border border-theme rounded-lg text-white focus:ring-2 focus:ring-[#2a8c78] focus:border-transparent pr-10 backdrop-blur-sm"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-3 text-muted hover:text-white transition-colors"
              >
                {showCurrentPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-3 bg-alt border border-theme rounded-lg text-white focus:ring-2 focus:ring-[#2a8c78] focus:border-transparent pr-10 backdrop-blur-sm"
                placeholder="Enter new password"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-3 text-muted hover:text-white transition-colors"
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <p className="text-xs text-muted mt-1">Must be at least 8 characters long</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 bg-alt border border-theme rounded-lg text-white focus:ring-2 focus:ring-[#2a8c78] focus:border-transparent pr-10 backdrop-blur-sm"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 bg-[#1a6b5c] text-white rounded-lg hover:bg-[#134d42] focus:ring-2 focus:ring-[#2a8c78] focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 transition-all duration-300"
          >
            <Lock />
            <span className="ml-2">{loading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordSection;
