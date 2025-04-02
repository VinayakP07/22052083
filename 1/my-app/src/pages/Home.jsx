import React from 'react';
import Navbar from '../components/Navbar';
import styles from '../components/Navbar.module.css';
import TopUsers from './TopUsers';

const Home = () => {
  return (
    <div className={styles.bodyPadding}>
      <Navbar />
      <TopUsers/>
    </div>
  );
};

export default Home;
