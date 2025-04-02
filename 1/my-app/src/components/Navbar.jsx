import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/" className={styles.navLink}>Top Users</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/trendingPosts" className={styles.navLink}>Trending Posts</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/feed" className={styles.navLink}>Feed</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
