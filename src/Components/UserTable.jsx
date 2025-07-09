import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const mockUsers = [
  { id: 1, name: "Muskan Singh", role: "Admin", status: "Active" },
  { id: 2, name: "Ravi Kumar", role: "Technician", status: "Inactive" },
  { id: 3, name: "Pooja Sharma", role: "Engineer", status: "Active" },
];

export default function UserTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>ID</strong>
            </TableCell>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Role</strong>
            </TableCell>
            <TableCell>
              <strong>Status</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
