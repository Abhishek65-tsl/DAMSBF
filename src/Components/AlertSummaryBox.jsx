import React from 'react';

const AlertSummaryBox = ({ style }) => {
  return (
    <div style={{ ...style, width: '400px' }}>
      {/* Three lines on top */}
      <div style={{ fontStyle: 'italic', color: '#0096FF', fontSize: '18px', marginBottom: '2px' }}>
        Recent Alarm
      </div>
      <div style={{ fontStyle: 'italic', color: '#003366', fontSize: '14px', marginBottom: '2px' }}>
        RV1 open time : RV2 open response time
      </div>
      <div style={{ fontStyle: 'italic', color: '#003366', fontSize: '14px', marginBottom: '6px' }}>
        USV1 opening time : USV2 open response time
      </div>

      {/* Original alert summary box */}
      <div
        style={{
          display: 'flex',
          height: '40px',         // small height
          fontSize: '12px',       // small font
          fontWeight: '600',
          color: 'white',
          borderRadius: '6px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: '#4caf50', // green
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          434 Total Alerts
        </div>

        <div
          style={{
            backgroundColor: '#81d4fa', // light blue
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',             // dark text on light bg
          }}
        >
          39 Open Alerts
        </div>

        <div
          style={{
            backgroundColor: '#fdd835', // yellow
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',             // dark text on light bg
          }}
        >
          395 Closed Alert
        </div>

        <div
          style={{
            backgroundColor: '#cfd8dc', // light grey
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',             // dark text on light bg
          }}
        >
          0 Ack Alert
        </div>
      </div>
    </div>
  );
};

export default AlertSummaryBox;
