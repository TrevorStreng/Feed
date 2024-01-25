'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import io from 'socket.io-client';

export default function Home() {
  const url = process.env.NEXT_PUBLIC_URL || 'http://localhost:5000';
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:5001';
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
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

  useEffect(() => {
    fetchAllTweets();
  }, []);

  const getUserFromToken = async () => {
    try {
      const res = await axios.get(`${url}api/users/me`);
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
        // tags ,
      };
      const res = await axios.post(`${url}api/tweets/createTweet`, body);
      setTweet('');
    } catch (err) {
      console.error(err);
    }
  };

  const likeTweet = async (tweetId) => {
    try {
      const userId = await getUserFromToken();

      const body = {
        userId: userId,
      };
      const res = await axios.patch(`${url}api/tweets/${tweetId}/like`, body);
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
      const res = await axios.patch(`${url}api/tweets/${tweetId}/unlike`, body);
    } catch (err) {
      console.error(err);
    }
  };

  // WebSocket connection
  useEffect(() => {
    const socket = io(wsUrl, { withCredentials: true });
    socket.on('new-post', (data) => {
      fetchAllTweets();
    });
    return () => socket.disconnect();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      {/* Timeline */}
      <div className="max-w-2xl w-full">
        {/* Tweet Box */}
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          <div className="flex space-x-4">
            <Image
              src="/user-avatar.jpg" // Add the path to the user's avatar image
              alt="User Avatar"
              className="rounded-full"
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

        {/* Tweets */}
        {/* Sample Tweet */}
        {/* <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          <div className="flex space-x-4">
            <Image
              src="/tweet-avatar.jpg" // Add the path to the tweet author's avatar image
              alt="Tweet Author Avatar"
              className="rounded-full"
              width={40}
              height={40}
            />
            <div>
              <h3 className="font-semibold">Random Person</h3>
              <p>This is a sample tweet. Welcome to Feed</p>
            </div>
          </div>
        </div> */}
        {/* End of Sample Tweet */}
        {tweets.length > 0 &&
          tweets.map((el, index) => (
            <div key={index} className="bg-white p-4 mb-4 rounded-lg shadow-md">
              <div className="flex space-x-4">
                <Image
                  src="/tweet-avatar.jpg" // Add the path to the tweet author's avatar image
                  alt="Tweet Author Avatar"
                  className="rounded-full"
                  width={40}
                  height={40}
                />
                <div>
                  <h3 className="font-semibold">{el.username}</h3>
                  <p>{el.message}</p>
                  {/*<div className="flex">
                    {el.tags.length > 0 &&
                      el.tags.map((tag, index) => (
                        <div key={index} id="hashtags">
                          <p>{tag}</p>
                        </div>
                      ))}
                      </div> */}
                  <div className="flex">
                    <button onClick={() => likeTweet(el._id)}>like</button>
                    <p className="px-3">{el.likes.count}</p>
                    <button onClick={() => dislikeTweet(el._id)}>
                      dislike
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* More tweets go here */}
      </div>
    </main>
  );
}
