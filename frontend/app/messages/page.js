'use client';
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

export default function Messages() {
  const [messages, setMessages] = useState(() => {
    // Try to get messages from localStorage
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      return JSON.parse(savedMessages);
    } else {
      return [
        {
          id: 1,
          sender: 'John Doe',
          text: 'Hey, how are you?',
          timestamp: new Date(),
        },
        {
          id: 2,
          sender: 'Jane Smith',
          text: 'I loved your recent post!',
          timestamp: new Date(),
        },
        // Add more message data as needed
      ];
    }
  });

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const newMessageObj = {
        id: messages.length + 1,
        sender: 'Your Name', // Replace with actual username or sender info
        text: newMessage,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessageObj];
        // Save the updated messages to localStorage
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      setNewMessage('');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, [messages]);

  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r border-gray-300 p-4">
        {/* List of conversations or users */}
        <h2 className="text-2xl font-bold mb-4">Conversations</h2>
        {/* Add user list or conversation list here */}
      </div>
      <div className="flex-grow p-4 flex flex-col">
        {/* Message display */}
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        <div className="h-100 overflow-y-auto">
          {/* Display messages */}
          {messages.map((message) => (
            <div key={message.id} className="mb-4">
              <p className="font-bold">{message.sender}</p>
              <p>{message.text}</p>
              <span className="text-xs text-gray-500">
                {formatTimestamp(message.timestamp)}
              </span>
            </div>
          ))}
        </div>
        {/* Message input and send button */}
        <div className="flex items-center mt-auto">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // When hitting enter, this prevents adding a new line in the textarea
                handleSendMessage();
              }
            }}
            className="w-full border p-1 mr-4"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
