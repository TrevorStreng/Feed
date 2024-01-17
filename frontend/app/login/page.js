'use client';
import React, { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Login logic stuff here
      console.log(
        `Logging in with username: ${username} and password: ${password}`
      );
      // Any authentication stuff here like API calls
    } catch (error) {
      console.error(error);
      // Display error message to user
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // Registering account logic here
      console.log(
        `Registering with username: ${username}, email: ${email}, and password: ${password}`
      );
      // API calls or anything here
    } catch (error) {
      console.error(error);
      // Display error message to user
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      // Forgot password logic stuff here
      console.log('Forgot password clicked');
      // A modal popup or something that leads to a password recovery page here
    } catch (error) {
      console.error(error);
      // Display error message to user
    }
    setIsLoading(false);
  };

  const toggleRegisterMode = () => {
    setIsRegistering(!isRegistering);
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">
          {isRegistering ? 'Register' : 'Login'}
        </h1>
        <form>
          <label className="block mb-4">
            Username:
            <input
              className="border w-full p-2 mt-1"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              aria-label="Username"
            />
          </label>
          {isRegistering && (
            <label className="block mb-4">
              Email:
              <input
                className="border w-full p-2 mt-1"
                type="email"
                value={email}
                onChange={handleEmailChange}
                aria-label="Email"
              />
            </label>
          )}
          <div className="flex flex-col items-end">
            <label className="block mb-4">
              Password:
              <input
                className="border w-full p-2 mt-1"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                aria-label="Password"
              />
            </label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-blue-500 text-sm"
            >
              {showPassword ? 'Hide Password' : 'Show Password'}
            </button>
          </div>

          <button
            className={`bg-${
              isRegistering ? 'green' : 'blue'
            }-500 text-white p-2 rounded hover:bg-${
              isRegistering ? 'green' : 'blue'
            }-600 focus:outline-none`}
            type="button"
            onClick={isRegistering ? handleRegister : handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="mt-4">
          {isRegistering
            ? 'Already have an account? '
            : "Don't have an account? "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={toggleRegisterMode}
          >
            {isRegistering ? 'Login here' : 'Register here'}
          </span>
        </p>
        {!isRegistering && (
          <p className="text-sm mt-2">
            <span className="text-black">Forgot password? </span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={toggleForgotPassword}
            >
              Click here
            </span>
          </p>
        )}
      </div>
      {isForgotPassword && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-8 rounded shadow-md w-96">
            <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
            <p>Enter your email to reset your password.</p>
            <label className="block mt-4">
              Email:
              <input
                className="border w-full p-2 mt-1"
                type="email"
                value={email}
                onChange={handleEmailChange}
                aria-label="Email"
              />
            </label>
            <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none mt-4"
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Reset Password'}
            </button>
            <p className="mt-4">
              <span
                className="text-blue-500 cursor-pointer"
                onClick={toggleForgotPassword}
              >
                Cancel
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}