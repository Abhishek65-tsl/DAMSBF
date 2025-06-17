

// src/components/GaugePanel/GaugeGroup.jsx
import React from 'react';
import styles from './GaugeGroup.module.css';
// If you like, you can swap in any circular gauge library:
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function GaugeGroup({ title, gauges }) {
  return (
    <div className={styles.group}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.gauges}>
        {gauges.map(({ name, value, unit }) => (
          <div key={name} className={styles.gauge}>
            <CircularProgressbar
              value={value}
              text={`${value}${unit}`}
              styles={buildStyles({
                textSize: '28px',
                pathTransitionDuration: 0.5,
                pathColor: `rgba(0, 122, 204, ${value / 100})`,
                textColor: '#333',
                trailColor: '#eee',
              })}
            />
            <span className={styles.label}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
