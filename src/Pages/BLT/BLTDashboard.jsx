import React from 'react';
import LeftPanel from './LeftPanel';
import BLTImagePanel from './BLTImagePanel';
import AlertsGraph from './AlertsGraph';
import ZoneAGraph from './ZoneAGraph';
import OverallHealthPanel from './OverallHealthPanel';
import IndicatorsPanel from './IndicatorsPanel';

const BLTDashboard = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      {/* Top Heading */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 0',
          backgroundColor: '#273142',
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#ffffff',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        BELL LESS TOP SYSTEM DASHBOARD
      </div>

      {/* Main Layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left - Parameters */}
        <LeftPanel
          headingStyle={{
            backgroundColor: '#007bff',
            color: '#000000',
            padding: '10px',
            fontWeight: 'bold',
            borderRadius: '5px',
            marginBottom: '10px',
          }}
        />

        {/* Right Side */}
        <div style={{ flex: 1, padding: '10px 20px' }}>
          {/* Indicators and BLT Image + Alerts Graph Row */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <IndicatorsPanel />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '30px',
              }}
            >
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                <BLTImagePanel />
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <AlertsGraph />
              </div>
            </div>
          </div>

          {/* Zone A Graph and Overall Health Side by Side and Spread */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              marginBottom: '20px',
              alignItems: 'stretch',
            }}
          >
            <div style={{ flex: 1 }}>
              <ZoneAGraph />
            </div>
            <div style={{ flex: 1 }}>
              <OverallHealthPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BLTDashboard;
