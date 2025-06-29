// src/components/Layout.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Box, CssBaseline, Toolbar, IconButton, styled, useTheme } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create(['margin', 'background-color'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[900] 
      : theme.palette.grey[50],
    minHeight: '100vh',
    ...(open && {
      transition: theme.transitions.create(['margin', 'background-color'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    marginTop: '64px', // Ensure content is below the fixed AppBar
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width', 'background-color', 'box-shadow'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  position: 'fixed',
  zIndex: theme.zIndex.drawer + 1, // Ensure AppBar is above Drawer
  backgroundColor: theme.palette.mode === 'dark' 
    ? theme.palette.grey[800] 
    : theme.palette.primary.main,
  boxShadow: theme.palette.mode === 'dark'
    ? '0px 2px 4px -1px rgba(0,0,0,0.4), 0px 4px 5px 0px rgba(0,0,0,0.28), 0px 1px 10px 0px rgba(0,0,0,0.24)'
    : theme.shadows[4],
  borderBottom: theme.palette.mode === 'dark' 
    ? `1px solid ${theme.palette.divider}` 
    : 'none',
  ...(open && {
    width: `calc(100% - 0px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width', 'background-color', 'box-shadow'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled('div', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: open ? drawerWidth : collapsedDrawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    overflowX: 'hidden',
    boxSizing: 'border-box',
    transition: theme.transitions.create(['width', 'background-color', 'border-color'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: '64px', // Position the sidebar below the fixed AppBar
    height: 'calc(100vh - 64px)', 
    backgroundColor: theme.palette.mode === 'dark' 
      ? theme.palette.grey[800] 
      : theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '2px 0px 4px rgba(0,0,0,0.3)'
      : '2px 0px 4px rgba(0,0,0,0.1)',
  })
);

function Layout() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        backgroundColor: theme.palette.mode === 'dark' 
          ? theme.palette.grey[900] 
          : theme.palette.grey[50],
        minHeight: '100vh',
        transition: theme.transitions.create('background-color', {
          duration: theme.transitions.duration.standard,
        })
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ 
              mr: 2,
              color: theme.palette.mode === 'dark' 
                ? theme.palette.grey[100] 
                : 'inherit',
              '&:hover': {
                backgroundColor: theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Navbar />
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Sidebar collapsed={!open} />
      </Drawer>
      <Main open={open}>
        <Outlet />
      </Main>
    </Box>
  );
}

export default Layout;