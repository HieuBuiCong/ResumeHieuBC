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
  { id: 1, name: "Adam Trantow", email: "hieu.bui-cong@hitachienergy.com", role: "admin", department: "PE" },
  { id: 2, name: "Angel Rolfson-Kulas", email: "hieu.bui-cong@hitachienergy.com", role: "user", department: "QA" },
  { id: 3, name: "Betty Hammes", email: "hieu.bui-cong@hitachienergy.com", role: "user", department: "SCM" },
  { id: 4, name: "Billy Braun", email: "hieu.bui-cong@hitachienergy.com", role: "user", department: "PE" },
  { id: 5, name: "Billy Stoltenberg", email: "hieu.bui-cong@hitachienergy.com", role: "user", department: "PE" }
];

// ✅ Table Columns
const columns = ["id", "name", "email", "role", "department"];

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
    const strValue = String(value); // ✅ Convert to string for consistency
    setFilters((prev) => ({
      ...prev,
      [filterColumn]: prev[filterColumn]?.includes(strValue)
        ? prev[filterColumn].filter((v) => v !== strValue)
        : [...(prev[filterColumn] || []), strValue],
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
        filters[column]?.length ? filters[column].includes(String(user[column])) : true // ✅ Convert all values to strings
      )
    )
    .filter((user) =>
      Object.values(user)
        .map((v) => String(v).toLowerCase()) // ✅ Convert everything to string & lowercase before filtering
        .join(" ")
        .includes(searchQuery.toLowerCase())
    );

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        p: 2,
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        backgroundColor: "white"
      }}
      >
      {/* 🔍 Global Search */}

      <TextField
        placeholder="Search user..."
        variant="outlined"
        fullWidth
        sx={{
          maxWidth: "250px",
          borderRadius: "8px",
          backgroundColor: "white",
          boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "& fieldset": { borderColor: "#ddd" },
            "&:hover fieldset": { borderColor: "#bbb" },
            "&.Mui-focused fieldset": { borderColor: "#1976d2" }
          }
        }}
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "#999" }} />
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
                  <span style={{ fontWeight: "bold" }}>{column === "id" ? column.toLocaleUpperCase() : column[0].toLocaleUpperCase() + column.slice(1)}</span>
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
              <TableRow
              key={user.id}
                hover
                sx={{
                  cursor: "pointer",
                  transition: "background 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                {columns.map((column) => (
                  <TableCell key={column} component="th" scope="row">
                    {user[column]}
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
        rowsPerPageOptions={[5, 10, 15, 20,50]}
      />

      {/* 📌 Column Filter Popper */}
      <Menu anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps = {{
              sx: {
                p:1,
                borderRadius:2,
                boxShadow:3,
                minWidth:200,
              },
            }}
      >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search filter..."
          size="small"
          sx={{
            mb: 1,                 // Margin bottom
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": { borderColor: "primary.main" },
            },
          }}
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />

        <List
          sx={{
            maxHeight: 200,
            overflowY: "auto",
          }}
        >
          {filterColumn &&
            Array.from(new Set(usersData.map((user) => String(user[filterColumn]))))
              .filter((value) => value.toLowerCase().includes(filterSearch.toLowerCase()))
              .map((value) => (
                <ListItem
                  key={value}
                  button
                  onClick={() => handleFilterChange(value)}
                  sx={{
                    fontSize: "0.875rem",      // Slightly smaller text
                    borderRadius: 1,
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      checked={filters[filterColumn]?.includes(value) || false}
                      size="small"
                    />
                  </ListItemIcon>
                  <ListItemText primary={value} />
                </ListItem>
              ))}
        </List>

        {/* 🔄 Clear Filter */}
        <Button
          fullWidth
          variant="outlined"
          onClick={clearFilter}
          startIcon={<ClearIcon />}
          sx={{
            mt: 1,
            textTransform: "none",
            borderRadius: 2,
            fontSize: "0.875rem",
            borderColor: "grey.300",
            "&:hover": {
              borderColor: "grey.400",
              backgroundColor: "action.hover",
            },
          }}
        >
          Clear Filter
        </Button>
      </Menu>
      

    </Paper>
  );
};

export default UserTable;
