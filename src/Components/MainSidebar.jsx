// src/components/MainSidebar.jsx
import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  styled,
  Tooltip,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FactoryIcon from "@mui/icons-material/Factory";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import BuildIcon from "@mui/icons-material/Build";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import LockResetIcon from "@mui/icons-material/LockReset";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import AssessmentIcon from "@mui/icons-material/Assessment"; // Overall Status icon
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"; // ✅ Health Status icon
import WaterIcon from "@mui/icons-material/Water";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BoltIcon from "@mui/icons-material/Bolt";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import SettingsInputComponentIcon from "@mui/icons-material/SettingsInputComponent";
import OpacityIcon from "@mui/icons-material/Opacity";

const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "collapsed",
})(({ collapsed }) => ({
  display: collapsed ? "none" : "block",
}));

function MainSidebar({ collapsed }) {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const [openMenus, setOpenMenus] = useState({
    bf: false,
    caster: false,
    bof: false,
    furnace: false,
    damsBlt: false,
  });

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <List>
      {/* DAMS-BLT */}
      <ListItem disablePadding sx={{ display: "block" }}>
        <Tooltip title={collapsed ? "DAMS-BLT" : ""} placement="right" arrow>
          <ListItemButton onClick={() => toggleMenu("damsBlt")}>
            <ListItemIcon>
              <WaterIcon />
            </ListItemIcon>

            {!collapsed && <ListItemText primary="DAMS-BLT" />}

            {!collapsed && (openMenus.damsBlt ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </Tooltip>

        <Collapse in={openMenus.damsBlt} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Tooltip title={collapsed ? "Overview" : ""} placement="right" arrow>
              <ListItemButton
                component={Link}
                to="/dams-blt"
                selected={location.pathname.startsWith("/dams-blt")}
                sx={{ pl: collapsed ? 2 : 4 }}
              >
                <ListItemIcon>
                  <AutoGraphIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Overview" />
              </ListItemButton>
            </Tooltip>
            <Tooltip title={collapsed ? "Charging System" : ""} placement="right" arrow>
              <ListItemButton
                component={Link}
                to="/charging-system"
                selected={location.pathname.startsWith("/charging-system")}
                sx={{ pl: collapsed ? 2 : 4 }}
              >
                <ListItemIcon>
                  <BoltIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Charging System" />
              </ListItemButton>
            </Tooltip>
            <Tooltip title={collapsed ? "Cooling System" : ""} placement="right" arrow>
              <ListItemButton
                component={Link}
                to="/cooling-system"
                selected={location.pathname.startsWith("/cooling-system")}
                sx={{ pl: collapsed ? 2 : 4 }}
              >
                <ListItemIcon>
                  <AcUnitIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Cooling System" />
              </ListItemButton>
            </Tooltip>
            <Tooltip title={collapsed ? "Valve System" : ""} placement="right" arrow>
              <ListItemButton
                component={Link}
                to="/valve-system"
                selected={location.pathname.startsWith("/valve-system")}
                sx={{ pl: collapsed ? 2 : 4 }}
              >
                <ListItemIcon>
                  <SettingsInputComponentIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Valve System" />
              </ListItemButton>
            </Tooltip>
            <Tooltip title={collapsed ? "Hydraulic View" : ""} placement="right" arrow>
              <ListItemButton
                component={Link}
                to="/hydraulic-view"
                selected={location.pathname.startsWith("/hydraulic-view")}
                sx={{ pl: collapsed ? 2 : 4 }}
              >
                <ListItemIcon>
                  <OpacityIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Hydraulic View" />
              </ListItemButton>
            </Tooltip>
          </List>
        </Collapse>
      </ListItem>
       {/* Blast Furnace */}
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => toggleMenu("bf")}>
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
              selected={location.pathname.startsWith("/blast-furnace/bf1")}
              sx={{ pl: collapsed ? 2 : 4 }}
            >
              <ListItemText primary="BF1" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/blast-furnace/bf2"
              selected={location.pathname.startsWith("/blast-furnace/bf2")}
              sx={{ pl: collapsed ? 2 : 4 }}
            >
              <ListItemText primary="BF2" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>
      {/* Caster */}
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => toggleMenu("caster")}>
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
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => toggleMenu("bof")}>
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
      {/* Furnace */}
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton onClick={() => toggleMenu("furnace")}>
          <ListItemIcon>
            <WhatshotIcon />
          </ListItemIcon>
          {!collapsed && <ListItemText primary="Furnace" />}
          {!collapsed && (openMenus.furnace ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
        <Collapse in={openMenus.furnace} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              component={Link}
              to="/furnace/overview"
              selected={location.pathname.startsWith("/furnace/overview")}
              sx={{ pl: collapsed ? 2 : 4 }}
            >
              <ListItemText primary="Furnace Overview" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/furnace/hot-blast-flow"
              selected={location.pathname.startsWith("/furnace/hot-blast-flow")}
              sx={{ pl: collapsed ? 2 : 4 }}
            >
              <ListItemText primary="Hot Blast Flow" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/furnace/tuyere-nose-system-1"
              selected={location.pathname.startsWith(
                "/furnace/tuyere-nose-system-1",
              )}
              sx={{ pl: collapsed ? 2 : 4 }}
            >
              <ListItemText primary="Tuyere Nose Sys 1" />
            </ListItemButton>
            <ListItemButton
              component={Link}
              to="/furnace/tuyere-nose-system-2"
              selected={location.pathname.startsWith(
                "/furnace/tuyere-nose-system-2",
              )}
              sx={{ pl: collapsed ? 2 : 4 }}
            >
              <ListItemText primary="Tuyere Nose Sys 2" />
            </ListItemButton>
          </List>
        </Collapse>
      </ListItem>
      {/* ✅ Admin Dashboard */}
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component={Link}
          to="/admin-dashboard"
          selected={location.pathname === "/admin-dashboard"}
          sx={{
            minHeight: 48,
            justifyContent: collapsed ? "center" : "initial",
            px: 2.5,
          }}
          Add
          commentMore
          actions
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? "auto" : 3,
              justifyContent: "center",
            }}
          >
            <DashboardIcon />
          </ListItemIcon>
          <StyledListItemText primary="Admin Dashboard" collapsed={collapsed} />
        </ListItemButton>
      </ListItem>
      {/* ✅ OVERALL STATUS */}
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component={Link}
          to="/overall-status"
          selected={location.pathname === "/overall-status"}
          sx={{
            minHeight: 48,
            justifyContent: collapsed ? "center" : "initial",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? "auto" : 3,
              justifyContent: "center",
            }}
          >
            <AssessmentIcon />
          </ListItemIcon>
          <StyledListItemText primary="Overall Status" collapsed={collapsed} />
        </ListItemButton>
      </ListItem>
      {/* ✅ HEALTH STATUS */}
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          component={Link}
          to="/health-status"
          selected={location.pathname === "/health-status"}
          sx={{
            minHeight: 48,
            justifyContent: collapsed ? "center" : "initial",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: collapsed ? "auto" : 3,
              justifyContent: "center",
            }}
          >
            <HealthAndSafetyIcon />
          </ListItemIcon>
          <StyledListItemText primary="Health Status" collapsed={collapsed} />
        </ListItemButton>
      </ListItem>
      {/* Login/Logout Section */}
      <ListItem disablePadding sx={{ display: "block" }}>
        {isLoggedIn ? (
          <>
            <ListItemButton
              component={Link}
              to="/signout"
              selected={location.pathname === "/signout"}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? "center" : "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? "auto" : 3,
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <StyledListItemText primary="Sign Out" collapsed={collapsed} />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/reset"
              selected={location.pathname === "/reset"}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? "center" : "initial",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? "auto" : 3,
                  justifyContent: "center",
                }}
              >
                <LockResetIcon />
              </ListItemIcon>
              <StyledListItemText
                primary="Reset Password"
                collapsed={collapsed}
              />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton
            component={Link}
            to="/login"
            selected={location.pathname === "/login"}
            sx={{
              minHeight: 48,
              justifyContent: collapsed ? "center" : "initial",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? "auto" : 3,
                justifyContent: "center",
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

export default MainSidebar;
