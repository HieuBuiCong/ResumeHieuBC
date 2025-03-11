import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Checkbox,
  TablePagination,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
  // ...
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
// ✅ NEW: For 3-dot menu
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ Sample Data
const usersData = [
  { id: 1, name: "Adam Trantow", email: "hieu.bui-cong@hitachienergy.com", role: "admin", department: "PE" },
  { id: 2, name: "Angel Rolfson-Kulas", ... },
  { id: 3, name: "Betty Hammes",       ... },
  // ...
];

// ✅ Table Columns
const columns = ["id", "name", "email", "role", "department"];

const UserTable = () => {
  // EXISTING STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ NEW: Three-dot Menu States
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // (1) GLOBAL SEARCH
  const handleSearchChange = (e) => { ... };

  // (2) FILTER HANDLERS
  const handleOpenFilter = (event, column) => { ... };
  const handleFilterChange = (value) => { ... };
  const clearFilter = () => { ... };

  // (3) PAGINATION
  const handleChangePage = (event, newPage) => { ... };
  const handleChangeRowsPerPage = (event) => { ... };

  // ✅ OPEN & CLOSE 3-DOT MENU
  const handleMenuOpen = (event, user) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  // ✅ FILTER & SEARCH LOGIC
  const filteredUsers = usersData
    .filter((user) => ... ) // same column filters
    .filter((user) => ... ) // same global search

  return (
    <Paper sx={{
      width: "100%",
      overflow: "hidden",
      p: 2,
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      backgroundColor: "white"
    }}>
      {/* 🔍 Global Search */}
      <TextField
        placeholder="Search user..."
        // ...
        value={searchQuery}
        onChange={handleSearchChange}
        // ...
      />

      <TableContainer>
        <Table>
          {/* TABLE HEAD WITH FILTERS */}
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  <span style={{ fontWeight: "bold" }}>
                    {/* capitalizing or if ID => uppercase */}
                    ...
                  </span>
                  <IconButton onClick={(e) => handleOpenFilter(e, column)}>
                    <FilterListIcon />
                  </IconButton>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* TABLE BODY */}
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{
                  cursor: "pointer",
                  transition: "background 0.2s ease-in-out",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column}>{user[column]}</TableCell>
                ))}

                {/* 3-DOT ACTIONS */}
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <TablePagination
        ...
      />

      {/* COLUMN FILTER POPPER */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        // ...
      >
        <TextField
          // Filter search code
          ...
        />
        <List sx={{ ... }}>
          {filterColumn &&
            // same code for filter items
            ...
          }
        </List>
        <Button
          // Clear Filter button
          ...
        >
          Clear Filter
        </Button>
      </Menu>

      {/* ✅ 3-DOT MENU (EDIT / DELETE) */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon sx={{ marginRight: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: "red" }}>
          <DeleteIcon sx={{ marginRight: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default UserTable;