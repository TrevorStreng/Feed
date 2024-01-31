'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationItem = ({ type, message }) => {
  return (
    <div className="flex items-center border-b py-2">
      <div className="mr-4">
        {type === 'like' ? (
          <span className="text-blue-500 text-2xl">&#x2665;</span>
        ) : (
          <span className="text-green-500 text-2xl">&#x21A9;</span>
        )}
      </div>
      <div>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

// Placeholder for now until we can get it connected to the database
export default function Notifications() {
  // const notifications = [
  //   { type: 'like', content: 'Your post was liked!' },
  //   { type: 'reply', content: 'Someone replied to your post!' },
  //   // Add more notifications as needed
  // ];

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
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <div className="max-w-md mx-auto mt-7 p-4 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        <div>
          {notifications.map((notification, index) => (
            <NotificationItem key={index} {...notification} />
          ))}
        </div>
      </div>
    </div>
  );
}
