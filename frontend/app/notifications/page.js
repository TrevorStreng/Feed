'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaHeart, FaRetweet } from 'react-icons/fa';

const NotificationItem = ({ type, message }) => {
  return (
    <div className="flex items-center border-t border-gray-300 py-4 hover:bg-gray-200 transition-colors duration-200 ease-in-out">
      <div className="mr-4 px-4">
        {type === 'like' ? (
          <FaHeart className="text-blue-500 text-2xl" />
        ) : (
          <FaRetweet className="text-green-500 text-2xl" />
        )}
      </div>
      <div>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const getAllNotifications = async () => {
    try {
      const res = await axios.get(`api/users/notifications`);

      setNotifications(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllNotifications();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-r from-green-400 to-blue-500">
      <div className="w-1/2 mx-auto mt-7 bg-white rounded-lg shadow-md text-center border-t border-gray-300">
        <h1 className="text-2xl font-bold p-4">Notifications</h1>
        <div>
          {notifications.map((notification, index) => (
            <NotificationItem key={index} {...notification} />
          ))}
        </div>
      </div>
    </div>
  );
}
