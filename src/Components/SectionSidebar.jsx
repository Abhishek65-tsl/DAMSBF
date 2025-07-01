// src/components/SectionSidebar.jsx
import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import InfoIcon from '@mui/icons-material/Info';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CollectionsIcon from '@mui/icons-material/Collections';
import ChatIcon from '@mui/icons-material/Chat';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function SectionSidebar({ collapsed }) {
  const location = useLocation();
  // const { sectionId } = useParams();

  const menuItems = [
    {
      text: 'BLT',
      path: `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}/BLT`,
      icon: <InfoIcon />,
    },
    {
      text: 'Charging System',
      path: `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}/Charging System`,
      icon: <HomeIcon />,
    },
    {
      text: 'About',
      path: `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}/about`,
      icon: <InfoIcon />,
    },
    {
      text: 'Dashboard',
      path: `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}/dashboard`,
      icon: <DashboardIcon />,
    },
    {
      text: 'Media Gallery',
      path: `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}/media-gallery`,
      icon: <CollectionsIcon />,
    },
    {
      text: 'Chat Assistant',
      path: `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}/chatbot`,
      icon: <ChatIcon />,
    },
  ];

  const sectionLabel = location.pathname.split('/')[2]?.toUpperCase();

  return (
    <List>
      {/* Back to Main */}
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          component={Link}
          to="/"
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
            <ArrowBackIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary={sectionLabel} />}
        </ListItemButton>
      </ListItem>

      <Divider />

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
            {!collapsed && <ListItemText primary={item.text} />}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}

export default SectionSidebar;
