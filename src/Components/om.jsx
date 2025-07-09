import React from 'react';
import { FaCircle } from 'react-icons/fa';
import { Box, Typography } from '@mui/material';

const getStatusColor = (status) => {
  switch (status) {
    case 'Good': return '#22c55e'; // green
    case 'Fine': return '#facc15'; // yellow
    case 'Bad': return '#ef4444';  // red
    default: return '#9ca3af';     // gray
  }
};

const data = {
  operation: [
    { name: 'Wind Volume', value: '0 km3/hr', status: 'Good' },
    { name: 'Top Gas Pressure', value: '2.223 Bar', status: 'Fine' },
    { name: 'Top Gas Temp', value: '106.832 °C', status: 'Good' },
    { name: 'HBT', value: 'NA', status: 'Bad' },
    { name: 'HBP', value: 'NA', status: 'Fine' },
    { name: 'PCI Rate (Tons/hr)', value: '83.105', status: 'Good' },
    { name: 'PCI Rate (Kg/hr)', value: '202.837', status: 'Fine' },
    { name: 'Cold Blast Pressure', value: '3.052 Bar', status: 'Good' },
    { name: 'Steam Flow', value: '0+0', status: 'Fine' },
    { name: 'Oxygen Flow', value: '20680.848 + 19548.917', status: 'Good' },
  ],
  maintenance: [
    { name: 'Total K', value: '2.482 Bar', status: 'Good' },
    { name: 'Top-1 Valve-1', value: '62.721', status: 'Fine' },
    { name: 'Top-2 Valve-2', value: '0.282', status: 'Good' },
    { name: 'Soc Let Down Valve-1', value: '18.85', status: 'Good' },
    { name: 'Soc Let Down Valve-2', value: '0.191', status: 'Fine' },
    { name: 'N2 Flow', value: 'NA', status: 'Bad' },
  ],
};

const OM = () => {
  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        p: 0.8, // smaller padding
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* Operation Section */}
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        color="primary"
        sx={{ mb: 0.4, fontSize: 12 }}
      >
        Operation
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 0.3,
        }}
      >
        {data.operation.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FaCircle style={{ color: getStatusColor(item.status), fontSize: '5px' }} />
            <span style={{ fontSize: '10px' }}>
              <strong>{item.name}</strong>: {item.value}
            </span>
          </Box>
        ))}
      </Box>

      {/* Maintenance Section */}
      <Typography
        variant="subtitle2"
        fontWeight="bold"
        color="primary"
        sx={{ mt: 1, mb: 0.4, fontSize: 12 }}
      >
        Maintenance
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr', md: '1fr 1fr 1fr 1fr' },
          gap: 0.3,
        }}
      >
        {data.maintenance.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <FaCircle style={{ color: getStatusColor(item.status), fontSize: '5px' }} />
            <span style={{ fontSize: '10px' }}>
              <strong>{item.name}</strong>: {item.value}
            </span>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OM;