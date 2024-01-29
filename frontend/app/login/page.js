'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const url = process.env.URL || 'http://localhost:5000';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleconfirmPasswordChange = (e) => {
    setconfirmPassword(e.target.value);
  };

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoggedIn && pathname !== '/') {
      router.push('/');
    }
  }, [isLoggedIn, pathname]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Login logic stuff here
      const body = {
        username: username,
        password: password,
      };

      const res = await axios.post(`api/users/login`, body, {
        withCredentials: true,
      });

      console.log(res);

      // const setCookieHeader = res.headers['set-cookie'];

      // Any authentication stuff here like API calls

      // If the login is successful, set isLoggedIn to true
      setIsLoggedIn(true);
    } catch (error) {
      console.error(error);
      // Display error message to the user
    }
    setIsLoading(false);
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      // Registering account logic here
      const body = {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      };

      const res = await axios.post(`api/users/signup`, body, {
        withCredentials: true,
      });
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
      const body = {
        email: email,
      };
      // Forgot password logic stuff here
      const res = await axios.post(`api/users/forgotPassword`, body, {
        withCredentials: true,
      });

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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded shadow-md flex flex-col space-y-8 w-full max-w-lg">
        {' '}
        {/* Adjusted the classes */}
        <div className="text-center">
          <h4 className="text-xl font-semibold">Welcome to Feed! 🌱</h4>
          <h5 className="text-sm text-gray-300">Pasce Cogitationes Tuas</h5>
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {isRegistering ? 'Register' : 'Login'}
        </h1>
        <form className="space-y-4">
          <label className="block mb-4">
            <input
              className="border w-full p-2 mt-1 shadow-md"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
              aria-label="Username"
            />
          </label>
          {isRegistering && (
            <label className="block mb-4">
              <input
                className="border w-full p-2 mt-1 shadow-md"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
                aria-label="Email"
              />
            </label>
          )}
          <div className="block relative">
            <label className="block mb-4">
              <input
                className="border w-full p-2 mt-1 shadow-md pr-7"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                aria-label="Password"
              />
              <span
                className="absolute right-2 top-4 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </label>
            {isRegistering && (
              <label className="block mb-4 relative">
                <input
                  className="border w-full p-2 mt-1 shadow-md pr-7"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleconfirmPasswordChange}
                  placeholder="Confirm Password"
                  aria-label="Confirm Password"
                />
                <span
                  className="absolute right-2 top-4 cursor-pointer"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </label>
            )}
          </div>

          <button
            className={`${
              isRegistering ? 'bg-green-500' : 'bg-blue-500'
            } text-white p-2 rounded ${
              isRegistering ? 'hover:bg-green-600' : 'hover:bg-blue-600'
            } focus:outline-none`}
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
              <input
                className="border w-full p-2 mt-1"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
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
                className="text-red-500 cursor-pointer"
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
