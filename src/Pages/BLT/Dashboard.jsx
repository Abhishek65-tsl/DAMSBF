// src/components/Dashboard.jsx
import React from 'react';
import styles from './Dashboard.module.css';
import AssetImage from './AssetImage/AssetImage';
import ParameterList from './ParameterList/ParameterList';
import GaugePanel from './GaugePanel/GaugePanel';

export default function Dashboard({ data }) {
  return (
    <div className={styles.grid}>
      <ParameterList parameters={data.parameters} />
      <AssetImage src={data.imageSrc} alt="Machine asset" />
      <ParameterList parameters={data.parameters} />
      <GaugePanel groups={data.gaugeGroups} />
    </div>
  );
}
