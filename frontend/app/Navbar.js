'use client';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`api/users/isLoggedIn`);
        setIsLoggedIn(res.data.loggedIn);
        return res;
      } catch (err) {
        console.error(err);
      }
    };
    checkLogin();
  }, []);

  const logout = async () => {
    try {
      const res = await axios.post(`api/users/logout`);
      setIsLoggedIn(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="w-full mb-8 flex justify-between items-center bg-blue-500 text-white p-4 shadow-md">
      <Link href="/" className="text-2xl font-bold hover:text-gray-300">
        Feed
      </Link>
      <div className="flex space-x-4">
        <Link href="/notifications" className="hover:text-gray-300">
          Notifications
        </Link>
        <Link href="/messages" className="hover:text-gray-300">
          Messages
        </Link>
        {!isLoggedIn ? (
          <Link href="/login" as="/login" className="hover:text-gray-300">
            Login
          </Link>
        ) : (
          <button onClick={() => logout()}>Logout</button>
        )}
      </div>
    </header>
  );
}
