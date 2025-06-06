// src/Components/Dashboard.jsx
import React from 'react';
import styles from './Dashboard.module.css';
import AssetImage from './AssetImage/AssetImage';
import ParameterList from './ParameterList/ParameterList';
import GaugePanel from './GaugePanel/GaugePanel';
import ParticleAnimation from '../../Components/Particles/ParticleAnimation'; // capital "Components" fixed

export default function Dashboard({ data }) {
  return (
    <div className={styles.grid}>
      <ParameterList parameters={data.parameters} />

      {/* Image container with overlaying particle animation */}
      <div style={{ position: "relative", width: "100%", height: "auto" }}>
        <AssetImage src={data.imageSrc} alt="Machine asset" />
        <ParticleAnimation />
      </div>

      <ParameterList parameters={data.parameters} />
      <GaugePanel groups={data.gaugeGroups} />
    </div>
  );
}
