import React from 'react';
import { Box, Typography } from '@mui/material';

const AlertBarGraph = ({
  data = [
    { name: 'Charge', value: 7 },
    { name: 'Valve', value: 3 },
    { name: 'Cooling', value: 5 },
    { name: 'Hydraulic', value: 9 },
  ],
  maxValue = 10,
}) => {
  const yTicks = Array.from({ length: maxValue / 2 + 1 }, (_, i) => i * 2).reverse();
  const chartHeight = 160;

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: '#fff',
        boxShadow: 2,
        width: '100%',
        height: 240,
        overflow: 'hidden',
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 1, color: '#333', textAlign: 'center' }}
      >
        ALERT SECTION
      </Typography>

      <Box sx={{ display: 'flex', height: chartHeight }}>
        {/* Y-axis ticks */}
        <Box
          sx={{
            width: 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            mr: 1,
          }}
        >
          {yTicks.map((tick, i) => (
            <Typography
              key={i}
              sx={{
                fontSize: 10,
                height: `${100 / yTicks.length}%`,
                color: '#333',
              }}
            >
              {tick}
            </Typography>
          ))}
        </Box>

        {/* Y-axis line */}
        <Box
          sx={{
            borderLeft: '2px solid #555',
            height: '100%',
            mr: 1,
          }}
        />

        {/* Graph bars */}
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
            borderBottom: '2px solid #555',
            ml: -2,
            position: 'relative',
          }}
        >
          {data.map(({ value }, index) => {
            const height = (value / maxValue) * chartHeight;

            return (
              <Box
                key={index}
                sx={{
                  textAlign: 'center',
                  width: 60,
                }}
              >
                <Box
                  sx={{
                    height: `${height}px`,
                    width: 28,
                    backgroundColor: '#1976d2',
                    borderRadius: '6px 6px 0 0',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    mx: 'auto',
                  }}
                >
                  {value}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* X-axis labels */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          mt: 1,
          ml: 4,
        }}
      >
        {data.map(({ name }, idx) => (
          <Typography
            key={idx}
            variant="caption"
            sx={{ fontSize: 11, color: '#1976d2', width: 55, textAlign: 'center' }}
          >
            {name}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default AlertBarGraph;