import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import ScatterChartComponent from '../Components/ScatterChartComponent';

const pieData = [
  { name: 'Stop', value: 98, color: '#f44336' },
  { name: 'Alert', value: 1, color: '#ff9800' },
  { name: 'Safe', value: 1, color: '#4caf50' },
];

const OverallStatus = () => {
  const [plant, setPlant] = useState('BLT');
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [scenarios, setScenarios] = useState({
    load: true,
    noLoad: true,
    missing: true,
    other: true,
  });

  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  );

  // Only update time every second but without triggering full re-renders
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleScenarioChange = (event) => {
    setScenarios({
      ...scenarios,
      [event.target.name]: event.target.checked,
    });
  };

  // Memoized PieChart to prevent unnecessary rerenders
  const pieChart = useMemo(() => (
    <PieChart width={230} height={230}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={70}
        label={false} // disable labels for speed
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.color} />
        ))}
      </Pie>
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  ), []);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          BLT: OVERALL STATUS
        </Typography>
        <Typography variant="body2" align="right">
          Last Model Run Time :- {currentTime}
        </Typography>
      </Box>

      <Grid container spacing={2} alignItems="center" mt={2}>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <Select value={plant} onChange={(e) => setPlant(e.target.value)}>
              <MenuItem value="BLT">BLT</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={3}>
          <DateTimePicker
            label="From Date"
            value={fromDate}
            onChange={setFromDate}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <DateTimePicker
            label="To Date"
            value={toDate}
            onChange={setToDate}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <Button variant="contained" color="primary" fullWidth>
            Load Data
          </Button>
        </Grid>
      </Grid>

      <Box mt={1} display="flex" justifyContent="flex-end">
        <Paper elevation={3} sx={{ p: 2, width: '100%', maxWidth: 260 }}>
          <Typography variant="subtitle1" gutterBottom>
            Scenario
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {['load', 'noLoad', 'missing', 'other'].map((key) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    size="small"
                    checked={scenarios[key]}
                    onChange={handleScenarioChange}
                    name={key}
                  />
                }
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                sx={{ mr: 1 }}
              />
            ))}
          </Box>
        </Paper>
      </Box>

      <Box mt={1} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="contained" color="success" size="small">
          SCATTER CHART
        </Button>
        <Button variant="contained" color="info" size="small">
          COMPARE PANEL
        </Button>
      </Box>

      <Grid container spacing={2} mt={0}>
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle2" mb={1}>
              Health Timeline
            </Typography>
            <ScatterChartComponent />
          </Paper>
        </Grid>

        <Grid item xs={12} md={3} sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" align="center">
              Health Status
            </Typography>
            {pieChart}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverallStatus;
