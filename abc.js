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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

// ✅ Sample Data
const usersData = [
  { id: 1, name: "Adam Trantow", company: "Mohr, Langworth and Hills", role: "UI Designer", status: "Active" },
  { id: 2, name: "Angel Rolfson-Kulas", company: "Koch and Sons", role: "UI Designer",  status: "Active" },
  { id: 3, name: "Betty Hammes", company: "Waelchi – VonRueden", role: "UI Designer",  status: "Active" },
  { id: 4, name: "Billy Braun", company: "White, Cassin and Goldner", role: "UI Designer",  status: "Banned" },
  { id: 5, name: "Billy Stoltenberg", company: "Medhurst, Moore and Franey", role: "Leader",  status: "Banned" }
];

// ✅ Table Columns
const columns = ["id","name", "company", "role", "status"];

const UserTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    const strConvertedValue = String(value); // ✅ Convert to string for consistency
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
        filters[column]?.length ? filters[column].includes(String(user[column])) : true // ✅ Convert user[column] to string
      )
    )
    .filter((user) =>
      Object.values(user)
        .map((v) => String(v)) // ✅ Ensure all values are compared as strings
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
                    {
                      user[column]
                    }
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