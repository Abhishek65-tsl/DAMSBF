import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import BLT from '../assets/Images/BLT.jpg';

const leftStatus = [
  { number: 1, name: 'Gear box', status: 'Safe' },
  { number: 2, name: 'Distribution chute', status: 'Safe' },
  { number: 3, name: 'Lower Seal Valve 1', status: 'Safe' },
  { number: 4, name: 'Lower Seal Valve 2', status: 'Safe' },
  { number: 5, name: 'Material hopper 1', status: 'Safe' },
  { number: 6, name: 'Material hopper 2', status: 'Safe' },
  { number: 7, name: 'Isolation valve 1', status: 'Alert' },
  { number: 8, name: 'Isolation valve 2', status: 'Safe' },
  { number: 9, name: 'Tilting rocker', status: 'Safe' },
  { number: 10, name: 'Upper seal valve 1', status: 'Safe' },
  { number: 11, name: 'Upper seal valve 2', status: 'Safe' },
];

const rightStatus = [
  'Drive-1 Rotation Current',
  'Drive-2 Rotation Current',
  'Drive-1 Tilting Current',
  'Drive-2 Tilting Current',
  'Tilting_angle',
  'Rotation angle_final',
  'TT2233_3 Gear box casing Temp-1',
  'TT2233_4 Gear box casing Temp-2',
  'TT2233_5 Gear box casing Temp-3',
  'TT2233_6 Gear box casing Temp-4',
  'TT2226_1 CTG Temp Cooling',
  'TT2226_2 CTG Temp Cooling',
  'FT2225_03 BLT make up water line flow',
  'FT2240 Gear box N2 Line pressure',
  'FT2240 Gear box N2 line flow',
  'PT2000_01 Furnace Top Uptake Pressure-1',
  'PT2000_02 Furnace Top Uptake Pressure-2',
  'PT2000_03 Furnace Top Uptake Pressure-3',
  'PT2000_04 Furnace Top Uptake Pressure-4',
  'PT2245_01 GBL Cooling CKT FT',
];

const HealthStatus = () => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });

  return (
    <Box p={2}>
      <Typography variant="h6" align="center" gutterBottom>
        BLT: HEALTH STATUS
      </Typography>
      <Box display="flex" justifyContent="flex-end" pr={2}>
        <Typography variant="body2">
          Last Model Run Time :- {currentTime} &nbsp;&nbsp; {today}
        </Typography>
      </Box>

      {/* Buttons above left table */}
      <Box mt={2} mb={1} display="flex" justifyContent="flex-start" gap={2}>
        <Button variant="contained" color="primary">
          Equipment Status
        </Button>
        <Button variant="contained" color="primary">
          Forecast
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" gap={2}>
        {/* Equipment Status Table */}
        <Paper elevation={3} sx={{ width: '22%' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Number</strong></TableCell>
                  <TableCell><strong>Latest Sub-equipment status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leftStatus.map((item) => {
                  const bgColor =
                    item.number % 2 === 1 ? '#C8E6C9' : '#FFF9C4'; // pastel green / pastel yellow
                  const textColor = item.number % 2 === 1 ? '#000' : '#000';
                  return (
                    <TableRow key={item.number}>
                      <TableCell sx={{ backgroundColor: bgColor, color: textColor }}>
                        {item.number}
                      </TableCell>
                      <TableCell sx={{ backgroundColor: bgColor, color: textColor }}>
                        {item.name}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Center Image */}
        <Paper
          elevation={3}
          sx={{
            width: '32%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
          }}
        >
          <img
            src={BLT}
            alt="Equipment"
            style={{
              width: '100%',
              maxHeight: '400px',
              objectFit: 'contain',
            }}
          />
        </Paper>

        {/* Parameter Status Table */}
        <Paper elevation={3} sx={{ width: '40%' }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>No.</strong></TableCell>
                  <TableCell><strong>Latest sub-equipment parameter status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rightStatus.map((name, index) => (
                  <TableRow key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ backgroundColor: '#C8E6C9', color: '#000' }}>
                      {name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default HealthStatus;
