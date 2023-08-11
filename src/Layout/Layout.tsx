import React from 'react';
import styles from './layout.module.css';
import { dividerClasses } from '@mui/material';

export function Layout({ chlildren }: { chlildren: React.ReactNode }) {
  let x = 3;
  return (
    <div>
      <ul>
        <li>d</li>
      </ul>
      {}
    </div>
  );
  // <div className={styles.layout}>{chlildren}</div>;
}
