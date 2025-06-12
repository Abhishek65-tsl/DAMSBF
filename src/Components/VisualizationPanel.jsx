import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Added a 4th system gauge here for demonstration
const systems = [
  { name: 'Charge', value: 85, color: '#4caf50' },      // Green
  { name: 'Valve', value: 55, color: '#ffeb3b' },    // Yellow
  { name: 'Cooling', value: 30, color: '#f44336' },      // Red
  { name: 'Hydraulic', value: 70, color: '#2196f3' },        // Blue (new 4th gauge)
];

const VisualizationPanel = () => {
  const overallHealth = 80; // Change this value to reflect real-time data

  return (
    <div
      style={{
        // position: 'fixed',
        // top: '30%',
        // right: '1%',
        width: '180px',
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 1000,
        fontFamily: 'sans-serif',
        height: "430px"
      }}
    >
      {/* Overall Health Gayj - smaller size */}
      <div className="mb-6" style={{ width: 120, height: 150, margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#333',
            textAlign: 'center',
            marginBottom: '6px',
          }}
        >
          Overall Health
        </h2>
      <CircularProgressbar
  value={overallHealth}
  text={`${overallHealth}%`}
  styles={buildStyles({
    pathColor:
      overallHealth > 70 ? '#4caf50' : overallHealth > 40 ? '#ffeb3b' : '#f44336',
    textColor: '#333',
    trailColor: '#eee',
    textSize: '22px',
    strokeLinecap: 'round', // Optional: makes ends of the bar round
    pathTransitionDuration: 0.5,
    strokeWidth: 6, // <-- ADD THIS LINE
  })}
/>

      </div>

      {/* System Health Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {systems.map((sys, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#f9f9f9',
              padding: '8px',
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              minHeight: '48px',
              fontSize: '12px',
              marginBottom: '4px',
              marginTop: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#444' }}>
              <span>{sys.name}</span>
              <span>{sys.value}%</span>
            </div>

            {/* Health bar underneath */}
            <div
              style={{
                marginTop: '4px',
                height: '6px',
                width: '100%',
                borderRadius: '6px',
                backgroundColor: '#ddd',
              }}
            >
              <div
                style={{
                  height: '6px',
                  width: `${sys.value}%`,
                  borderRadius: '6px',
                  backgroundColor: sys.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualizationPanel;