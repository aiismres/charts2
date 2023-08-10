import React from 'react';
import styles from './statusblock.module.css';

export function StatusBlock() {
  const serverStatus = JSON.parse(localStorage.getItem('isServerError') || 'j');

  return (
    <>
      <div className={styles.stblock}>{true && String(serverStatus)}</div>
    </>
  );
}
