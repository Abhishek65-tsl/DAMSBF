import React, { useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import furnaceImage from '../assets/furnace.jpg';
import OM from '../Components/om';
import OLP from '../Components/olp';
import AlertBarGraph from '../Components/AGraph';
import TrendAnalysisModal from '../Components/TrendAnalysisModal';
import RecentAlarm from '../Components/ra';

const leftParameters = [
  { name: 'Top Gas Press', value: 2.223, unit: 'Bar', ucl: 3.0, lcl: 1.5 },
  { name: 'Steam Flow', value: 0, unit: '+0', ucl: 2, lcl: 0 },
  { name: 'Oxygen Flow', value: 20880848, unit: '', ucl: 30000000, lcl: 10000000 },
  { name: 'AG Cone-1', value: 0.518, unit: '%', ucl: 1, lcl: 0 },
  { name: 'AG Cone-2', value: 0.888, unit: '%', ucl: 1, lcl: 0 },
  { name: 'AG Cone-3', value: 0.317, unit: '%', ucl: 1, lcl: 0 },
  { name: 'Cold Blast Pressure', value: 3.962, unit: '', ucl: 4.5, lcl: 2.0 },
  { name: 'Cold Blast Flow', value: 0, unit: 'NA', ucl: 1, lcl: 0 },
];

const centerParameters = [
  { name: 'Top-1 Valve', value: 62.721, unit: '', ucl: 80, lcl: 40 },
  { name: 'Top-2 Valve', value: 0.282, unit: '', ucl: 1.0, lcl: 0 },
  { name: 'Tuyere & Asx', value: 62.121, unit: '', ucl: 100, lcl: 0 },
  { name: 'Throat Stave', value: 81.808, unit: '', ucl: 100, lcl: 0 },
];

const rightParameters = [
  { name: 'Sec Let down-1 valve', value: 18.85, unit: '', ucl: 20, lcl: 10 },
  { name: 'Sec Let down-2 valve', value: 0.191, unit: '', ucl: 2, lcl: 0 },
  { name: 'Total K', value: 2.482, unit: '', ucl: 3, lcl: 1 },
  { name: 'Furnace Radar-1', value: 0.794, unit: '', ucl: 1, lcl: 0 },
  { name: 'Furnace Radar-2', value: 0.825, unit: '', ucl: 1, lcl: 0 },
  { name: 'Furnace Stave', value: 0, unit: '', ucl: 100, lcl: 0 },
  { name: 'Tuyere Stave', value: 87.199, unit: '', ucl: 100, lcl: 0 },
  { name: 'Health Stave', value: 62.121, unit: '', ucl: 100, lcl: 0 },
];

const getCardStyles = (name, value, ucl, lcl) => {
  if (name === 'Oxygen Flow' || name === 'Furnace Radar-2') {
    return {
      backgroundColor: '#fdecea',
      border: '1px solid #f5c6cb',
      color: '#555',
    };
  }
  if (value < lcl || value > ucl) {
    return {
      backgroundColor: '#ffe6e6',
      border: '1px solid #ff4d4f',
      color: '#555',
    };
  } else if ((value - lcl) / (ucl - lcl) < 0.3) {
    return {
      backgroundColor: '#fff8e1',
      border: '1px solid #fbc02d',
      color: '#555',
    };
  } else {
    return {
      backgroundColor: '#e0f7fa',
      border: '1px solid #4db6ac',
      color: '#555',
    };
  }
};

const ParameterCard = ({ name, value, unit, ucl, lcl, onClick }) => {
  const style = getCardStyles(name, value, ucl, lcl);
  const progress = Math.min(100, Math.round(((value - lcl) / (ucl - lcl)) * 100));

  return (
    <Paper
      onClick={onClick}
      elevation={1}
      sx={{
        px: 1.5,
        py: 1,
        mb: 1,
        borderRadius: 1.5,
        backgroundColor: style.backgroundColor,
        border: style.border,
        color: style.color,
        width: '100%',
        minHeight: 68,
        cursor: 'pointer',
        '&:hover': { transform: 'scale(1.01)' },
      }}
    >
      <Typography variant="body2" fontWeight={600} sx={{ color: '#444' }}>
        {name}
      </Typography>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 0.3, fontSize: 14 }}>
        {`${value} ${unit}`}
      </Typography>
      <Box sx={{ mt: 0.2, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#444' }}>
        <span>Progress</span>
        <span>{progress}%</span>
      </Box>
      <Box sx={{ height: 4, borderRadius: 4, backgroundColor: '#ddd', mt: 0.3 }}>
        <Box
          sx={{
            height: '100%',
            borderRadius: 4,
            backgroundColor:
              name === 'Oxygen Flow' || name === 'Furnace Radar-2'
                ? '#ef5350'
                : value < lcl || value > ucl
                ? '#f44336'
                : progress < 30
                ? '#fbc02d'
                : '#26a69a',
            width: `${progress}%`,
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </Box>
    </Paper>
  );
};

const FurnaceOverview = () => {
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (name) => {
    setSelectedParameter({ title: name });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Box p={2} sx={{ pt: 0 }}>
      <Box sx={{ backgroundColor: '#f0f0f0', px: 2, py: 0.5, borderRadius: 2, mt: 0, mb: 1 }}>
        <Typography variant="h5" fontWeight="bold" color="#111">
          FURNACE OVERVIEW
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* LEFT PARAMETERS */}
        <Grid item xs={12} md={3}>
          <Box sx={{ border: '1px solid #aaa', borderRadius: 2, p: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              PARAMETERS
            </Typography>
            {leftParameters.map((param, i) => (
              <ParameterCard key={i} {...param} onClick={() => handleCardClick(param.name)} />
            ))}
          </Box>
        </Grid>

        {/* CENTER IMAGE AND CENTER PARAMETERS */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '100%',
              border: '1px solid #ccc',
              borderRadius: 2,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '600px',
            }}
          >
            <Box
              sx={{
                mt: -2,
                mb: 1.5,
                width: '100%',
                maxWidth: 600,
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: 2,
                p: 1,
              }}
            >
              <OM />
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Box
                component="img"
                src={furnaceImage}
                alt="Furnace Diagram"
                sx={{
                  width: '100%',
                  maxHeight: '400px',
                  objectFit: 'contain',
                  borderRadius: 2,
                  mt: -1.5,
                }}
              />
            </Box>

            <Box sx={{ border: '1px solid #aaa', borderRadius: 2, p: 2, mt: 2, width: '100%' }}>
              <Grid container spacing={2}>
                {centerParameters.map((param, index) => (
                  <Grid item xs={6} sm={6} md={3} key={index}>
                    <ParameterCard {...param} onClick={() => handleCardClick(param.name)} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT PARAMETERS + ALERTS */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
            <Box sx={{ flex: 1, border: '1px solid #aaa', borderRadius: 2, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                PARAMETERS
              </Typography>
              {rightParameters.map((param, i) => (
                <ParameterCard key={i} {...param} onClick={() => handleCardClick(param.name)} />
              ))}
            </Box>

            <Box sx={{ minWidth: 240, maxWidth: 260, display: 'flex', flexDirection: 'column' }}>
              <OLP />
              <Box sx={{ mt: 1, minHeight: 220 }}>
                <AlertBarGraph />
              </Box>
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

      <TrendAnalysisModal isOpen={isModalOpen} onClose={handleCloseModal} parameter={selectedParameter} />
    </Box>
  );
};

export default FurnaceOverview;