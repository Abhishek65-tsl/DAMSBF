// src/Components/MainLayout.jsx
import React from 'react';
import { Drawer, AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import BLTDashboard from '../Pages/BLT/BLTDashboard'; // ✅ correct path

const drawerWidth = 240;

export default function MainLayout() {
  const [showDashboard, setShowDashboard] = React.useState(false);

  const handleInfoClick = () => {
    setShowDashboard(true);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top App Bar */}
      <AppBar position="fixed" sx={{ zIndex: 1201, backgroundColor: '#273142' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Bell Less Top System
          </Typography>
          <IconButton color="inherit" onClick={handleInfoClick}>
            <InfoIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Left Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#f0f0f0' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', padding: 2 }}>
          <Typography variant="subtitle1">Sidebar</Typography>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {showDashboard ? <BLTDashboard /> : <Typography>Select info icon to open Dashboard</Typography>}
      </Box>
    </Box>
  );
}
