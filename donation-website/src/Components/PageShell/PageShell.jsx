// Page Shell Component - RTL wrapper with side bars and central container
import React from 'react';
import styles from './PageShell.module.css';

const PageShell = ({ children }) => {
  return (
    <div className={styles.pageShell} dir="rtl">
      <div className={styles.sideBars}>
        <div className={styles.leftBar}></div>
        <div className={styles.rightBar}></div>
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default PageShell;
