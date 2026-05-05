import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InventoryIcon from "@mui/icons-material/Inventory";
import EventBusyIcon from "@mui/icons-material/EventBusy";

// 🎨 Icon & color styles
const iconStyles = {
  users: {
    icon: <PeopleIcon sx={{ fontSize: 36, color: "#15803d" }} />,       // green icon
    bgColor: "#dcfce7",   // soft green bg
    hoverShadow: "#bbf7d0",
  },
  alert: {
    icon: <WarningAmberIcon sx={{ fontSize: 36, color: "#b91c1c" }} />, // red icon
    bgColor: "#fee2e2",   // soft red bg
    hoverShadow: "#fecaca",
  },
  box: {
    icon: <InventoryIcon sx={{ fontSize: 36, color: "#1d4ed8" }} />,    // blue icon
    bgColor: "#dbeafe",   // soft blue bg
    hoverShadow: "#bfdbfe",
  },
  calendar: {
    icon: <EventBusyIcon sx={{ fontSize: 36, color: "#b45309" }} />,    // orange icon
    bgColor: "#fef3c7",   // soft orange bg
    hoverShadow: "#fde68a",
  },
};

export default function InfoCard({ title, value, icon }) {
  const { icon: IconComponent, bgColor, hoverShadow } = iconStyles[icon] || {};

  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 2,
        bgcolor: bgColor || "#ffffff",
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: `0 0 12px ${hoverShadow}`, // ✅ fixed
        },
      }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ color: "#374151" }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#111827" }}>
          {value}
        </Typography>
      </Box>
      <Box>{IconComponent}</Box>
    </Paper>
  );
}