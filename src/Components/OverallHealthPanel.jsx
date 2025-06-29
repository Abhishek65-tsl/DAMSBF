import React from 'react';

const healthData = [
  { name: 'Charge', value: 92 },
  { name: 'Valve', value: 85 },
  { name: 'Cooling', value: 72 },
  { name: 'Hydraulic', value: 88 },
];

const getColor = (value) => {
  if (value < 75) return '#e74c3c';
  if (value < 85) return '#f1c40f';
  return '#2ecc71';
};

const getOverallAverage = () => {
  const sum = healthData.reduce((acc, item) => acc + item.value, 0);
  return Math.round(sum / healthData.length);
};

const OverallHealthPanel = () => {
  const avg = getOverallAverage();
  const angleDeg = (avg / 100) * 180; // map 0-100% to 0-180 degrees

  const radius = 80;
  const centerX = 100;
  const centerY = 100;

  const needleLength = radius - 10;
  const needleAngleRad = (Math.PI * (angleDeg - 180)) / 180;

  const needleX = centerX + needleLength * Math.cos(needleAngleRad);
  const needleY = centerY + needleLength * Math.sin(needleAngleRad);

  return (
    <div
      style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      {/* Gauge */}
      <div style={{ width: 220, height: 120, marginRight: 20 }}>
        <svg width="100%" height="100%" viewBox="0 0 200 120">
          {/* Gradient arc */}
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

          {/* Ticks (optional) */}
          {[0, 25, 50, 75, 100].map((val) => {
            const deg = (val / 100) * 180;
            const rad = ((deg - 180) * Math.PI) / 180;
            const x1 = centerX + Math.cos(rad) * (radius - 5);
            const y1 = centerY + Math.sin(rad) * (radius - 5);
            const x2 = centerX + Math.cos(rad) * (radius + 5);
            const y2 = centerY + Math.sin(rad) * (radius + 5);
            return (
              <line
                key={val}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#ccc"
                strokeWidth="2"
              />
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

          {/* Percentage Text */}
          <text
            x={centerX}
            y={65}
            textAnchor="middle"
            fontSize="20"
            fontWeight="bold"
            fill={getColor(avg)}
          >
            {avg}%
          </text>
        </svg>
      </div>

      {/* Health Bars */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '10px' }}>
          Overall Health
        </div>
        {healthData.map((item, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</div>
            <div
              style={{
                background: '#ddd',
                borderRadius: 4,
                overflow: 'hidden',
                height: '10px',
                marginTop: '2px',
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
            <div style={{ fontSize: '11px', color: '#555' }}>{item.value}%</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverallHealthPanel;