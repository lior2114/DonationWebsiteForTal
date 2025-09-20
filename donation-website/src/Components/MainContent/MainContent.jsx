// Main Content Component - Two column layout
import React from 'react';
import styles from './MainContent.module.css';

const MainContent = ({ children }) => {
  return (
    <div className={styles.mainContent}>
      {children}
    </div>
  );
};

export default MainContent;
