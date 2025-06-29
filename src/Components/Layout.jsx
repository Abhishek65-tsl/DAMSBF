// src/components/Layout.jsx
import React, { useState } from 'react';
import Navbar from './Navbar';
import { Box, CssBaseline, styled } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import { Outlet, useLocation } from 'react-router-dom';
import MainSidebar from './MainSidebar';
import SectionSidebar from './SectionSidebar';

const drawerWidth = 240;
const collapsedDrawerWidth = 60;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
    marginTop: '64px',
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  position: 'fixed',
  zIndex: theme.zIndex.drawer + 1,
  ...(open && {
    width: `calc(100% - 0px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
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
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginTop: '64px',
    height: 'calc(100vh - 64px)',
    backgroundColor: theme.palette.background.paper,
  })
);

function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  // Check if route is under BF1, BF2, C1, C2, C3, BOF1, BOF2, BOF3
  const isSectionRoute = [
    '/blast-furnace/bf1',
    '/blast-furnace/bf2',
    '/caster/c1',
    '/caster/c2',
    '/caster/c3',
    '/bof/bof1',
    '/bof/bof2',
    '/bof/bof3',
  ].some((path) => location.pathname.startsWith(path));

  return (
    <Box sx={{ display: 'flex', overflowX: 'hidden' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: '#004C97', zIndex: 1201 }}>
        <Navbar open={open} handleDrawerToggle={handleDrawerOpen} />
      </AppBar>
      <Drawer variant="permanent" open={open}>
        {isSectionRoute ? (
          <SectionSidebar collapsed={!open} />
        ) : (
          <MainSidebar collapsed={!open} />
        )}
      </Drawer>
      <Main open={open}>
        <Outlet />
      </Main>
    </Box>
  );
}

export default Layout;
