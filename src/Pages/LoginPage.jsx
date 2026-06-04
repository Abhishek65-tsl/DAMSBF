import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/tata-steel.png'; // ✅ Make sure this file exists
import WelcomePopup from '../Components/WelcomePopup'; // 🆕 Create this component
import { api } from '../Services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [developmentCode, setDevelopmentCode] = useState('');
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false); // 🆕

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError('');
      const response = await api.post('auth/login', { username, password });
      setChallengeId(response.challengeId);
      setDevelopmentCode(response.developmentCode || '');
    } catch {
      setError('Invalid username or password.');
    }
  };

  const handleVerifyMfa = async (e) => {
    e.preventDefault();

    try {
      setError('');
      const response = await api.post('auth/verify-mfa', { challengeId, code: mfaCode });
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authTokenExpiresAt', response.expiresAt);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      setShowWelcome(true); // 🆕 Show welcome popup
      setTimeout(() => {
        navigate('/dams-blt');
      }, 2000); // ⏱️ Wait before navigating
    } catch {
      setError('Invalid or expired MFA code.');
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

          {error && <p className="mb-4 text-center text-sm font-semibold text-red-100">{error}</p>}

          {!challengeId ? (
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
            </form>
          ) : (
            <form onSubmit={handleVerifyMfa} autoComplete="off">
              {developmentCode && (
                <p className="mb-4 rounded-lg bg-white/30 p-3 text-center text-sm text-white">
                  Development MFA code: <strong>{developmentCode}</strong>
                </p>
              )}

              <div className="mb-6">
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-white/60 text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                  placeholder="MFA Code"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-200"
              >
                Verify MFA
              </button>
            </form>
          )}

          <p
            onClick={() => navigate('/reset')}
            className="text-center text-white mt-4 text-sm underline cursor-pointer hover:text-blue-300"
          >
            Forgot Password?
          </p>
        </div>
      </div>

      {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />} {/* 🆕 */}
    </>
  );
};

export default LoginPage;
