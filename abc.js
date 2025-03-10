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
  Popper,
  ClickAwayListener,
  Box,
  FormControlLabel,
  TextField,
  TablePagination,
} from "@mui/material";
import { FaFilter, FaCheckCircle, FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";

const usersData = [
  { id: 1, name: "Adam Trantow", company: "Mohr, Langworth and Hills", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Angel Rolfson-Kulas", company: "Koch and Sons", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Betty Hammes", company: "Waelchi – VonRueden", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, name: "Billy Braun", company: "White, Cassin and Goldner", role: "UI Designer", verified: false, status: "Banned", avatar: "https://i.pravatar.cc/40?img=4" },
  { id: 5, name: "Billy Stoltenberg", company: "Medhurst, Moore and Franey", role: "Leader", verified: false, status: "Banned", avatar: "https://i.pravatar.cc/40?img=5" },
];

const columns = ["name", "company", "role", "status"];

const UserTable = () => {
  const [filters, setFilters] = useState({ name: [], company: [], role: [], status: [] });
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterClick = (event, column) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setFilterColumn(column);
  };

  const handleFilterChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterColumn]: prevFilters[filterColumn].includes(value)
        ? prevFilters[filterColumn].filter((v) => v !== value)
        : [...prevFilters[filterColumn], value],
    }));
  };

  const handleClickAway = () => setAnchorEl(null);

  const filteredUsers = usersData.filter((user) =>
    columns.every((col) =>
      filters[col].length === 0 || filters[col].includes(user[col])
    )
  );

  return (
    <Paper sx={{ padding: 3, boxShadow: 3 }}>
      <h3>Users</h3>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox /></TableCell>
              {columns.map((col) => (
                <TableCell key={col}>
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  <IconButton size="small" onClick={(e) => handleFilterClick(e, col)}>
                    <FaFilter />
                  </IconButton>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id} hover>
                <TableCell padding="checkbox"><Checkbox /></TableCell>
                <TableCell>
                  <Avatar src={user.avatar} sx={{ width: 30, height: 30, marginRight: 1 }} />
                  {user.name}
                </TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <span className={`badge ${user.status === "Active" ? "bg-success" : "bg-danger"}`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
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
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
      />

      {/* Popper Filter Menu */}
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="bottom-start">
        <ClickAwayListener onClickAway={handleClickAway}>
          <Box sx={{ backgroundColor: "white", boxShadow: 3, padding: 2, minWidth: 200 }}>
            <h6>Filter {filterColumn}</h6>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Box sx={{ maxHeight: 150, overflowY: "auto", marginTop: 1 }}>
              {Array.from(new Set(usersData.map((user) => user[filterColumn])))
                .filter((value) => value.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((value) => (
                  <FormControlLabel
                    key={value}
                    control={
                      <Checkbox
                        checked={filters[filterColumn].includes(value)}
                        onChange={() => handleFilterChange(value)}
                      />
                    }
                    label={value}
                  />
                ))}
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Paper>
  );
};

export default UserTable;