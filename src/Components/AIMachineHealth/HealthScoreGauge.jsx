import { Card, CardContent, Typography } from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const PANEL_HEIGHT = 420;
const GAUGE_SIZE = 186;

export default function HealthScoreGauge({ score, status }) {
  const pathColor = score >= 75 ? '#2e7d32' : score >= 45 ? '#ed6c02' : '#d32f2f';

  return (
    <Card sx={{ height: '100%', minHeight: PANEL_HEIGHT, maxHeight: PANEL_HEIGHT }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>Health Meter (0-100)</Typography>
        <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
          <div style={{ width: GAUGE_SIZE, height: GAUGE_SIZE, maxWidth: '100%' }}>
            <CircularProgressbar
              value={score}
              text={`${score}`}
              styles={buildStyles({
                pathColor,
                textColor: '#111',
                trailColor: '#eee'
              })}
            />
          </div>
        </div>
        <Typography variant="body1" align="center" sx={{ mt: 1.2, fontWeight: 600 }}>{status}</Typography>
      </CardContent>
    </Card>
  );
}
