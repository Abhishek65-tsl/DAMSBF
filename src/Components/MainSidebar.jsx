// src/components/MainSidebar.jsx
import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import FactoryIcon from '@mui/icons-material/Factory';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import BuildIcon from '@mui/icons-material/Build';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import LockResetIcon from '@mui/icons-material/LockReset';

const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})(({ collapsed }) => ({
  display: collapsed ? 'none' : 'block',
}));

function MainSidebar({ collapsed }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const [openMenus, setOpenMenus] = useState({
    bf: false,
    caster: false,
    bof: false,
  });

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <List>
      {/* Blast Furnace */}
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton onClick={() => toggleMenu('bf')}>
          <ListItemIcon>
            <FactoryIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Blast Furnace" />}
          {!collapsed && (openMenus.bf ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        <Collapse in={openMenus.bf} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/blast-furnace/bf1"
              selected={location.pathname.startsWith('/blast-furnace/bf1')}
              sx={{ pl: collapsed ? 2 : 4 }}
            >
              <ListItemText primary="BF1" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/blast-furnace/bf2"
              selected={location.pathname.startsWith('/blast-furnace/bf2')}
              sx={{ pl: collapsed ? 2 : 4 }}
            >
              <ListItemText primary="BF2" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>

      {/* Caster */}
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton onClick={() => toggleMenu('caster')}>
          <ListItemIcon>
            <PrecisionManufacturingIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Caster" />}
          {!collapsed && (openMenus.caster ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        <Collapse in={openMenus.caster} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {[1, 2, 3].map((n) => (
              <ListItemButton
                key={n}
                component={Link}
                to={`/caster/c${n}`}
                selected={location.pathname.startsWith(`/caster/c${n}`)}
                sx={{ pl: collapsed ? 2 : 4 }}
              >
                <ListItemText primary={`C${n}`} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </ListItem>

      {/* BOF */}
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton onClick={() => toggleMenu('bof')}>
          <ListItemIcon>
            <BuildIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="BOF" />}
          {!collapsed && (openMenus.bof ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        <Collapse in={openMenus.bof} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {[1, 2, 3].map((n) => (
              <ListItemButton
                key={n}
                component={Link}
                to={`/bof/bof${n}`}
                selected={location.pathname.startsWith(`/bof/bof${n}`)}
                sx={{ pl: collapsed ? 2 : 4 }}
              >
                <ListItemText primary={`BOF${n}`} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </ListItem>

      {/* ✅ Admin Dashboard */}
      <ListItem disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          component={Link}
          to="/admin-dashboard"
          selected={location.pathname === '/admin-dashboard'}
          sx={{ minHeight: 48, justifyContent: collapsed ? 'center' : 'initial', px: 2.5 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 'auto' : 3, justifyContent: 'center' }}>
            <DashboardIcon />
          </ListItemIcon>
          <StyledListItemText primary="Admin Dashboard" collapsed={collapsed} />
        </ListItemButton>
      </ListItem>

      {/* Login/Logout Section */}
      <ListItem disablePadding sx={{ display: 'block' }}>
        {isLoggedIn ? (
          <>
            <ListItemButton
              component={Link}
              to="/signout"
              selected={location.pathname === '/signout'}
              sx={{ minHeight: 48, justifyContent: collapsed ? 'center' : 'initial', px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 'auto' : 3, justifyContent: 'center' }}>
                <LogoutIcon />
              </ListItemIcon>
              <StyledListItemText primary="Sign Out" collapsed={collapsed} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/reset"
              selected={location.pathname === '/reset'}
              sx={{ minHeight: 48, justifyContent: collapsed ? 'center' : 'initial', px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 'auto' : 3, justifyContent: 'center' }}>
                <LockResetIcon />
              </ListItemIcon>
              <StyledListItemText primary="Reset Password" collapsed={collapsed} />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton
            component={Link}
            to="/login"
            selected={location.pathname === '/login'}
            sx={{ minHeight: 48, justifyContent: collapsed ? 'center' : 'initial', px: 2.5 }}
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

export default MainSidebar;
