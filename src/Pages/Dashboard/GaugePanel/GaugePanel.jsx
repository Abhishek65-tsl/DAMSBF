
// src/components/GaugePanel/GaugePanel.jsx
import React from 'react';
import styles from './GaugePanel.module.css';
import GaugeGroup from './GaugeGroup';

export default function GaugePanel({ groups }) {
  return (
    <div className={styles.panel}>
      {groups.map(group => (
        <GaugeGroup
          key={group.title}
          title={group.title}
          gauges={group.gauges}
        />
      ))}
    </div>
  );
}