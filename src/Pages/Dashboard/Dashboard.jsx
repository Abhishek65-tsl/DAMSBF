// src/components/Dashboard.jsx
import React, { useState } from 'react';
import styles from './Dashboard.module.css';
// import AssetImage from './AssetImage/AssetImage';
import ParameterList from './ParameterList/ParameterList';
import GaugePanel from './GaugePanel/GaugePanel';
import AssetImage from './AssetImage/AssetImage';
import TrendAnalysisModal from './TrendAnalysisModal';
import VoiceAssistant from './VoiceAssistant';
import { VoiceCommandProvider } from './VoiceCommandContext';

// Voice-recognizable keys mapped to proper titlesAdd commentMore actions
const parameterTitles = {
  'hbt': 'HBT',
  'wind volume': 'Wind Volume',
  'top gas temp': 'Top Gas Temp',
  'pci rate': 'PCI Rate',
  'coke rate': 'Coke Rate',
  'gas pressure': 'Gas Pressure',
};

export default function Dashboard({ data }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);

  const showTrendGraph = (paramKey) => {
    const title = parameterTitles[paramKey];
    if (title) {
      setSelectedParameter({ key: paramKey, title });
      setModalOpen(true);
    } else {
      alert("❌ Parameter title not found for: " + paramKey);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedParameter(null);
  };
  return (
    <VoiceCommandProvider showTrendGraph={showTrendGraph}>
      <div className={styles.grid}>
        {/* Voice Assistant Mic in top-right corner */}
        <div className="absolute top-2 right-4 z-50">
          <VoiceAssistant />
        </div>
        <h2><b>MAKING MASTER PAGE</b></h2>

        <ParameterList parameters={data.parameters} />
        <AssetImage src={data.imageSrc} alt="Machine asset" />
        <ParameterList parameters={data.parameters} />
        <GaugePanel groups={data.gaugeGroups} />

        {/* Modal for Graph */}
        <TrendAnalysisModal
          isOpen={modalOpen}
          onClose={closeModal}
          parameter={selectedParameter}
        />
      </div>
    </VoiceCommandProvider>
  );
}
