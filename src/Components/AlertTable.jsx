import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

const mockAlerts = [
  { id: 101, message: "Temperature Spike in Zone 2", severity: "High" },
  { id: 102, message: "Sensor Offline: Gearbox #4", severity: "Medium" },
  { id: 103, message: "Maintenance Overdue: Chute", severity: "Low" },
];

const severityColor = {
  High: "error",
  Medium: "warning",
  Low: "info",
};

export default function AlertTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="alerts table">
        <TableHead>
          <TableRow>
            <TableCell><strong>ID</strong></TableCell>
            <TableCell><strong>Message</strong></TableCell>
            <TableCell><strong>Severity</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockAlerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell>{alert.id}</TableCell>
              <TableCell>{alert.message}</TableCell>
              <TableCell>
                <Chip label={alert.severity} color={severityColor[alert.severity]} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}