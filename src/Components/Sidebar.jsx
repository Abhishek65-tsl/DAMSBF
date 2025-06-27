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
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import CollectionsIcon from '@mui/icons-material/Collections';
import ChatIcon from '@mui/icons-material/Chat'; // ✅ imported for Chat Assistant

const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})(({ collapsed }) => ({
  display: collapsed ? 'none' : 'block',
}));

function Sidebar({ collapsed }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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
    {
      text: 'Media Gallery',
      path: '/media-gallery',
      icon: <CollectionsIcon />,
    },
    {
      text: 'Chat Assistant', // ✅ new chatbot menu
      path: '/chatbot',
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

      {/* ✅ Toggle Sign Out or Login */}
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
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 'auto' : 3,
                justifyContent: 'center',
              }}
            >
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
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 'auto' : 3,
                justifyContent: 'center',
              }}
            >
              <LoginIcon />
            </ListItemIcon>
            <StyledListItemText primary="Login" collapsed={collapsed} />
          </ListItemButton>
        )}
      </ListItem>
    </List>
  );
}

export default Sidebar;
