import React, { useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import furnaceImage from '../assets/furnace.jpg';
import OM from '../Components/om';
import OLP from '../Components/olp';
import AlertBarGraph from '../Components/AGraph';
import TrendAnalysisModal from '../Components/TrendAnalysisModal';
import RecentAlarm from '../Components/ra';

const leftParameters = Array.from({ length: 16 }, (_, i) => ({
  name: `Flow -${i + 1}`,
  value: [7889.87, 6701.732, 7262.129, 7649.606, 8293.676, 8992.793, 8622.951, 8310.729,
    9763.552, 10265.399, 9088.56, 90277.053, 9935.867, 8322.24, 9884.333, 'NA'][i],
  unit: '', ucl: 120000, lcl: 0,
}));

const centerParameters = [
  { name: 'Flow -33', value: 9876.87 }, { name: 'Flow -34', value: 8654.76 },
  { name: 'Flow -35', value: 6135.654 }, { name: 'Flow -36', value: 8867.654 },
  { name: 'Flow -37', value: 7654.234 }, { name: 'Flow -38', value: 6033.1081 },
].map(p => ({ ...p, unit: '', ucl: 120000, lcl: 0 }));

const rightParameters = Array.from({ length: 16 }, (_, i) => ({
  name: `Flow -${i + 17}`,
  value: [8914.418, 9779.167, 9073.252, 6387.459, 9007.877, 11145.286, 9492.907, 7714.052,
    9825.597, 10232.989, 8427.223, 'NA', 11178.361, 7242.65, 7824.807, 9006.54][i],
  unit: '', ucl: 120000, lcl: 0,
}));

const getCustomCardStyle = (index, name) => {
  if (['Flow -33', 'Flow -36', 'Flow -38'].includes(name)) {
    return {
      backgroundColor: '#e0f7fa',
      border: '1px solid #4db6ac',
      progressColor: '#26a69a',
    };
  }

  if (index === 2 || index === 6) {
    return {
      backgroundColor: '#ffe6e6',
      border: '1px solid #ff4d4f',
      progressColor: '#f44336',
    };
  }

  if (index % 2 === 0) {
    return {
      backgroundColor: '#e0f7fa',
      border: '1px solid #4db6ac',
      progressColor: '#26a69a',
    };
  } else {
    return {
      backgroundColor: '#fff8e1',
      border: '1px solid #fbc02d',
      progressColor: '#fbc02d',
    };
  }
};

const ParameterCard = ({ name, value, unit, ucl, lcl, onClick, index }) => {
  const numericValue = value === 'NA' ? 0 : parseFloat(value);
  const progress = value === 'NA' ? 0 : Math.min(100, Math.round(((numericValue - lcl) / (ucl - lcl)) * 100));
  const style = getCustomCardStyle(index, name);

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
        color: '#444',
        width: '100%',
        minHeight: 68,
        cursor: 'pointer',
        '&:hover': { transform: 'scale(1.01)' },
      }}
    >
      <Typography variant="body2" fontWeight={600}>{name}</Typography>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 0.3, fontSize: 14 }}>
        {value} {unit}
      </Typography>
      <Box sx={{ mt: 0.2, display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#444' }}>
        <span>Progress</span>
        <span>{progress}%</span>
      </Box>
      <Box sx={{ height: 4, borderRadius: 4, backgroundColor: '#ddd', mt: 0.3 }}>
        <Box sx={{
          height: '100%',
          borderRadius: 4,
          backgroundColor: style.progressColor,
          width: `${progress}%`,
          transition: 'width 0.3s ease-in-out',
        }} />
      </Box>
    </Paper>
  );
};

const HotBlast = () => {
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (param) => {
    setSelectedParameter({ title: param.name });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Box p={2}>
      <Box sx={{ backgroundColor: '#f0f0f0', px: 2, py: 0.5, borderRadius: 2, mb: 2 }}>
        <Typography variant="h5" fontWeight="bold">HOT BLAST SYSTEM</Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Left Parameters */}
        <Grid item xs={12} md={3}>
          <Box sx={{ maxWidth: 300, width: '100%' }}>
            <Box sx={{ border: '1px solid #aaa', borderRadius: 2, p: 1 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>PARAMETERS</Typography>
              {leftParameters.map((param, i) => (
                <ParameterCard key={i} {...param} onClick={() => handleCardClick(param)} index={i} />
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Center Content */}
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
            {/* Operation and Maintenance */}
            <Box
              sx={{
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

            {/* Furnace Image */}
            <Box
              component="img"
              src={furnaceImage}
              alt="Furnace Diagram"
              sx={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: 2,
                mb: 2,
              }}
            />

            {/* Center Parameters - placed below image */}
            <Box sx={{ border: '1px solid #aaa', borderRadius: 2, p: 2, mt: 'auto', width: '100%' }}>
              <Grid container spacing={2}>
                {centerParameters.map((param, index) => (
                  <Grid item xs={6} sm={6} md={3} key={index}>
                    <ParameterCard {...param} onClick={() => handleCardClick(param)} index={index} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Grid>

        {/* Right Parameters */}
        <Grid item xs={12} md={2.5}>
          <Box sx={{ maxWidth: 300, width: '100%' }}>
            <Box sx={{ border: '1px solid #aaa', borderRadius: 2, p: 1, mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>PARAMETERS</Typography>
              {rightParameters.map((param, i) => (
                <ParameterCard key={i} {...param} onClick={() => handleCardClick(param)} index={i} />
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Alerts & Health */}
        <Grid item xs={12} md={2.5}>
          <Box sx={{ maxWidth: 300, width: '100%' }}>
            <Box sx={{ mb: 2 }}>
              <OLP />
            </Box>
            <Box sx={{ mb: 2 }}>
              <AlertBarGraph />
            </Box>
            <Box>
              <RecentAlarm
                alerts={[
                  'Hot blast Flow anomaly at tuyere region',
                  'Cold blast mismatch in injection profile',
                ]}
                alertCounts={{ total: 321, open: 24, closed: 297, ack: 0 }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      <TrendAnalysisModal isOpen={isModalOpen} onClose={handleCloseModal} parameter={selectedParameter} />
    </Box>
  );
};

export default HotBlast;