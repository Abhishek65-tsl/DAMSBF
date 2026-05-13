import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  GlobalStyles,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function getInitialThemeMode() {
  if (typeof window === "undefined") return "dark";

  try {
    return window.localStorage.getItem("blt-theme-mode") || "dark";
  } catch {
    return "dark";
  }
}

function persistThemeMode(mode) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.bltTheme = mode;
  }

  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem("blt-theme-mode", mode);
  } catch {
    // Theme still works for the current session through the document dataset.
  }
}

export default function BltDashboardToolbar({
  title,
  breadcrumb = "DAMS / BLT",
  userName = "Operator"
}) {
  const [mode, setMode] = useState(getInitialThemeMode);
  void userName;

  useEffect(() => {
    persistThemeMode(mode);
  }, [mode]);

  return (
    <>
      <GlobalStyles
        styles={{
          'html[data-blt-theme="light"] .blt-page, html[data-blt-theme="light"] .cooling-page, html[data-blt-theme="light"] .charging-page, html[data-blt-theme="light"] .valve-page, html[data-blt-theme="light"] .hydraulic-page': {
            "--text": "#16202a",
            "--muted": "#5e7185",
            "--line": "rgba(72, 88, 106, 0.18)",
            background:
              "radial-gradient(circle at top left, rgba(0, 121, 166, 0.12), transparent 25%), linear-gradient(180deg, #eef4f8, #dfe8ef 100%)",
            color: "#16202a"
          },
          'html[data-blt-theme="light"] .panel, html[data-blt-theme="light"] .table-panel, html[data-blt-theme="light"] .center-panel, html[data-blt-theme="light"] .sidebar-panel': {
            background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(240,246,250,0.9))",
            boxShadow: "0 16px 36px rgba(56, 72, 92, 0.14)"
          },
          'html[data-blt-theme="light"] .sensor-card, html[data-blt-theme="light"] .gauge-card, html[data-blt-theme="light"] .valve-card, html[data-blt-theme="light"] .response-box, html[data-blt-theme="light"] .section-card, html[data-blt-theme="light"] .temp-card, html[data-blt-theme="light"] .line-card, html[data-blt-theme="light"] .flow-card, html[data-blt-theme="light"] .pipe-card, html[data-blt-theme="light"] .mini-card': {
            background: "rgba(255,255,255,0.72)",
            borderColor: "rgba(72, 88, 106, 0.16)"
          }
        }}
      />

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          mb: 2.5,
          border: "1px solid rgba(150, 180, 214, 0.18)",
          borderRadius: "8px",
          color: mode === "dark" ? "#eef7ff" : "#16202a",
          bgcolor: mode === "dark" ? "rgba(8, 18, 30, 0.88)" : "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(14px)"
        }}
      >
        <Toolbar sx={{ gap: 1.5, py: 1, flexWrap: { xs: "wrap", lg: "nowrap" } }}>
          <Box sx={{ minWidth: { xs: "100%", md: 230 } }}>
            <Typography
              variant="caption"
              sx={{ color: mode === "dark" ? "rgba(238, 247, 255, 0.7)" : "text.secondary", letterSpacing: 0 }}
            >
              {breadcrumb}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.15 }}>
              {title}
            </Typography>
          </Box>

          <Box sx={{ ml: "auto" }}>
            <Tooltip title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
              <IconButton color="inherit" onClick={() => setMode((current) => (current === "dark" ? "light" : "dark"))}>
                {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
