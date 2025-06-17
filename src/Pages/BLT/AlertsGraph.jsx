import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';

const data = [
  { name: 'Charge', alerts: 12 },
  { name: 'Valve', alerts: 8 },
  { name: 'Cooling', alerts: 15 },
  { name: 'Hydraulic', alerts: 6 },
];

// Get hover color based on alert level
const getHoverColor = (value) => {
  if (value >= 12) return '#e74c3c';     // High alert - Red
  if (value >= 8) return '#f39c12';      // Moderate - Orange
  return '#2ecc71';                      // Low - Green
};

const AlertsGraph = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div style={{
      width: 500,
      height: 300,
      background: '#ffffff',
      padding: '10px',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      color: '#002147'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barSize={40}
          onMouseLeave={() => setActiveIndex(null)}
          margin={{ top: 10, right: 10, bottom: 10, left: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#002147" tick={{ fill: '#002147' }} />
          <YAxis
            stroke="#002147"
            tick={{ fill: '#002147' }}
            label={{
              value: 'No. of Open Alerts',
              angle: -90,
              position: 'insideLeft',
              dy: 20,
              style: { fill: '#002147' }
            }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#f0f8ff', color: '#002147' }}
            formatter={(value) => [`${value} Alerts`, '']}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />
          <Bar
            dataKey="alerts"
            onMouseOver={(_, index) => setActiveIndex(index)}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={activeIndex === index ? getHoverColor(entry.alerts) : '#003366'} // ✅ Dark blue default
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlertsGraph;
