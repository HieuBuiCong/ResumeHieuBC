import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  TablePagination,
  InputAdornment,
} from "@mui/material";
import { FaCheckCircle, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";

const usersData = [
  { id: 1, name: "Adam Trantow", company: "Mohr, Langworth and Hills", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Angel Rolfson-Kulas", company: "Koch and Sons", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Betty Hammes", company: "Waelchi – VonRueden", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, name: "Billy Braun", company: "White, Cassin and Goldner", role: "UI Designer", verified: false, status: "Banned", avatar: "https://i.pravatar.cc/40?img=4" },
  { id: 5, name: "Billy Stoltenberg", company: "Medhurst, Moore and Franey", role: "Leader", verified: false, status: "Banned", avatar: "https://i.pravatar.cc/40?img=5" },
];

const UserTable = () => {
  // States for filtering
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({ name: "", company: "", role: "", status: "" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Open menu for row actions
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };
  const handleMenuClose = () => setAnchorEl(null);

  // Handle filter change
  const handleFilterChange = (event, key) => {
    setFilters({ ...filters, [key]: event.target.value });
  };

  // Apply filters
  const filteredUsers = usersData.filter((user) =>
    Object.keys(filters).every(
      (key) =>
        filters[key] === "" || user[key].toLowerCase().includes(filters[key].toLowerCase())
    )
  );

  // Pagination handlers
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ padding: 3, boxShadow: 3 }}>
      <h3>Users</h3>

      {/* Filters */}
      <div className="d-flex gap-2 mb-3">
        {["name", "company", "role", "status"].map((key) => (
          <TextField
            key={key}
            label={`Filter ${key.charAt(0).toUpperCase() + key.slice(1)}`}
            variant="outlined"
            size="small"
            value={filters[key]}
            onChange={(event) => handleFilterChange(event, key)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        ))}
      </div>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id} hover>
                <TableCell padding="checkbox">
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Avatar src={user.avatar} sx={{ width: 30, height: 30, marginRight: 1 }} />
                  {user.name}
                </TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="center">
                  {user.verified ? <FaCheckCircle className="text-success" /> : "-"}
                </TableCell>
                <TableCell>
                  <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                    <FaEllipsisV />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Row Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem>
          <FaEdit className="me-2 text-primary" /> Edit
        </MenuItem>
        <MenuItem className="text-danger">
          <FaTrash className="me-2 text-danger" /> Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default UserTable;