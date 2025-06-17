import React from 'react';
import { FaBolt, FaTint, FaSnowflake, FaCogs } from 'react-icons/fa';

const systems = [
  { name: 'Charge', value: 85, color: '#4caf50', icon: <FaBolt /> },
  { name: 'Valve', value: 55, color: '#ff9800', icon: <FaTint /> },
  { name: 'Cooling', value: 30, color: '#f44336', icon: <FaSnowflake /> },
  { name: 'Hydraulic', value: 70, color: '#2196f3', icon: <FaCogs /> },
];

const shadeColor = (color, percent) => {
  const num = parseInt(color.slice(1), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return (
    '#' +
    (0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255))
      .toString(16)
      .slice(1)
  );
};

const Gauge = ({ value }) => {
  const angle = (value / 100) * 180;
  const centerX = 100;
  const centerY = 100;
  const needleLength = 60;
  const rad = ((angle - 180) * Math.PI) / 180;
  const needleX = centerX + needleLength * Math.cos(rad);
  const needleY = centerY + needleLength * Math.sin(rad);

  return (
    <svg width="200" height="110" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f44336" />
          <stop offset="25%" stopColor="#ff9800" />
          <stop offset="50%" stopColor="#ffeb3b" />
          <stop offset="75%" stopColor="#2196f3" />
          <stop offset="100%" stopColor="#4caf50" />
        </linearGradient>
      </defs>

      <path
        d={`M ${centerX - 80},${centerY} A 80 80 0 0 1 ${centerX + 80},${centerY}`}
        stroke="url(#gaugeGradient)"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
      />

      {[0, 25, 50, 75, 100].map((tick) => {
        const tickAngle = (tick / 100) * 180;
        const tickRad = ((tickAngle - 180) * Math.PI) / 180;
        const x1 = centerX + 68 * Math.cos(tickRad);
        const y1 = centerY + 68 * Math.sin(tickRad);
        const x2 = centerX + 80 * Math.cos(tickRad);
        const y2 = centerY + 80 * Math.sin(tickRad);
        const labelX = centerX + 56 * Math.cos(tickRad);
        const labelY = centerY + 56 * Math.sin(tickRad) - 4;

        return (
          <g key={tick}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth="2" />
            <text x={labelX} y={labelY} fontSize="10" textAnchor="middle" fill="#333">
              {tick}%
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
        strokeWidth="3"
        style={{ transition: 'all 0.5s ease-out' }}
      />
      <circle cx={centerX} cy={centerY} r="5" fill="#000" />
    </svg>
  );
};

const VisualizationPanel = () => {
  const overallHealth = 80;

  return (
    <div
      style={{
        width: '520px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '16px',
        borderRadius: '16px',
        boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div style={{ width: 200, margin: '0 auto', marginBottom: '35px' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#333',
            textAlign: 'center',
            marginBottom: '3px',
          }}
        >
          Overall Health
        </h2>
        <Gauge value={overallHealth} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '20px', rowGap: '12px' }}>
        {systems.map((sys, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#f9f9f9',
              padding: '12px',
              borderRadius: '10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
            }}
            title={`System: ${sys.name}\nHealth: ${sys.value}%`}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', color: '#333' }}>
              <span>{sys.icon} {sys.name}</span>
              <span>{sys.value}%</span>
            </div>
            <div style={{ height: '6px', width: '100%', borderRadius: '6px', backgroundColor: '#ddd' }}>
              <div
                style={{
                  height: '6px',
                  width: `${sys.value}%`,
                  borderRadius: '6px',
                  background: `linear-gradient(90deg, ${sys.color}, ${shadeColor(sys.color, -20)})`,
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
