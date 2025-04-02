import React, { useEffect, useState } from 'react';
import styles from './TopUsers.module.css';

const TopUsers = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [error, setError] = useState(null);

  const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQzNjAzNjk3LCJpYXQiOjE3NDM2MDMzOTcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjBkYzBlMGE3LWY5MjYtNDk4Yi04NjYzLTQ2NTY1OTgyZTg3ZiIsInN1YiI6IjIyMDUyMDgzQGtpaXQuYWMuaW4ifSwiZW1haWwiOiIyMjA1MjA4M0BraWl0LmFjLmluIiwibmFtZSI6InZpbmF5YWsgYW5pbCBwdXJhbmlrIiwicm9sbE5vIjoiMjIwNTIwODMiLCJhY2Nlc3NDb2RlIjoibndwd3JaIiwiY2xpZW50SUQiOiIwZGMwZTBhNy1mOTI2LTQ5OGItODY2My00NjU2NTk4MmU4N2YiLCJjbGllbnRTZWNyZXQiOiJGcmdaZkFSTURRRXdjelpTIn0.boVE7otghb9EmgIGqILPIsL0HXWjbOdmm0Ltb_uYgRA";
  const API_URL = "http://20.244.56.144/evaluation-service";

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersResponse = await fetch(`${API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        });

        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();
        if (!usersData.users) throw new Error("Invalid user data format");

        const usersList = Object.entries(usersData.users).map(([id, name]) => ({
          id,
          name,
          postCount: 0,
        }));

        const usersWithPosts = await Promise.all(
          usersList.map(async (user) => {
            try {
              const postsResponse = await fetch(`${API_URL}/users/${user.id}/posts`, {
                headers: {
                  Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
              });

              if (!postsResponse.ok) return { ...user, postCount: 0 };

              const postsData = await postsResponse.json();
              return { ...user, postCount: postsData.posts?.length || 0 };
            } catch {
              return { ...user, postCount: 0 };
            }
          })
        );

        const sortedUsers = usersWithPosts.sort((a, b) => b.postCount - a.postCount).slice(0, 5);
        setTopUsers(sortedUsers);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Top 5 Users by Posts</h2>
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : (
        <ul className={styles.userList}>
          {topUsers.map((user) => (
            <li key={user.id} className={styles.userItem}>
              <img
                src={`https://source.unsplash.com/100x100/?portrait&random=${user.id}`}
                alt={user.name}
                className={styles.userImage}
              />
              <div>
                <p className={styles.userName}>{user.name}</p>
                <p className={styles.userPosts}>Posts: {user.postCount}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopUsers;
