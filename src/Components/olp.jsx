import React from 'react';

// Updated Health Data
const healthData = [
  { name: 'Health Cooling', value: 85 },
  { name: 'Furnace Stave Cooling', value: 55 },
  { name: 'Tyuere Nose Cooling', value: 30 },
  { name: 'Tyuere Aux Cooling', value: 70 },
];

const getColor = (value) => {
  if (value < 50) return '#e74c3c';   // Red
  if (value < 75) return '#f1c40f';   // Yellow
  return '#2ecc71';                   // Green
};

const getOverallAverage = () => {
  const sum = healthData.reduce((acc, item) => acc + item.value, 0);
  return Math.round(sum / healthData.length);
};

const OLP = () => {
  const avg = getOverallAverage();
  const angleDeg = (avg / 100) * 180;

  const radius = 70;
  const centerX = 100;
  const centerY = 100;
  const needleLength = radius - 10;
  const needleAngleRad = (Math.PI * (angleDeg - 180)) / 180;
  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

  const tickLabels = [0, 30, 50, 75, 100];

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '100%',
      }}
    >
      {/* Heading */}
      <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '16px', textAlign: 'center' }}>
       Equipment Health
      </div>

      {/* Gauge */}
      <div style={{ width: 220, height: 130, margin: '0 auto', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          {/* Gradient Arc */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e74c3c" />
              <stop offset="50%" stopColor="#f1c40f" />
              <stop offset="100%" stopColor="#2ecc71" />
            </linearGradient>
          </defs>

          {/* Semicircle Arc */}
          <path
            d="M30,100 A70,70 0 0,1 170,100"
            stroke="url(#gaugeGradient)"
            strokeWidth="16"
            fill="none"
            strokeLinecap="round"
          />

          {/* Ticks and Labels */}
          {tickLabels.map((val) => {
            const deg = (val / 100) * 180;
            const rad = ((deg - 180) * Math.PI) / 180;
            const x1 = centerX + Math.cos(rad) * (radius - 5);
            const y1 = centerY + Math.sin(rad) * (radius - 5);
            const x2 = centerX + Math.cos(rad) * (radius + 5);
            const y2 = centerY + Math.sin(rad) * (radius + 5);
            const lx = centerX + Math.cos(rad) * (radius + 15);
            const ly = centerY + Math.sin(rad) * (radius + 15);
            return (
              <g key={val}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ccc" strokeWidth="2" />
                <text x={lx} y={ly} textAnchor="middle" fontSize="10" fill="#555">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Needle */}
          <line
            x1={centerX}
            y1={centerY}
            x2={needleX}
            y2={needleY}
            stroke="#2c3e50"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={centerX} cy={centerY} r="6" fill="#2c3e50" />
        </svg>
      </div>

      {/* Health Parameters */}
      <div style={{ marginTop: 20 }}>
        {healthData.map((item, i) => (
          <div key={i} style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: 6 }}>
              {item.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  background: '#ddd',
                  borderRadius: 4,
                  overflow: 'hidden',
                  height: '6px',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${item.value}%`,
                    backgroundColor: getColor(item.value),
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
              <div style={{ fontSize: '12px', color: '#333', minWidth: '28px' }}>
                {item.value}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OLP;