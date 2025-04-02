import React, { useEffect, useState } from 'react';
import styles from './Feed.module.css';
import Navbar from '../components/Navbar';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzNjk3LCJpYXQiOjE3NDM2MDMzOTcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBkYzBlMGE3LWY5MjYtNDk4Yi04NjYzLTQ2NTY1OTgyZTg3ZiIsInN1YiI6IjIyMDUyMDgzQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MjA4M0BraWl0LmFjLmluIiwibmFtZSI6InZpbmF5YWsgYW5pbCBwdXJhbmlrIiwicm9sbE5vIjoiMjIwNTIwODMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiIwZGMwZTBhNy1mOTI2LTQ5OGItODY2My00NjU2NTk4MmU4N2YiLCJjbGllbnRTZWNyZXQiOiJGcmdaZkFSTURRRXdjelpTIn0.boVE7otghb9EmgIGqILPIsL0HXWjbOdmm0Ltb_uYgRA";
  const API_URL = "http://20.244.56.144/evaluation-service";
  const POLLING_INTERVAL = 5000;

  useEffect(() => {
    let intervalId;

    const fetchFeed = async () => {
      try {
        const usersResponse = await fetch(`${API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        if (!usersData.users) throw new Error("Invalid user data format");

        const userIds = Object.keys(usersData.users);

        let allPosts = [];
        await Promise.all(userIds.map(async (userId) => {
          try {
            const postsResponse = await fetch(`${API_URL}/users/${userId}/posts`, {
              headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
            });

            if (postsResponse.ok) {
              const postsData = await postsResponse.json();
              allPosts = [...allPosts, ...postsData.posts];
            }
          } catch {
            console.warn(`Error fetching posts for user ${userId}`);
          }
        }));

        if (allPosts.length === 0) throw new Error("No posts available");

        allPosts.sort((a, b) => b.id - a.id);

        setPosts(allPosts);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchFeed();
    intervalId = setInterval(fetchFeed, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Live Feed</h2>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <ul className={styles.postList}>
            {posts.map((post) => (
              <li key={post.id} className={styles.postItem}>
                <img
                  src={`https://source.unsplash.com/300x200/?random=${post.id}`}
                  alt="Post"
                  className={styles.postImage}
                />
                <div className={styles.postContent}>
                  <p className={styles.postText}>{post.content}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Feed;
