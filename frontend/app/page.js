'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import io from 'socket.io-client';
import { ThumbsUp, ThumbsDown } from 'react-feather';

export default function Home() {
  const url = process.env.NEXT_PUBLIC_URL || 'http://localhost:5000';
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5001';
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const [changed, setChanged] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleTweetChange = (event) => {
    setTweet(event.target.value);
  };

  const fetchAllTweets = async () => {
    console.log(url);
    try {
      const res = await axios.get(`api/tweets`);
      let tweetArr = res.data.tweets;
      tweetArr = tweetArr.reverse();

      setTweets(tweetArr);
    } catch (err) {
      console.error(err);
    }
  };

  const checkLogin = async () => {
    try {
      const res = await axios.get(`api/users/isLoggedIn`, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      setIsLoggedIn(res.data.loggedIn);
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    checkLogin();
    fetchAllTweets();
  }, []);

  const getUserFromToken = async () => {
    try {
      const res = await axios.get(`api/users/me`);
      return res.data.userId;
    } catch (err) {
      console.error(err);
    }
  };

  const createTweet = async () => {
    try {
      const userId = await getUserFromToken();

      const body = {
        userId: userId,
        message: tweet,
      };
      const res = await axios.post(`api/tweets/createTweet`, body);
      setTweet('');
      setChanged(true);
    } catch (err) {
      console.error(err);
    }
  };

  const likeTweet = async (tweetId) => {
    try {
      const userId = await getUserFromToken();

      const likeBody = {
        userId: userId,
      };
      const res = await axios.patch(`api/tweets/${tweetId}/like`, likeBody);

      setChanged(true);
    } catch (err) {
      console.error(err);
    }
  };

  const dislikeTweet = async (tweetId) => {
    try {
      const userId = await getUserFromToken();

      const body = {
        userId: userId,
      };
      const res = await axios.patch(`api/tweets/${tweetId}/unlike`, body);
      setChanged(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllTweets();
    return () => setChanged(false);
  }, [changed]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      {isLoggedIn ? (
        <div className="max-w-2xl w-full">
          <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <div className="flex space-x-4">
              <Image
                src="/pictures/user-avatar.jpg"
                alt="User Avatar"
                className="rounded-full w-14 h-14"
                width={40}
                height={40}
              />
              <textarea
                placeholder="Start typing"
                className="resize-none flex-1 outline-none"
                value={tweet}
                onChange={handleTweetChange}
                maxLength={280}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-full"
                disabled={tweet.length > 280}
                onClick={createTweet}
              >
                Post
              </button>
            </div>
          </div>
          {tweets.length > 0 &&
            tweets.map((el, index) => (
              <div
                key={index}
                className="bg-white p-4 mb-4 rounded-lg shadow-md"
              >
                <div className="flex space-x-4">
                  <Image
                    src="/pictures/user-avatar.jpg"
                    alt="Tweet Author Avatar"
                    className="rounded-full w-14 h-14"
                    width={40}
                    height={40}
                  />
                  <div>
                    <h3 className="font-semibold">{el.username}</h3>
                    <p>{el.message}</p>
                    <div className="flex">
                      <button
                        onClick={() => likeTweet(el._id)}
                        className="flex items-center text-blue-500 hover:text-blue-700 focus:outline-none mr-2"
                      >
                        <ThumbsUp size={18} className="mr-1" />
                        <span className="px-1">{el.likes.count}</span>
                      </button>
                      <button
                        onClick={() => dislikeTweet(el._id)}
                        className="flex items-center text-red-500 hover:text-red-700 focus:outline-none"
                      >
                        <ThumbsDown size={18} className="mr-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="w-1/2 mx-auto bg-white rounded-lg shadow-md text-center border-t border-gray-300">
          <h1 className="text-2xl font-bold p-4">
            Please Login/Register for an Account to View the Home Page
          </h1>
          <a
            href="/login"
            className="mb-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded inline-block"
          >
            Login/Register
          </a>
        </div>
      )}
    </main>
  );
}
