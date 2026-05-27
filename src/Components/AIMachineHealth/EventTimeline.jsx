import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';

const severityColor = {
  Low: 'default',
  Medium: 'warning',
  High: 'error',
  Critical: 'error'
};

const PANEL_HEIGHT = 420;

export default function EventTimeline({ anomalies }) {
  const scrollNeeded = (anomalies?.length || 0) > 4;

  return (
    <Card sx={{ height: '100%', minHeight: PANEL_HEIGHT, maxHeight: PANEL_HEIGHT }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 1.5 }}>Anomaly Timeline</Typography>
        <div
          style={{
            flex: 1,
            overflowY: scrollNeeded ? 'auto' : 'visible',
            paddingRight: scrollNeeded ? 4 : 0
          }}
        >
          <Stack spacing={1.5}>
            {anomalies.map((item) => (
              <div key={item.id}>
                <Typography variant="subtitle2">{item.type}</Typography>
                <Typography variant="body2" color="text.secondary">{new Date(item.timestamp).toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ my: 0.4 }}>{item.message}</Typography>
                <Chip label={`${item.severity} | ${Math.round(item.confidence * 100)}%`} color={severityColor[item.severity] || 'default'} size="small" />
              </div>
            ))}
          </Stack>
        </div>
      </CardContent>
    </Card>
  );
}
