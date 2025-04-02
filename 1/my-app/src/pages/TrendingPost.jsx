import React, { useEffect, useState } from 'react';
import styles from './TrendingPost.module.css';
import Navbar from '../components/Navbar';

const TrendingPost = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = "http://20.244.56.144/evaluation-service";
  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzNjk3LCJpYXQiOjE3NDM2MDMzOTcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBkYzBlMGE3LWY5MjYtNDk4Yi04NjYzLTQ2NTY1OTgyZTg3ZiIsInN1YiI6IjIyMDUyMDgzQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MjA4M0BraWl0LmFjLmluIiwibmFtZSI6InZpbmF5YWsgYW5pbCBwdXJhbmlrIiwicm9sbE5vIjoiMjIwNTIwODMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiIwZGMwZTBhNy1mOTI2LTQ5OGItODY2My00NjU2NTk4MmU4N2YiLCJjbGllbnRTZWNyZXQiOiJGcmdaZkFSTURRRXdjelpTIn0.boVE7otghb9EmgIGqILPIsL0HXWjbOdmm0Ltb_uYgRA";

  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const usersResponse = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
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
              headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
              },
            });

            if (postsResponse.ok) {
              const postsData = await postsResponse.json();
              allPosts = [...allPosts, ...postsData.posts];
            }
          } catch {
            console.warn(`Error fetching posts for user ${userId}`);
          }
        }));

        if (allPosts.length === 0) throw new Error("No posts found");

        const postsWithComments = await Promise.all(
          allPosts.map(async (post) => {
            try {
              const commentsResponse = await fetch(`${API_URL}/posts/${post.id}/comments`, {
                headers: {
                  Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
              });

              if (!commentsResponse.ok) return { ...post, commentCount: 0 };

              const commentsData = await commentsResponse.json();
              return { ...post, commentCount: commentsData.comments?.length || 0 };
            } catch {
              return { ...post, commentCount: 0 };
            }
          })
        );

        const maxComments = Math.max(...postsWithComments.map(post => post.commentCount));

        const trendingPosts = postsWithComments.filter(post => post.commentCount === maxComments);

        setTrendingPosts(trendingPosts);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchTrendingPosts();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Trending Posts (Most Commented)</h2>
        {error ? (
          <p className={styles.error}>{error}</p>
        ) : (
          <ul className={styles.postList}>
            {trendingPosts.map((post) => (
              <li key={post.id} className={styles.postItem}>
                <img
                  src={`https://source.unsplash.com/300x200/?nature&random=${post.id}`}
                  alt="Post"
                  className={styles.postImage}
                />
                <div className={styles.postContent}>
                  <p className={styles.postText}>{post.content}</p>
                  <p className={styles.commentCount}>Comments: {post.commentCount}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default TrendingPost;