'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import io from 'socket.io-client';

export default function Home() {
  const wsUrl = process.env.WS_URL || 'http://localhost:5001';
  const socket = io(wsUrl);
  // const socket = io(wsUrl, { withCredentials: true });
  const [tweet, setTweet] = useState('');
  const [tweets, setTweets] = useState([]);
  const handleTweetChange = (event) => {
    setTweet(event.target.value);
  };

  useEffect(() => {
    // const socket = io(wsUrl);
    return () => {
      socket.disconnect();
    };
  }, []);
  const fetchAllTweets = async () => {
    try {
      const res = await axios.get(`/api/tweets`);
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
      const res = await axios.get('/api/users/me');
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
      const res = await axios.post(`/api/tweets/createTweet`, body);
      webSocketUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // WebSocket connection
  const webSocketUpdate = () => {
    socket.on('new-post', (data) => {
      console.log('WebSocket connection established:', socket.connected);
      console.log('New post: ', data);
      console.log('socket id: ', socket.id);

      fetchAllTweets();
    });
    return () => socket.disconnect();
    //  socket.off('new-post', () => {
    //   console.log('new post socket off...');
    // });
  };
  useEffect(() => {
    webSocketUpdate();
  });

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
                </div>
              </div>
            </div>
          ))}

        {/* More tweets go here */}
      </div>
    </main>
  );
}
