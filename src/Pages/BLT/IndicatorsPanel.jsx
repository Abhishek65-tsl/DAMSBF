import React from 'react';

const IndicatorsPanel = () => {
  return (
    <div
      style={{
        margin: '10px 0',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        color: 'black',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        minWidth: '320px',
      }}
    >
      {/* Operation Heading */}
      <h4
        style={{
          backgroundColor: '#003366', // Dark blue
          color: 'white',
          padding: '10px',
          borderRadius: '8px 8px 0 0',
          margin: '-20px -20px 15px -20px',
          textAlign: 'center',
        }}
      >
        Operation
      </h4>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <span style={{ color: 'green' }}>● Wind Vol</span>
        <span style={{ color: 'orange' }}>● Top Gas Pre</span>
        <span style={{ color: 'lime' }}>● Top Gas Temp</span>
        <span style={{ color: 'yellow' }}>● HBT</span>
        <span style={{ color: 'red' }}>● PCI Rate</span>
      </div>

      {/* Maintenance Heading */}
      <h4
        style={{
          backgroundColor: '#003366',
          color: 'white',
          padding: '10px',
          borderRadius: '8px 8px 0 0',
          margin: '0 -20px 15px -20px',
          textAlign: 'center',
        }}
      >
        Maintenance
      </h4>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <span style={{ color: 'green' }}>● Rotation Angle</span>
        <span style={{ color: 'orange' }}>● Tilting Angle</span>
        <span style={{ color: 'red' }}>● Gear Box Temp</span>
        <span style={{ color: 'lime' }}>● Hopper 1 Wt</span>
        <span style={{ color: 'yellow' }}>● Hopper 2 Wt</span>
        <span style={{ color: 'cyan' }}>● Hydraulic Pre</span>
        <span style={{ color: 'pink' }}>● Pump Status</span>
      </div>
    </div>
  );
};

export default IndicatorsPanel;
