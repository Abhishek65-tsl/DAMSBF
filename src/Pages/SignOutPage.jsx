import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/tata-steel.png';

const SignOutPage = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/signedout');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div
      className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl w-[300px] text-center border border-white/30">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png"
          alt="logout"
          className="w-16 h-16 mx-auto mb-4"
        />
        <h2 className="text-lg font-bold text-white mb-2">Oh no! You're leaving?</h2>
        <p className="text-sm text-white/90 mb-6">Are you sure you want to log out?</p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCancel}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full transition font-medium"
          >
            No, Take Me Back
          </button>
          <button
            onClick={handleConfirm}
            className="border border-blue-500 hover:bg-white/20 text-blue-100 py-2 rounded-full transition font-medium"
          >
            Yes, Log Me Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutPage;