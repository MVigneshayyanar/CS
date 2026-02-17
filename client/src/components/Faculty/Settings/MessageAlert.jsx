import React from 'react';

const MessageAlert = ({ message }) => {
  if (!message.text) return null;
  
  return (
    <div className={`mb-8 p-4 rounded-lg ${
      message.type === 'success' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50' :
      'bg-red-900/50 text-red-300 border border-red-700/50'
    } backdrop-blur-sm`}>
      {message.text}
    </div>
  );
};

export default MessageAlert;
