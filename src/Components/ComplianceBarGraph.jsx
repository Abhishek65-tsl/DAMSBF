import React from 'react';

const ComplianceBarGraph = ({ value = 73 }) => {
  const maxValue = 100;
  const barHeight = 115;
  const barWidth = 40;

  const computedHeight = (value / maxValue) * barHeight;

  return (
    <div
      style={{
        width: 250,
        height: 200,
        border: '0px solid #ccc',
        padding: '20px',
        boxSizing: 'none',
        fontFamily: 'sans-serif',
        userSelect: 'none',
        position: 'relative',
        backgroundColor: '#f9f9f9',
        borderRadius: 0,
      }}
    >
      {/* Title */}
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>
        SAP PM MO Compliance
      </div>

      {/* Y-axis Labels */}
      <div
        style={{
          position: 'absolute',
          top: 50,
          bottom: 41,
          left: 40,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#555',
        }}
      >
        {[100, 75, 50, 25, 0].map((val) => (
          <div key={val} style={{ height: 1 }}>{val}</div>
        ))}
      </div>

      {/* Bar Area */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          height: barHeight,
          borderLeft: '2px solid #333',
          borderBottom: '2px solid #333',
          marginLeft: 50,
          marginRight: 20,
          position: 'relative',
        }}
      >
        {/* Green Bar */}
        <div
          style={{
            width: barWidth,
            height: computedHeight,
            backgroundColor: 'green',
            borderRadius: 4,
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
          }}
          title={`Zone : ${value}%`}
        >
          {value}%
        </div>
      </div>

      {/* X-axis Label */}
      <div
        style={{
          marginTop: 10,
          textAlign: 'center',
          fontSize: 14,
          color: '#333',
        }}
      >
        Zone A
      </div>

      {/* Y-axis text */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 5,
          transform: 'translateY(-50%) rotate(-90deg)',
          fontSize: 12,
          fontWeight: 'bold',
          color: '#333',
        }}
      >
        Orders
      </div>
    </div>
  );
};

export default ComplianceBarGraph;