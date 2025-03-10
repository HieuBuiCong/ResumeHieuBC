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
  Avatar,
  Tooltip,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import { styled } from "@mui/material/styles";

// ✅ Sample Data
const usersData = [
  { id: 1, name: "Billy Braun", company: "White, Cassin and Goldner", role: "UI Designer", verified: false, status: "Banned", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: 2, name: "Cheryl Romaguera", company: "Weimann LLC", role: "UI Designer", verified: false, status: "Active", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: 3, name: "Betty Hammes", company: "Waelchi – VonRueden", role: "UI Designer", verified: true, status: "Active", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: 4, name: "Steve Welch", company: "Turcotte - Runolfsson", role: "Front End Developer", verified: false, status: "Banned", avatar: "https://i.pravatar.cc/40?img=4" },
  { id: 5, name: "Willis Ankunding", company: "Streich Group", role: "UI Designer", verified: false, status: "Active", avatar: "https://i.pravatar.cc/40?img=5" }
];

// ✅ Table Columns
const columns = ["name", "company", "role", "verified", "status"];

// ✅ Styled Components for Modern UI
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  "& th": {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StatusBadge = styled("span")(({ theme, status }) => ({
  padding: "4px 10px",
  borderRadius: "12px",
  fontWeight: 600,
  color: status === "Active" ? "#1B5E20" : "#B71C1C",
  backgroundColor: status === "Active" ? "#C8E6C9" : "#FFCDD2",
}));

const UserTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // ✅ Global Search
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // ✅ Open Three-Dot Menu
  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  // ✅ Handle Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // ✅ Apply Global Search
  const filteredUsers = usersData.filter((user) =>
    Object.values(user).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2 }}>
      {/* 🔍 Global Search */}
      <TextField
        label="Search user..."
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

      <StyledTableContainer component={Paper}>
        <Table>
          {/* 🏷 Table Head with Filters */}
          <StyledTableHead>
            <TableRow>
              <TableCell>
                <Checkbox />
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column}>
                  {column.toUpperCase()}
                  <IconButton size="small">
                    <FilterListIcon />
                  </IconButton>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </StyledTableHead>

          {/* 🏷 Table Body */}
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <StyledTableRow key={user.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Avatar src={user.avatar} sx={{ marginRight: 1, verticalAlign: "middle" }} />
                  {user.name}
                </TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {user.verified ? (
                    <CheckCircleIcon sx={{ color: "green" }} />
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <StatusBadge status={user.status}>{user.status}</StatusBadge>
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, user)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* 📌 Pagination */}
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* 📌 Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            boxShadow: 3,
            borderRadius: 2,
            minWidth: "150px",
          },
        }}
      >
        <MenuItem>
          <EditIcon fontSize="small" sx={{ marginRight: 1 }} />
          Edit
        </MenuItem>
        <MenuItem sx={{ color: "red" }}>
          <DeleteIcon fontSize="small" sx={{ marginRight: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default UserTable;