// src/components/Dashboard.jsx
import React from 'react';
import styles from './Dashboard.module.css';
// import AssetImage from './AssetImage/AssetImage';
import ParameterList from './ParameterList/ParameterList';
import GaugePanel from './GaugePanel/GaugePanel';
import { useDarkMode } from '../context/ThemeContext';

export default function Dashboard({ data }) {
  return (
    <div className={styles.grid}>
        <div>
        <h2><b> 
            MAKING MASTER PAGE
            </b></h2>   
        </div>
      <ParameterList parameters={data.parameters} />
      <AssetImage src={data.imageSrc} alt="Machine asset" />
      <ParameterList parameters={data.parameters} />
      <GaugePanel groups={data.gaugeGroups} />
    </div>
  );
}
function YourDashboardComponent() {
  const [isDark, setIsDark] = useState(false);  // <- ADD THIS LINE

  return (
    <div className={isDark ? 'dark-mode' : ''}>  {/* <- MODIFY THIS LINE */}
      {/* All your existing dashboard JSX code stays the same */}
      
      {/* Add this button somewhere in your JSX: */}
      <button onClick={() => setIsDark(!isDark)} style={{position: 'fixed', top: '10px', right: '10px'}}>
        {isDark ? '☀️' : '🌙'}
      </button>
    </div>
  );
}