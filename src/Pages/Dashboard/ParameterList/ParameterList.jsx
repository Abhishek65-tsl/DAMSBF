// src/components/ParameterList/ParameterList.jsx
import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider,
  Modal,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function ParameterList({ parameters }) {
  const [open, setOpen] = useState(false);
  const [selectedParam, setSelectedParam] = useState(null);
  const [timeRange, setTimeRange] = useState('2h');
  
  // Generate mock time-series data
  const generateMockData = (hours) => {
    const now = new Date();
    const data = [];
    const pointCount = hours * 60; // One point per minute
    const ucl = selectedParam ? selectedParam.ucl || selectedParam.value * 1.5 : 100;
    const lcl = selectedParam ? selectedParam.lcl || selectedParam.value * 0.5 : 0;
    
    for (let i = pointCount; i >= 0; i--) {
      const time = new Date(now - i * 60000);
      // Generate value with some randomness around the current value
      const baseValue = selectedParam ? selectedParam.value : 50;
      const randomFactor = Math.random() * 0.4 - 0.2; // -20% to +20%
      const value = baseValue * (1 + randomFactor);
      
      data.push([
        time.toLocaleTimeString(),
        value
      ]);
    }
    
    return { data, ucl, lcl };
  };
  
  const handleOpen = (param) => {
    setSelectedParam(param);
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };
  
  const getTimeInHours = () => {
    const ranges = {
      '30m': 0.5,
      '1h': 1,
      '2h': 2,
      '4h': 4,
      '8h': 8,
      '24h': 24
    };
    return ranges[timeRange] || 2;
  };
  
  const getStatusColor = (param) => {
    if (!param.ucl && !param.lcl) return '#e8f5e9'; // Default light green
    
    const value = parseFloat(param.value);
    const ucl = param.ucl || value * 1.5;
    const lcl = param.lcl || value * 0.5;
    
    if (value >= lcl && value <= ucl) {
      return '#e8f5e9'; // Light green - within limits
    } else {
      const upperDeviation = value > ucl ? (value - ucl) / ucl : 0;
      const lowerDeviation = value < lcl ? (lcl - value) / lcl : 0;
      const maxDeviation = Math.max(upperDeviation, lowerDeviation);
      
      if (maxDeviation < 0.2) {
        return '#fff9c4'; // Light yellow - <20% outside limits
      } else {
        return '#ffebee'; // Light red - >=20% outside limits
      }
    }
  };
  
  const getChartOption = () => {
    if (!selectedParam) return {};
    
    const hours = getTimeInHours();
    const { data, ucl, lcl } = generateMockData(hours);
    
    return {
      title: {
        text: `${selectedParam.name} Trend`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const dataPoint = params[0];
          return `${dataPoint.name}<br/>Value: ${dataPoint.value[1].toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'category',
        data: data.map(item => item[0])
      },
      yAxis: {
        type: 'value',
        name: selectedParam.unit || '',
        nameLocation: 'middle',
        nameGap: 50,
        axisLine: {
          show: true
        }
      },
      series: [
        {
          name: selectedParam.name,
          type: 'line',
          data: data,
          markLine: {
            silent: true,
            lineStyle: {
              color: '#333'
            },
            data: [
              {
                yAxis: ucl,
                name: 'UCL',
                label: {
                  formatter: 'UCL: {c}',
                  position: 'start'
                },
                lineStyle: {
                  color: '#ff4d4f'
                }
              },
              {
                yAxis: lcl,
                name: 'LCL',
                label: {
                  formatter: 'LCL: {c}',
                  position: 'start'
                },
                lineStyle: {
                  color: '#ff4d4f'
                }
              }
            ]
          }
        }
      ],
      grid: {
        left: '5%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      }
    };
  };

  return (
    <>
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '400px'
        }}
      >
        {parameters.map((param, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Divider />}
            <Box 
              sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                p: 1.2,
                backgroundColor: getStatusColor(param),
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.action.hover,
                  cursor: 'pointer'
                },
                transition: 'background-color 0.3s'
              }}
              onClick={() => handleOpen(param)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight={500} color="text.secondary">
                  {param.name}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                fontWeight={600} 
                sx={{ 
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {param.value} {param.unit && <span style={{ fontSize: '0.7rem', marginLeft: '2px' }}>{param.unit}</span>}
              </Typography>
            </Box>
          </React.Fragment>
        ))}
      </Paper>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="trend-chart-modal"
        aria-describedby="parameter-trend-chart"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%' },
          maxWidth: '800px',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
            <Typography variant="h6" component="h2">
              {selectedParam?.name} Trend Analysis
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                id="time-range-select"
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="30m">30 Minutes</MenuItem>
                <MenuItem value="1h">1 Hour</MenuItem>
                <MenuItem value="2h">2 Hours</MenuItem>
                <MenuItem value="4h">4 Hours</MenuItem>
                <MenuItem value="8h">8 Hours</MenuItem>
                <MenuItem value="24h">24 Hours</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ height: '400px', width: '100%' }}>
            <ReactECharts 
              option={getChartOption()} 
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleClose} variant="contained">Close</Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
