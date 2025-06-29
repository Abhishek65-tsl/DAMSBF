// src/Components/WelcomePopup.jsxAdd commentMore actions
import React, { useEffect } from 'react';

const WelcomePopup = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Auto-close in 2 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 text-center shadow-xl animate-fade-in-up">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4140/4140037.png"
          alt="Welcome"
          className="w-24 mx-auto mb-4 animate-pulse"
        />
        <h2 className="text-xl font-semibold text-gray-800">Welcome back 👋</h2>
      </div>
    </div>
  );
};

export default WelcomePopup;