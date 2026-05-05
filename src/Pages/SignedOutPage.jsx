import React from 'react';
import { Link } from 'react-router-dom';

const SignedOutPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">You have been signed out.</h1>

        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Login Again
        </Link>
      </div>
    </div>
  );
};

export default SignedOutPage;