import { Card, CardContent, Chip, LinearProgress, Typography } from '@mui/material';

const statusColor = {
  Healthy: 'success',
  Warning: 'warning',
  Critical: 'error'
};

export default function HealthCard({ title, value, unit, status, subtitle, progress, trendDirection, sparklineData = [] }) {
  const arrow = trendDirection === 'up' ? '↑' : trendDirection === 'down' ? '↓' : '→';
  const arrowColor = trendDirection === 'up' ? '#ef4444' : trendDirection === 'down' ? '#22c55e' : '#94a3b8';
  const points = sparklineData.length
    ? (() => {
      const min = Math.min(...sparklineData);
      const max = Math.max(...sparklineData);
      const range = Math.max(1, max - min);
      return sparklineData
        .map((v, i) => {
          const x = (i / Math.max(1, sparklineData.length - 1)) * 110;
          const y = 24 - ((v - min) / range) * 18;
          return `${x},${y}`;
        })
        .join(' ');
    })()
    : '';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="overline" color="text.secondary">{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
          {value} {unit ? <Typography component="span" variant="h6" color="text.secondary">{unit}</Typography> : null}
        </Typography>
        {typeof progress === 'number' ? (
          <LinearProgress
            variant="determinate"
            value={Math.max(0, Math.min(100, progress))}
            sx={{
              mt: 1.1,
              mb: 0.2,
              height: 8,
              borderRadius: 999,
              backgroundColor: 'rgba(148,163,184,0.25)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999,
                background: 'linear-gradient(90deg, #22c55e, #f59e0b, #ef4444)'
              }
            }}
          />
        ) : null}
        {subtitle ? <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>{subtitle}</Typography> : null}
        {status ? <Chip label={status} color={statusColor[status] || 'default'} size="small" sx={{ mt: 1.2 }} /> : null}
        {sparklineData.length ? (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg viewBox="0 0 110 24" style={{ width: 110, height: 24 }}>
              <polyline fill="none" stroke="#38bdf8" strokeWidth="2" points={points} />
            </svg>
            <Typography variant="caption" sx={{ color: arrowColor, fontWeight: 700 }}>{arrow}</Typography>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
