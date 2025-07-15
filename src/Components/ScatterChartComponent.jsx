// src/Components/ScatterChartComponent.jsx
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Box } from '@mui/material';

const sampleData = [
  { x: '2025-07-03 21:20', y: 1, status: 'Stop' },
  { x: '2025-07-04 08:00', y: 1, status: 'Stop' },
  { x: '2025-07-04 10:00', y: 1, status: 'Load' },
  { x: '2025-07-04 12:00', y: 1, status: 'Missing' },
  { x: '2025-07-04 14:00', y: 1, status: 'Safe' },
  { x: '2025-07-04 16:00', y: 1, status: 'Others' },
];

// Red circular dots fully covering the x-axis at y = 2
const redLineDots = [
  { x: '2025-07-03 20:00', y: 2 },
  { x: '2025-07-03 21:00', y: 2 },
  { x: '2025-07-04 00:00', y: 2 },
  { x: '2025-07-04 02:00', y: 2 },
  { x: '2025-07-04 04:00', y: 2 },
  { x: '2025-07-04 06:00', y: 2 },
  { x: '2025-07-04 08:00', y: 2 },
  { x: '2025-07-04 10:00', y: 2 },
  { x: '2025-07-04 12:00', y: 2 },
  { x: '2025-07-04 14:00', y: 2 },
  { x: '2025-07-04 16:00', y: 2 },
  { x: '2025-07-04 18:00', y: 2 },
  { x: '2025-07-04 20:00', y: 2 },
  { x: '2025-07-04 22:00', y: 2 },
];

const colorMap = {
  Safe: '#4caf50',
  Alert: '#ff9800',
  Stop: '#f44336',
  Load: '#00e676',
  'No Load': '#8bc34a',
  Missing: '#9e9e9e',
  Others: '#00acc1',
};

const customLegendItems = [
  { label: 'Safe', color: '#4caf50', shape: 'rect' },
  { label: 'Alert', color: '#ff9800', shape: 'rect' },
  { label: 'Stop', color: '#f44336', shape: 'rect' },
  { label: 'Load', color: '#00e676', shape: 'circle' },
  { label: 'No Load', color: '#8bc34a', shape: 'square' },
  { label: 'Missing', color: '#9e9e9e', shape: 'circle', small: true },
  { label: 'Others', color: '#00acc1', shape: 'triangle' },
];

const renderLegend = () => (
  <Box display="flex" flexWrap="wrap" gap={2} mb={1}>
    {customLegendItems.map((item) => (
      <Box key={item.label} display="flex" alignItems="center" gap={1}>
        <div
          style={{
            width: item.small ? 8 : 12,
            height: item.small ? 8 : 12,
            backgroundColor: item.color,
            clipPath:
              item.shape === 'circle'
                ? 'circle(50%)'
                : item.shape === 'square'
                ? 'none'
                : item.shape === 'triangle'
                ? 'polygon(50% 0%, 0% 100%, 100% 100%)'
                : 'none',
          }}
        />
        <span style={{ fontSize: 12 }}>{item.label}</span>
      </Box>
    ))}
  </Box>
);

const ScatterChartComponent = () => {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      {renderLegend()}
      <Box minWidth={1000}>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart margin={{ top: 10, right: 30, bottom: 50, left: 30 }}>
            <CartesianGrid />
            <XAxis
              dataKey="x"
              name="Time"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis
              dataKey="y"
              name="Flag"
              type="number"
              domain={[0, 2]}
              ticks={[0, 1, 2]}
              label={{
                value: 'Flag',
                angle: -90,
                position: 'insideLeft',
                offset: 10,
              }}
            />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />

            {/* Red dots as horizontal dotted line at y = 2 */}
            <Scatter
              name="Red Circles Line"
              data={redLineDots}
              fill="red"
              shape="circle"
            />

            {/* Main data points */}
            {Object.keys(colorMap).map((status) => (
              <Scatter
                key={status}
                name={status}
                data={sampleData.filter((d) => d.status === status)}
                fill={colorMap[status]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ScatterChartComponent;