import React, { useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import furnaceImage from '../assets/furnace.jpg';
import OM from '../Components/om';
import OLP from '../Components/olp';
import AlertBarGraph from '../Components/AGraph';
import TrendAnalysisModal from '../Components/TrendAnalysisModal';
import RecentAlarm from '../Components/ra';

// Utility: generate 6 unique random indices for red boxes
const getRandomRedIndices = (length) => {
  const redIndices = new Set();
  while (redIndices.size < 6) {
    redIndices.add(Math.floor(Math.random() * length));
  }
  return Array.from(redIndices);
};

const TuyereNose = () => {
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (name) => {
    setSelectedParameter({ title: name });
    setIsModalOpen(true);
  };

  const leftParameters = [
    { name: 'Flow-1', value: 474.8, unit: 'LPM', ucl: 3.0, lcl: 1.5 },
    { name: 'Flow-2', value: 701.76, unit: 'LPM', ucl: 2, lcl: 0 },
    { name: 'Flow-3', value: 208.848, unit: 'LPM', ucl: 30000000, lcl: 10000000 },
    { name: 'Flow-4', value: 518.54, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-5', value: 888.543, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-6', value: 317.543, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-7', value: 962239, unit: 'LPM', ucl: 4.5, lcl: 2.0 },
    { name: 'Flow-8', value: 230.76, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-9', value: 603.57, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-10', value: 800.28, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-11', value: 485.432, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-12', value: 563.72, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-13', value: 900.53, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-14', value: 395.52, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-15', value: 257.44, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-16', value: 754.86, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-17', value: 489.678, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-18', value: 782.56, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-19', value: 452.98, unit: 'LPM', ucl: 1, lcl: 0 },
  ];

  const rightParameters = [
    { name: 'Flow-1', value: 474.8, unit: 'LPM', ucl: 3.0, lcl: 1.5 },
    { name: 'Flow-2', value: 701.76, unit: 'LPM', ucl: 2, lcl: 0 },
    { name: 'Flow-3', value: 808.848, unit: 'LPM', ucl: 30000000, lcl: 10000000 },
    { name: 'Flow-4', value: 718.54, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-5', value: 688.543, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-6', value: 717.543, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-7', value: 662239, unit: 'LPM', ucl: 4.5, lcl: 2.0 },
    { name: 'Flow-8', value: 630.76, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-9', value: 603.57, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-10', value: 800.28, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-11', value: 485.432, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-12', value: 663.72, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-13', value: 400.53, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-14', value: 695.52, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-15', value: 757.44, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-16', value: 454.86, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-17', value: 789.678, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-18', value: 482.56, unit: 'LPM', ucl: 1, lcl: 0 },
    { name: 'Flow-19', value: 652.98, unit: 'LPM', ucl: 1, lcl: 0 },
  ];

  const totalCards = leftParameters.length + rightParameters.length;
  const redCardIndices = getRandomRedIndices(totalCards);

  const ParameterCard = ({ name, value, unit, ucl, lcl, onClick, index }) => {
    let backgroundColor = index % 2 === 0 ? '#e0f7fa' : '#fff8e1'; // odd: green, even: yellow
    if (redCardIndices.includes(index)) backgroundColor = '#ffe6e6'; // random red

    return (
      <Paper
        onClick={onClick}
        elevation={1}
        sx={{
          px: 1.5,
          py: 1,
          mb: 1,
          borderRadius: 1.5,
          backgroundColor,
          border: '1px solid #ccc',
          width: '100%',
          minHeight: 68,
          cursor: 'pointer',
          '&:hover': { transform: 'scale(1.01)' },
        }}
      >
        <Typography variant="body2" fontWeight={600}>{name}</Typography>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 0.3, fontSize: 14 }}>
          {`${value} ${unit}`}
        </Typography>
      </Paper>
    );
  };

  return (
    <Box p={2}>
      <Box sx={{ backgroundColor: '#f0f0f0', px: 2, py: 0.5, borderRadius: 2, mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">TUYERE NOSE SYSTEM-1</Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Left */}
        <Grid item xs={12} md={3}>
          <Box sx={{ border: '1px solid #aaa', borderRadius: 2, p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>INLET FLOW</Typography>
            {leftParameters.map((param, i) => (
              <ParameterCard
                key={i}
                {...param}
                index={i}
                onClick={() => handleCardClick(param.name)}
              />
            ))}
          </Box>
        </Grid>

        {/* Center */}
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', border: '1px solid #ccc', borderRadius: 2, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 600, backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: 2, p: 1, mb: 2 }}>
              <OM />
            </Box>
            <Box component="img" src={furnaceImage} alt="Furnace" sx={{ width: '100%', maxHeight: '400px', objectFit: 'contain', borderRadius: 2 }} />
          </Box>
        </Grid>

        {/* Right */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
            <Box sx={{ flex: 1, border: '1px solid #aaa', borderRadius: 2, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>OUTLET FLOW</Typography>
              {rightParameters.map((param, i) => (
                <ParameterCard
                  key={i}
                  {...param}
                  index={i + leftParameters.length}
                  onClick={() => handleCardClick(param.name)}
                />
              ))}
            </Box>

            <Box sx={{ minWidth: 240, maxWidth: 260, display: 'flex', flexDirection: 'column' }}>
              <OLP />
              <Box sx={{ mt: 1, minHeight: 220 }}><AlertBarGraph /></Box>
              <Box sx={{ mt: 2 }}>
                <RecentAlarm
                  alerts={[
                    'RV1 open time • RV2 open response time',
                    'VSV1 opening time • USV2 open response time',
                  ]}
                  alertCounts={{ total: 434, open: 39, closed: 395, ack: 0 }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <TrendAnalysisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} parameter={selectedParameter} />
    </Box>
  );
};

export default TuyereNose;
