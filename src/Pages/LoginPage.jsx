import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/tata-steel.png'; // ✅ Make sure this file exists
import WelcomePopup from '../Components/WelcomePopup'; // 🆕 Create this component

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showWelcome, setShowWelcome] = useState(false); // 🆕

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === '0000' && password === '0000') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      setShowWelcome(true); // 🆕 Show welcome popup
      setTimeout(() => {
        navigate('/BLT');
      }, 2000); // ⏱️ Wait before navigating
    } else {
      alert('❌ Invalid username or password. Use 0000 / 0000');
    }
  };

  return (
    <>
      <div
        className="h-screen w-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-2xl w-96 border border-white/30">
          <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">
            DAMS Login
          </h2>

          <form onSubmit={handleLogin} autoComplete="off">
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-3 rounded-lg bg-white/60 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Username"
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                className="w-full p-3 rounded-lg bg-white/60 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-200"
            >
              Sign In
            </button>

            <p
              onClick={() => navigate('/reset')}
              className="text-center text-white mt-4 text-sm underline cursor-pointer hover:text-blue-300"
            >
              Forgot Password?
            </p>
          </form>
        </div>
      </div>

      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />} {/* 🆕 */}
    </>
  );
};

export default LoginPage;