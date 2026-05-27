import { Button, Card, CardContent, Typography } from '@mui/material';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceDot
} from 'recharts';

function TooltipContent({ active, payload, label, isLight }) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div
      style={{
        background: isLight ? 'rgba(255,255,255,0.96)' : 'rgba(2, 6, 23, 0.96)',
        border: isLight ? '1px solid rgba(148,163,184,0.3)' : '1px solid rgba(148,163,184,0.45)',
        borderRadius: 10,
        padding: '8px 10px',
        boxShadow: '0 8px 18px rgba(2,6,23,0.25)',
        transition: 'all 180ms ease'
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.9 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{p.name}: {p.value}</div>
    </div>
  );
}

export default function SensorChart({ title, data, dataKey, color = '#1976d2', isLight = false, onOpenGraph }) {
  const chartData = data.map((point) => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }));
  const chartText = isLight ? '#516b84' : '#f1f5f9';
  const chartGrid = isLight ? 'rgba(148, 163, 184, 0.24)' : 'rgba(148, 163, 184, 0.45)';
  const gradientId = `ai-grad-${dataKey}`;
  const glowId = `ai-glow-${dataKey}`;
  const lastPoint = chartData[chartData.length - 1];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{title}</Typography>
            <span className="ai-live-pill">
              <span className="ai-live-dot" /> LIVE
            </span>
          </div>
          {onOpenGraph ? (
            <Button size="small" variant="outlined" onClick={onOpenGraph}>
              Open graph
            </Button>
          ) : null}
        </div>
        <div
          style={{ width: '100%', height: 220, cursor: onOpenGraph ? 'pointer' : 'default' }}
          onDoubleClick={onOpenGraph}
          role={onOpenGraph ? 'button' : undefined}
          tabIndex={onOpenGraph ? 0 : undefined}
          onKeyDown={onOpenGraph ? (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpenGraph();
            }
          } : undefined}
          aria-label={onOpenGraph ? `${title} graph preview` : undefined}
        >
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 12, right: 14, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.34} />
                  <stop offset="85%" stopColor={color} stopOpacity={0.03} />
                </linearGradient>
                <filter id={glowId}>
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
              <XAxis dataKey="time" tick={{ fill: chartText, fontSize: 11 }} axisLine={{ stroke: chartGrid }} tickLine={{ stroke: chartGrid }} />
              <YAxis tick={{ fill: chartText, fontSize: 11 }} axisLine={{ stroke: chartGrid }} tickLine={{ stroke: chartGrid }} width={42} />
              <Tooltip
                content={<TooltipContent isLight={isLight} />}
                cursor={false}
              />
              <Area type="monotone" dataKey={dataKey} stroke="none" fill={`url(#${gradientId})`} />
              <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={8} strokeOpacity={0.16} dot={false} isAnimationActive animationDuration={900} />
              <Line type="monotone" dataKey={dataKey} name={title} stroke={color} strokeWidth={3} dot={false} filter={`url(#${glowId})`} isAnimationActive animationDuration={900} />
              {lastPoint ? (
                <ReferenceDot
                  x={lastPoint.time}
                  y={lastPoint[dataKey]}
                  r={5}
                  fill={color}
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              ) : null}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
