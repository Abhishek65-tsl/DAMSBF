
import React from "react";
import "react-circular-progressbar/dist/styles.css";

// System metrics
const systems = [
  { name: "Charge", value: 85, color: "#4caf50" },
  { name: "Valve", value: 55, color: "#ffeb3b" },
  { name: "Cooling", value: 30, color: "#f44336" },
  { name: "Hydraulic", value: 70, color: "#4caf50" },
];

// Improved Gauge component
const Gauge = ({ value }) => {
  const angle = (value / 100) * 180;
  const centerX = 100;
  const centerY = 100;
  const needleLength = 60;

  const rad = ((angle - 180) * Math.PI) / 180;
  const needleX = centerX + needleLength * Math.cos(rad);
  const needleY = centerY + needleLength * Math.sin(rad);

  return (

    <svg
      width="100%"
      height="110"
      viewBox="0 0 210 110"
      style={{ display: "block", zIndex: "1000" }}
    >
      <defs>
        <radialGradient id="gaugeBackground" cx="50%" cy="90%" r="80%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#f0f0f0" />
        </radialGradient>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e74c3c" />
          <stop offset="50%" stopColor="#f1c40f" />
          <stop offset="100%" stopColor="#2ecc71" />
        </linearGradient>
      </defs>

      <path
        d={`M ${centerX - 80},${centerY} A 80 80 0 0 1 ${
          centerX + 80
        },${centerY}`}
        fill="url(#gaugeBackground)"
        stroke="#ccc"
        strokeWidth="1"
      />

      <path
        d={`M ${centerX - 80},${centerY} A 80 80 0 0 1 ${
          centerX + 80
        },${centerY}`}
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
        const labelX = centerX + 54 * Math.cos(tickRad);
        const labelY = centerY + 54 * Math.sin(tickRad) - 2;

        return (
          <g key={tick}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#555"
              strokeWidth="2"
            />
            <text
              x={labelX}
              y={labelY}
              fontSize="10"
              textAnchor="middle"
              fill="#333"
            >
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
        stroke="#e91e63"
        strokeWidth="3"
        style={{ transition: "all 0.5s ease-out" }}
      />
      <circle
        cx={centerX}
        cy={centerY}
        r="6"
        fill="#e91e63"
        stroke="#333"
        strokeWidth="1.5"
      />
    </svg>
  );
};

// Main panel
const VisualizationPanel = () => {
  const overallHealth = 80; // Update dynamically if needed


  return (
    <div
      style={{

        width: "90%",
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: "1",
        fontFamily: "sans-serif",
        height: "460px",
      }}
    >
      {/* Overall Health Gauge */}
      <div style={{ width: "100%", height: 150 }}>
        <h2
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#333",
            textAlign: "center",
            marginBottom: "2px",
            justifyItems: "center",
            display: "flex",
            alignItems: "center",
            marginLeft: "90px",
            width: "100%",
            position: "relative",
          }}
        >
          Overall Health
        </h2>
        <Gauge value={overallHealth} />
      </div>

      {/* System-wise Health */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

        {systems.map((sys, index) => (
          <div
            key={index}
            style={{

              backgroundColor: "#f9f9f9",
              padding: "14px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              minHeight: "48px",
              fontSize: "12px",
              marginBottom: "4px",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontWeight: "600",
                color: "#444",
              }}
            >
              <span>{sys.name}</span>
              <span>{sys.value}%</span>
            </div>

            <div
              style={{
                marginTop: "4px",
                height: "6px",
                width: "100%",
                borderRadius: "6px",
                backgroundColor: "#ddd",
              }}
            >
              <div
                style={{
                  height: "6px",
                  width: `${sys.value}%`,
                  borderRadius: "6px",
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
