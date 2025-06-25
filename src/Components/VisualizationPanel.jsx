// VisualizationPanel.jsx

import React, { useState } from 'react';
import { FaBolt, FaTint, FaSnowflake, FaCogs } from 'react-icons/fa';

// System Data
const systems = [
  { name: 'Charge', value: 85, color: '#4caf50', icon: <FaBolt /> },
  { name: 'Valve', value: 55, color: '#ff9800', icon: <FaTint /> },
  { name: 'Cooling', value: 30, color: '#f44336', icon: <FaSnowflake /> },
  { name: 'Hydraulic', value: 70, color: '#2196f3', icon: <FaCogs /> },
];

// Gauge Component
const Gauge = ({ value }) => {
  const [hovered, setHovered] = useState(false);
  const angle = (value / 100) * 180;
  const centerX = 50;
  const centerY = 50;
  const needleLength = 30;
  const rad = ((angle - 180) * Math.PI) / 180;
  const needleX = centerX + needleLength * Math.cos(rad);
  const needleY = centerY + needleLength * Math.sin(rad);

  return (
    <div
      style={{ position: 'relative', width: '100px', height: '60px' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div
          style={{
            position: 'absolute',
            top: '-18px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '10px',
            fontWeight: 'bold',
            backgroundColor: '#222',
            color: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            zIndex: 1
          }}
        >
          {value}%
        </div>
      )}
      <svg width="100" height="60">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f44336" />
            <stop offset="50%" stopColor="#ffeb3b" />
            <stop offset="100%" stopColor="#4caf50" />
          </linearGradient>
        </defs>

        <path
          d={`M ${centerX - 40},${centerY} A 40 40 0 0 1 ${centerX + 40},${centerY}`}
          stroke="url(#gaugeGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {[0, 25, 50, 75, 100].map((tick) => {
          const tickAngle = (tick / 100) * 180;
          const tickRad = ((tickAngle - 180) * Math.PI) / 180;
          const x1 = centerX + 34 * Math.cos(tickRad);
          const y1 = centerY + 34 * Math.sin(tickRad);
          const x2 = centerX + 40 * Math.cos(tickRad);
          const y2 = centerY + 40 * Math.sin(tickRad);
          const labelX = centerX + 28 * Math.cos(tickRad);
          const labelY = centerY + 28 * Math.sin(tickRad) - 2;

          return (
            <g key={tick}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth="1" />
              <text x={labelX} y={labelY} fontSize="6" textAnchor="middle" fill="#333">
                {tick}
              </text>
            </g>
          );
        })}

        <line
          x1={centerX}
          y1={centerY}
          x2={needleX}
          y2={needleY}
          stroke="#000"
          strokeWidth="2"
          style={{ transition: 'all 0.5s ease-out' }}
        />
        <circle cx={centerX} cy={centerY} r="3" fill="#000" />
      </svg>
    </div>
  );
};

// Linear Health Bar
const LinearHealthBar = ({ value, darkMode }) => {
  let color = '#4caf50';
  if (value < 40) color = '#f44336';
  else if (value < 70) color = '#ffc107';

  return (
    <div style={{
      padding: '10px 16px',
      marginBottom: '20px',
      borderRadius: '12px',
      background: darkMode ? '#222' : '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      textAlign: 'center',
      color: darkMode ? '#eee' : '#000',
    }}>
      <h3 style={{ marginBottom: '6px', fontSize: '14px' }}>Equipment Health</h3>
      <div style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '5px' }}>
        {value.toFixed(2)}%
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          backgroundColor: color,
          borderRadius: '50%',
          marginLeft: '6px'
        }}></span>
      </div>
      <div style={{
        height: '6px',
        width: '100%',
        borderRadius: '5px',
        backgroundColor: '#ccc',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${value}%`,
          backgroundColor: color,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
};

// Main Component
const VisualizationPanel = () => {
  const [darkMode, setDarkMode] = useState(false);
  const overallHealth = systems.reduce((sum, sys) => sum + sys.value, 0) / systems.length;

  return (
    <div
      style={{
        maxWidth: '760px',
        margin: '0 auto',
        padding: '24px 20px',
        borderRadius: '16px',
        background: darkMode ? '#1a1a1a' : '#fff',
        color: darkMode ? '#eee' : '#000',
        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
        fontFamily: 'Poppins, sans-serif',
        transition: 'all 0.3s ease',
      }}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        style={{
          float: 'right',
          marginBottom: '10px',
          backgroundColor: darkMode ? '#333' : '#ddd',
          color: darkMode ? '#fff' : '#000',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <LinearHealthBar value={overallHealth} darkMode={darkMode} />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
          marginTop: '10px'
        }}
      >
        {systems.map((sys, index) => (
          <div
            key={index}
            style={{
              backgroundColor: darkMode ? '#2c2c2c' : '#f9f9f9',
              padding: '10px',
              borderRadius: '10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              textAlign: 'center',
              minHeight: '130px',
              color: darkMode ? '#fff' : '#000',
            }}
          >
            <h4 style={{ marginBottom: '6px', fontSize: '12px' }}>{sys.name.toUpperCase()}</h4>
            <Gauge value={sys.value} />
            <p style={{ marginTop: '4px', fontSize: '11px' }}>
              {sys.name} System
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisualizationPanel;
