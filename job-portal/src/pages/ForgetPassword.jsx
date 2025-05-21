import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const auth = getAuth();

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Website Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">PerfectFit</h1>

      {/* Password Reset Box */}
      <div className="w-full max-w-sm p-6 bg-blue-10 rounded-md shadow-md">
        <h2 className="mb-6 text-xl font-semibold text-center text-gray-800">Reset Your Password</h2>
        
        <form onSubmit={handlePasswordReset}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 mb-4 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Send Reset Email
          </button>
        </form>
        
        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;