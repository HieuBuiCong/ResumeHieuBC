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
  ListItemText,
  TableSortLabel
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// ✅ Sample Data
const usersData = [
  { id: 1, name: "Adam Trantow", company: "Mohr, Langworth and Hills", role: "UI Designer", status: "Active" },
  { id: 2, name: "Angel Rolfson-Kulas", company: "Koch and Sons", role: "UI Designer", status: "Active" },
  { id: 3, name: "Betty Hammes", company: "Waelchi – VonRueden", role: "UI Designer", status: "Active" },
  { id: 4, name: "Billy Braun", company: "White, Cassin and Goldner", role: "UI Designer", status: "Banned" },
  { id: 5, name: "Billy Stoltenberg", company: "Medhurst, Moore and Franey", role: "Leader", status: "Banned" }
];

// ✅ Table Columns
const columns = ["id", "name", "company", "role", "status"];

const UserTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // ✅ Global Search
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // ✅ Open Filter Menu
  const handleOpenFilter = (event, column) => {
    setAnchorEl(event.currentTarget);
    setFilterColumn(column);
    setFilterSearch(""); // Reset dropdown search input
  };

  // ✅ Toggle Filter Selection
  const handleFilterChange = (value) => {
    const strConvertedValue = String(value);
    setFilters((prev) => ({
      ...prev,
      [filterColumn]: prev[filterColumn]?.includes(strConvertedValue)
        ? prev[filterColumn].filter((v) => v !== strConvertedValue)
        : [...(prev[filterColumn] || []), strConvertedValue],
    }));
  };

  // ✅ Clear Filters for a Column
  const clearFilter = () => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      delete updatedFilters[filterColumn];
      return updatedFilters;
    });
    setAnchorEl(null);
  };

  // ✅ Handle Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Apply Global & Column Filters
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
    )
    .sort((a, b) => {
      if (!sortColumn) return 0;
      return sortOrder === "asc"
        ? a[sortColumn].toString().localeCompare(b[sortColumn].toString())
        : b[sortColumn].toString().localeCompare(a[sortColumn].toString());
    });

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 3, borderRadius: 3, boxShadow: 3 }}>
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

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} stickyHeader>
          {/* 🏷 Table Head with Filters */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f4f4f4" }}>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: "bold" }}>
                  <TableSortLabel
                    active={sortColumn === column}
                    direction={sortColumn === column ? sortOrder : "asc"}
                    onClick={() => {
                      setSortOrder(sortColumn === column && sortOrder === "asc" ? "desc" : "asc");
                      setSortColumn(column);
                    }}
                  >
                    {column.toUpperCase()}
                  </TableSortLabel>
                  <IconButton onClick={(e) => handleOpenFilter(e, column)}>
                    <FilterListIcon />
                  </IconButton>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* 🏷 Table Body */}
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                  "&:hover": { backgroundColor: "#e3f2fd" },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column}>{user[column]}</TableCell>
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
        rowsPerPageOptions={[5, 10, 25, 50, 100]} // ✅ Includes 5
      />

      {/* 📌 Column Filter Popper */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {/* 🔍 Filter Search */}
        <TextField
          label="Search..."
          variant="outlined"
          fullWidth
          margin="dense"
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List>
          {filterColumn &&
            Array.from(new Set(usersData.map((user) => user[filterColumn])))
              .filter((value) => value && value.toLowerCase().includes(filterSearch.toLowerCase()))
              .map((value) => (
                <ListItem key={value} button onClick={() => handleFilterChange(value)}>
                  <ListItemIcon>
                    <Checkbox checked={filters[filterColumn]?.includes(value) || false} />
                  </ListItemIcon>
                  <ListItemText primary={value} />
                </ListItem>
              ))}
        </List>

        {/* 🔄 Clear Filter */}
        <Button fullWidth onClick={clearFilter} startIcon={<ClearIcon />} sx={{ mt: 1 }}>
          Clear Filter
        </Button>
      </Menu>
    </Paper>
  );
};

export default UserTable;