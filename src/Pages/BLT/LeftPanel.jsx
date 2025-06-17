import React from 'react';

const LeftPanel = () => {
  const data = [
    { title: 'Wind Volume (Nm³/hr)', value: '33629.J' },
    { title: 'HBT', value: '0.0°C' },
    { title: 'HBP', value: '5.1 Bar' },
    { title: 'PCI Rate (Tons/hr)', value: '88.2' },
    { title: 'PCI Rate (Kg3/THM)', value: '196.8' },
    { title: 'Hopper-I Weight', value: '69.9 T' },
    { title: 'Hopper-II Weight', value: '90 T' },
    { title: 'LMG-I Operating Time', value: '4.0s' },
    { title: 'LMG-II Operating Time', value: '4.0s' },
    { title: 'GB Casting Temperature', value: '59.0°C' },
    { title: 'GB Oil Temperature', value: '42.8°C' },
    { title: 'Chute Rotating Angle', value: '189.5°' },
    { title: 'Chute Tilting Angle', value: '43.0°' },
    { title: 'Hydraulic Pressure', value: '191.2 Bar' },
    { title: 'Hydraulic Pump Status', value: 'PUMP -1' },
    { title: 'Oil Tank Particle Counter', value: '15.0  | 11.8 | 12.3' },
    { title: 'Gearbox Temperature', value: '59.0°C' }
  ];

  return (
    <div
      style={{
        width: '500px',
        padding: '10px',
        overflowY: 'auto',
        borderRight: '1px solid gray',
        backgroundColor: 'white',
        color: 'black',
      }}
    >
      <h2 style={{ marginBottom: '15px', color: 'black' }}>Parameters</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#f5f5f5',
              width: 'calc(50% - 10px)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #ccc',
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: '#003366', // Dark blue header
                color: 'white', // White header text
                padding: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                textAlign: 'center',
              }}
            >
              {item.title}
            </div>

            {/* Value */}
            <div
              style={{
                padding: '10px',
                textAlign: 'center',
                fontSize: '14px',
                color: 'black',
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftPanel;
