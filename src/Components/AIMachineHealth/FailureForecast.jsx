import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';

const PANEL_HEIGHT = 420;

export default function FailureForecast({ predictedFailures, isLight = false }) {
  const scrollNeeded = (predictedFailures?.length || 0) > 4;

  return (
    <Card sx={{ height: '100%', minHeight: PANEL_HEIGHT, maxHeight: PANEL_HEIGHT }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>Failure Forecast</Typography>
        <div
          style={{
            flex: 1,
            overflowY: scrollNeeded ? 'auto' : 'visible',
            paddingRight: scrollNeeded ? 4 : 0
          }}
        >
          <Stack spacing={2}>
            {predictedFailures.map((item) => (
              <div key={`${item.component}-${item.eta}`}>
                <Typography variant="subtitle2">{item.component} ({item.eta})</Typography>
                <LinearProgress
                  variant="determinate"
                  value={item.risk}
                  sx={{
                    height: 10,
                    borderRadius: 6,
                    my: 0.7,
                    backgroundColor: isLight ? 'rgba(148,163,184,0.22)' : 'rgba(148,163,184,0.28)',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 6,
                      background: isLight
                        ? 'linear-gradient(90deg, #60a5fa, #22c55e, #f59e0b, #ef4444)'
                        : 'linear-gradient(90deg, #2563eb, #22c55e, #f59e0b, #ef4444)',
                      boxShadow: isLight ? '0 0 12px rgba(37,99,235,0.3)' : '0 0 12px rgba(56,189,248,0.34)'
                    }
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Risk: {item.risk}% | Model confidence: {Math.round(item.confidence * 100)}%
                </Typography>
              </div>
            ))}
          </Stack>
        </div>
      </CardContent>
    </Card>
  );
}
