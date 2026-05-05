import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

const AlertCard = ({ count, type, bgColor, textColor }) => {
  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: bgColor,
        color: textColor,
        textAlign: 'center',
        py: 0.5,
        borderRight: '1px solid #ccc',
        '&:last-child': {
          borderRight: 'none',
        },
      }}
    >
      <Typography fontSize={13} fontWeight="bold">
        {count}
      </Typography>
      <Typography fontSize={11}>{type}</Typography>
    </Box>
  );
};

const RecentAlerts = ({
  alerts = [],
  alertCounts = { total: 0, open: 0, closed: 0, ack: 0 },
}) => {
  const alertItems = alerts.length
    ? alerts
    : [
        'RV1 open time • RV2 open response time',
        'VSV1 opening time • USV2 open response time',
      ];

  return (
    <Paper
      elevation={2}
      sx={{
        p: 1,
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
        border: '1px solid #ccc',
        minHeight: 130,
        maxHeight: 130,
        overflow: 'hidden',
      }}
    >
      <Typography
        fontWeight="bold"
        fontSize={13}
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 0.5,
          color: 'green', // ✅ Only this text is green
        }}
      >
        <NotificationsActiveIcon sx={{ fontSize: 16, mr: 0.5 }} />
        Recent Alarms
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: '#666' }} />
        <Typography fontSize={11}>{alertItems[0]}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.8 }}>
        <PrecisionManufacturingIcon sx={{ fontSize: 14, mr: 0.5, color: '#666' }} />
        <Typography fontSize={11}>{alertItems[1]}</Typography>
      </Box>

      <Box sx={{ display: 'flex', height: 40 }}>
        <AlertCard count={alertCounts.total} type="Total" bgColor="#d0f0c0" textColor="#1b5e20" />
        <AlertCard count={alertCounts.open} type="Open" bgColor="#cce5ff" textColor="#0d47a1" />
        <AlertCard count={alertCounts.closed} type="Closed" bgColor="#fff9c4" textColor="#f57f17" />
        <AlertCard count={alertCounts.ack} type="Ack" bgColor="#eeeeee" textColor="#212121" />
      </Box>
    </Paper>
  );
};

export default RecentAlerts;