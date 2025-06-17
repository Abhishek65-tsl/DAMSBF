import React from 'react';

const AlertSummaryBox = ({ style }) => {
  return (
    <div style={{ ...style, width: '450px' }}>
      {/* Header Lines */}
      <div style={{ fontStyle: 'italic', color: '#0096FF', fontSize: '16px', marginBottom: '2px' }}>
        🚨 Recent Alarm
      </div>
      <div style={{ fontStyle: 'italic', color: '#003366', fontSize: '13px', marginBottom: '1px' }}>
        🕒 RV1 open time : RV2 open response time
      </div>
      <div style={{ fontStyle: 'italic', color: '#003366', fontSize: '13px', marginBottom: '6px' }}>
        🔧 USV1 opening time : USV2 open response time
      </div>

      {/* Summary Row */}
      <div
        style={{
          display: 'flex',
          height: '40px',
          fontSize: '11.5px',
          fontWeight: '600',
          borderRadius: '6px',
          overflow: 'hidden',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(to right, #2e7d32, #66bb6a)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          ✅ 434 Total
        </div>
        <div
          style={{
            background: 'linear-gradient(to right, #4fc3f7, #81d4fa)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
          }}
        >
          🟦 39 Open
        </div>
        <div
          style={{
            background: 'linear-gradient(to right, #fbc02d, #fff176)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
          }}
        >
          🟨 395 Closed
        </div>
        <div
          style={{
            background: 'linear-gradient(to right, #cfd8dc, #eceff1)',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
          }}
        >
          🔕 0 Ack
        </div>
      </div>
    </div>
  );
};

export default AlertSummaryBox;
