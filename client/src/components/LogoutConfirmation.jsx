import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutConfirmation = ({ isOpen, onConfirm, onCancel, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'var(--bg-modal-overlay)' }}
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div 
        className="relative rounded-2xl shadow-2xl p-6 max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-300"
        style={{ 
          background: 'var(--logout-modal-bg)', 
          border: '1px solid var(--logout-modal-border)' 
        }}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-500/20 rounded-full p-3">
            <LogOut className="w-6 h-6 text-red-400" />
          </div>
        </div>

        {/* Content */}
        <h2 className="text-xl font-bold text-white text-center mb-2">
          Confirm Logout
        </h2>
        <p className="text-white/70 text-center mb-6">
          Are you sure you want to logout? You'll need to login again to access your account.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
