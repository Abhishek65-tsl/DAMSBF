import React from "react";
import InfoCard from "../Components/InfoCard";
import UserTable from "../Components/UserTable";
import TrendChart from "../Components/TrendChart";
import AlertTable from "../Components/AlertTable";
import { Typography, Grid, Paper, Box } from "@mui/material";

export default function AdminDashboard() {
  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "100vh",
        backgroundColor: "#0B1A2D", // dark blue background
        color: "#ffffff",
      }}
    >
      {/* Welcome Header */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard title="Total Users" value="18" icon="users" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard title="Active Alerts" value="5" icon="alert" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard title="Total Assets" value="142" icon="box" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <InfoCard title="Pending Maintenance" value="3" icon="calendar" />
        </Grid>
      </Grid>

      {/* Tables side-by-side with spacing */}
      <Grid container spacing={6} sx={{ mb: 6 }}>
        {/* User Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, backgroundColor: "#152f4f", color: "#ffffff" }}>
            <Typography variant="h6" gutterBottom>
              User Management
            </Typography>
            <UserTable />
          </Paper>
        </Grid>

        {/* Alert Table with push to right */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              backgroundColor: "#152f4f",
              color: "#ffffff",
              ml: 4, // Push to right
            }}
          >
            <Typography variant="h6" gutterBottom>
Latest Alerts
            </Typography>
            <AlertTable />
          </Paper>
        </Grid> 
      </Grid>

      {/* Trend Chart */}
      <Paper elevation={3} sx={{ p: 3, backgroundColor: "#152f4f", color: "#ffffff" }}>
        <Typography variant="h6" gutterBottom>
          System Trends
        </Typography>
        <TrendChart />
      </Paper>
    </Box>
  );
}