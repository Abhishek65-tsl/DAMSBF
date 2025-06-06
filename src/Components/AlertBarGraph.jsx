import React from 'react';

const AlertBarGraph = ({
  data = [
    { name: 'Charge', value: 70 },
    { name: 'Valve', value: 30 },
    { name: 'Cooling', value: 50 },
    { name: 'Hydraulic', value: 90 },
  ],
  width = 400,
  height = 250,
}) => {
  const maxValue = 10;
  const graphHeight = height - 60;
  const barWidth = (width - 100) / data.length - 10;

  return (
    <div
      style={{
        width,
        height: height + 60,
        padding: 20,
        boxSizing: 'border-box',
        fontFamily: 'sans-serif',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Y-axis Label */}
      <div
        style={{
          position: 'absolute',
          top: '70%',
          left: 40,
          transform: 'translate(-50%, -50%) rotate(-90deg)',
          transformOrigin: 'left center',
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333',
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        No. of Open Alerts
      </div>

      {/* Y-axis Ticks and Bars Container */}
      <div
        style={{
          position: 'relative',
          height: graphHeight + 10,
          marginBottom: 20,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          paddingLeft: 40,
          paddingBottom: 10,
        }}
      >
        {/* Y-axis Line */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            bottom: 11,
            width: 2,
            height: graphHeight,
            backgroundColor: '#333',
          }}
        />

        {/* X-axis Line */}
        <div
          style={{
            position: 'absolute',
            left: 21,
            bottom: 10,
            height: 2,
            width: width - 60,
            backgroundColor: '#333',
          }}
        />

        {/* Y-axis Tick Values */}
        <div
          style={{
            position: 'absolute',
            left: -25,
            bottom: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: '#666',
            fontSize: 12,
            userSelect: 'none',
            pointerEvents: 'none',
            textAlign: 'right',
          }}
        >
          {[10, 8, 6, 4, 2, 0].map((val) => (
            <div key={val} style={{ lineHeight: 1 }}>{val}</div>
          ))}
        </div>

        {/* Bars */}
        {data.map(({ name, value }) => {
          const barHeight = (value / maxValue) * graphHeight || 0;

          return (
            <div
              key={name}
              style={{
                width: barWidth,
                height: graphHeight,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: barHeight,
                  width: '100%',
                  backgroundColor: '#1e40af',
                  borderRadius: 4,
                  transition: 'height 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 14,
                  userSelect: 'none',
                }}
                title={`${name}: ${value}`}
              >
                {value}
              </div>
            </div>
          );
        })}
      </div>

      {/* X-axis Labels */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          paddingLeft: 40,
          paddingRight: 20,
        }}
      >
        {data.map(({ name }) => (
          <div
            key={name}
            style={{
              width: barWidth,
              textAlign: 'center',
              fontSize: 14,
              color: '#1e40af',
              userSelect: 'none',
            }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* X-axis Label */}
      <div
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 14,
          color: '#333',
          userSelect: 'none',
          marginTop: 20,
        }}
      >
        Alert Section
      </div>
    </div>
  );
};

export default AlertBarGraph;
