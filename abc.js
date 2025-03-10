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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";

// ✅ Sample User Data
const usersData = [
  { id: 1, name: "Adam Trantow", company: "Mohr, Langworth and Hills", role: "UI Designer", verified: true, status: "Active" },
  { id: 2, name: "Angel Rolfson-Kulas", company: "Koch and Sons", role: "UI Designer", verified: true, status: "Active" },
  { id: 3, name: "Betty Hammes", company: "Waelchi – VonRueden", role: "UI Designer", verified: true, status: "Active" },
  { id: 4, name: "Billy Braun", company: "White, Cassin and Goldner", role: "UI Designer", verified: false, status: "Banned" },
  { id: 5, name: "Billy Stoltenberg", company: "Medhurst, Moore and Franey", role: "Leader", verified: false, status: "Banned" }
];

// ✅ Table Columns
const columns = ["name", "company", "role", "verified", "status"];

const UserTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Handle Global Search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // ✅ Handle Filter Dropdown Open
  const handleOpenFilter = (event, column) => {
    setAnchorEl(event.currentTarget);
    setFilterColumn(column);
  };

  // ✅ Handle Filter Selection
  const handleFilterChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      [filterColumn]: prev[filterColumn]?.includes(value)
        ? prev[filterColumn].filter((v) => v !== value)
        : [...(prev[filterColumn] || []), value],
    }));
  };

  // ✅ Handle Pagination Change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Filtering Logic (Search + Column Filters)
  const filteredUsers = usersData
    .filter((user) =>
      Object.keys(filters).every((column) =>
        filters[column]?.length ? filters[column].includes(user[column]) : true
      )
    )
    .filter((user) =>
      Object.values(user)
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      {/* 🔍 Global Search */}
      <TextField
        label="Search..."
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer>
        <Table>
          {/* 🏷 Table Head with Filters */}
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  <span style={{ fontWeight: "bold" }}>{column.toUpperCase()}</span>
                  <IconButton onClick={(e) => handleOpenFilter(e, column)}>
                    <FilterListIcon />
                  </IconButton>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* 🏷 Table Body */}
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {column === "verified" ? (
                      <Checkbox checked={user[column]} disabled />
                    ) : (
                      user[column]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📌 Pagination */}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* 📌 Column Filter Popper */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {filterColumn &&
          Array.from(new Set(usersData.map((user) => user[filterColumn])))
            .filter((value) => value && value.toLowerCase().includes(searchQuery.toLowerCase())) // ✅ Ensure value is defined
            .map((value) => (
              <MenuItem key={value} onClick={() => handleFilterChange(value)}>
                <Checkbox checked={filters[filterColumn]?.includes(value) || false} />
                {value}
              </MenuItem>
            ))}
      </Menu>
    </Paper>
  );
};

export default UserTable;