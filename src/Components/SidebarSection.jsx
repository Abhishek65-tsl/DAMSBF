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
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import ChatIcon from '@mui/icons-material/Chat';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})(({ collapsed }) => ({
  display: collapsed ? 'none' : 'block',
}));

function SidebarSection({ collapsed }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // This could be dynamic later based on URL or context
  const basePath = '/blast-furnace/bf1';

  const menuItems = [
    {
      text: 'BLT',
      path: `${basePath}/BLT`,
      icon: <InfoIcon />,
    },
    {
      text: 'Charging System',
      path: `${basePath}/Charging System`,
      icon: <HomeIcon />,
    },
    {
      text: 'About',
      path: `${basePath}/about`,
      icon: <InfoIcon />,
    },
    {
      text: 'Dashboard',
      path: `${basePath}/dashboard`,
      icon: <DashboardIcon />,
    },
    {
      text: 'Media Gallery',
      path: `${basePath}/media-gallery`,
      icon: <CollectionsIcon />,
    },
    {
      text: 'Chat Assistant',
      path: `${basePath}/chatbot`,
      icon: <ChatIcon />,
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

      <ListItem disablePadding sx={{ display: 'block' }}>
        {isLoggedIn ? (
          <ListItemButton
            component={Link}
            to="/signout"
            selected={location.pathname === '/signout'}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: 2.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 'auto' : 3, justifyContent: 'center' }}>
              <LogoutIcon />
            </ListItemIcon>
            <StyledListItemText primary="Sign Out" collapsed={collapsed} />
          </ListItemButton>
        ) : (
          <ListItemButton
            component={Link}
            to="/login"
            selected={location.pathname === '/login'}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? 'center' : 'initial',
              px: 2.5,
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 'auto' : 3, justifyContent: 'center' }}>
              <LoginIcon />
            </ListItemIcon>
            <StyledListItemText primary="Login" collapsed={collapsed} />
          </ListItemButton>
        )}
      </ListItem>
    </List>
  );
}

export default SidebarSection;
