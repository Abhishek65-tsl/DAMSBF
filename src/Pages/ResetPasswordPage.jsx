import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    // You can integrate backend email logic here
    setSubmitted(true);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
          Reset Password
        </h2>

        {!submitted ? (
          <form onSubmit={handleReset}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700">Registered Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center text-green-600 font-semibold">
            ✅ Reset link has been sent to <br /> <span className="text-black">{email}</span>
            <br />
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-sm text-indigo-600 underline"
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;