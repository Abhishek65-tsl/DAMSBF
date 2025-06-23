// src/components/Sidebar.jsx
import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import DashboardIcon from '@mui/icons-material/Dashboard';

// Prevent 'collapsed' from being passed to the DOM
const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})(({ collapsed }) => ({
  display: collapsed ? 'none' : 'block',
}));
(({ collapsed }) => ({
  display: collapsed ? 'none' : 'block',
}));

function Sidebar({ collapsed }) {
  const location = useLocation();

  const menuItems = [
    {
      text: 'BLT',
      path: '/BLT',
      icon: <InfoIcon />,
    },
    {
      text: 'Charging System',
      path: '/Charging System',
      icon: <HomeIcon />,
    },
    {
      text: 'About',
      path: '/about',
      icon: <InfoIcon />,
    },
    {
      text: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardIcon />,
    },
  ];

  return (
    <List>
      {menuItems.map((item) => (
        <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 'auto' : 3,
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <StyledListItemText primary={item.text} collapsed={collapsed} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default Sidebar;
