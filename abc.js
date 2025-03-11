import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, TextField, Menu, MenuItem,
  Checkbox, TablePagination, InputAdornment, Button, List,
  ListItem, ListItemIcon, ListItemText
  // ...
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// ✅ Sample Data
const usersData = [
  { id: 1, name: "Adam Trantow", email: "...", role: "admin", department: "PE" },
  { id: 2, name: "Angel Rolfson-Kulas", email: "...", role: "user", department: "QA" },
  // ...
];

// ✅ Table Columns
const columns = ["id", "name", "email", "role", "department"];

export default function UserTable() {
  // EXISTING STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 3-DOT MENU STATE
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ NEW: Row Editing State
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // ----------------------------------------------------------------------
  // (1) GLOBAL SEARCH
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // (2) FILTER HANDLERS
  const handleOpenFilter = (event, column) => { /* ... unchanged */ };
  const handleFilterChange = (value) => { /* ... unchanged */ };
  const clearFilter = () => { /* ... unchanged */ };

  // (3) PAGINATION
  const handleChangePage = (event, newPage) => { /* ... unchanged */ };
  const handleChangeRowsPerPage = (event) => { /* ... unchanged */ };

  // ----------------------------------------------------------------------
  // 3-DOT MENU ACTIONS
  const handleMenuOpen = (event, user) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  // ✅ NEW: Edit Row
  function handleEditClick(user) {
    setEditingRowId(user.id);
    setEditValues({ ...user }); // Pre-fill textfields with row data
    handleMenuClose();
  }

  // ✅ NEW: Save Row (POST request placeholder)
  async function handleSaveClick(userId) {
    try {
      // 1️⃣ (Placeholder) Send POST or PUT to server:
      // await axios.post('/api/edit', { id: userId, ...editValues })
      console.log("Sending to server:", { id: userId, ...editValues });

      // 2️⃣ Update local data if needed
      // e.g. setUsers(...)

      // 3️⃣ Exit edit mode
      setEditingRowId(null);
    } catch (error) {
      console.error("Failed to save:", error);
    }
  }

  // ----------------------------------------------------------------------
  // ✅ APPLY FILTER & SEARCH
  const filteredUsers = usersData
    .filter((user) => {
      // Column filter
      return Object.keys(filters).every((col) =>
        filters[col]?.length
          ? filters[col].includes(String(user[col]))
          : true
      );
    })
    .filter((user) => {
      // Global search
      return Object.values(user)
        .map((v) => String(v).toLowerCase())
        .join(" ")
        .includes(searchQuery.toLowerCase());
    });

  // ----------------------------------------------------------------------
  // RENDER
  return (
    <Paper /* ... Paper styling ... */>
      {/* 🔍 Global Search */}
      <TextField /* ... styling, placeholders, etc. ... */
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <TableContainer>
        <Table>
          {/* TABLE HEAD WITH FILTER ICONS */}
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  {/* Column Title */}
                  {/* Filter Icon */}
                  {/* unchanged code ... */}
                </TableCell>
              ))}
              {/* no actions column, or add if you want */}
            </TableRow>
          </TableHead>

          {/* TABLE BODY */}
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
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
                    <TableCell key={column}>
                      {editingRowId === user.id ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          value={editValues[column] || ""}
                          onChange={(e) =>
                            setEditValues((prev) => ({
                              ...prev,
                              [column]: e.target.value,
                            }))
                          }
                        />
                      ) : (
                        user[column]
                      )}
                    </TableCell>
                  ))}

                  {/* ACTIONS: If editing => show Save button, else show 3-dot */}
                  <TableCell align="right">
                    {editingRowId === user.id ? (
                      <Button variant="contained" onClick={() => handleSaveClick(user.id)}>
                        Save
                      </Button>
                    ) : (
                      <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVertIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <TablePagination /* ... */ />

      {/* COLUMN FILTER POPPER */}
      <Menu /* ... anchorEl={anchorEl}, filters, search, etc. ... */>
        {/* unchanged filter code ... */}
      </Menu>

      {/* THREE-DOT MENU (EDIT/DELETE) */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleEditClick(selectedUser)}>
          <EditIcon sx={{ marginRight: 1 }} />
          Edit
        </MenuItem>
        <MenuItem sx={{ color: "red" }} /* onClick=...some delete function ... */>
          <DeleteIcon sx={{ marginRight: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
}