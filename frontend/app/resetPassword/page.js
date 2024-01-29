'use client';
import React, { useState } from 'react';
import axios from 'axios';

export default function resetPassword() {
  const url = process.env.URL || 'http://localhost:5000';
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleconfirmPasswordChange = (e) => {
    setconfirmPassword(e.target.value);
  };

  const handleResetPassword = async () => {
    // setIsLoading(true);
    try {
      const token = getToken();
      const body = {
        password: password,
        confirmPassword: confirmPassword,
      };
      // Reset password logic stuff here
      const res = await axios.patch(
        `${url}/api/users/resetPassword/${token}`,
        body,
        {
          withCredentials: true,
        }
      );

      console.log('Forgot password clicked');
      // A modal popup or something that leads to a password recovery page here
    } catch (error) {
      console.error(error);
      // Display error message to user
    }
    // setIsLoading(false);
  };

  const getToken = () => window.location.hash.substring(1);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
          <p>Enter your email to reset your password.</p>
          <div className="flex flex-col items-end">
            <label className="block mb-4">
              Password:
              <input
                className="border w-full p-2 mt-1"
                // type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                aria-label="Password"
              />
            </label>
            <label className="block mb-4">
              Confirm Password:
              <input
                className="border w-full p-2 mt-1"
                // type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleconfirmPasswordChange}
                aria-label="Email"
              />
            </label>
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none mt-4"
              type="button"
              onClick={handleResetPassword}
              // disabled={isLoading}
            >
              {/* {isLoading ? 'Loading...' : 'Reset Password'} */}
            </button>
            <p className="mt-4">
              <span
                className="text-blue-500 cursor-pointer"
                // onClick={toggleResetPassword}
              >
                Cancel
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
