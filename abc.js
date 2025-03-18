import React from "react";
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
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
  CircularProgress,
  Typography,
  Snackbar,
  Alert,
  Portal,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { keyframes } from "@emotion/react";
import { styled } from "@mui/system";
import { useTableLogic } from "./useTableLogic"; // Import custom hook

// Keyframes for snack bar animation
const sway = keyframes`
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
`;

// Styled Pagination
const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  "& .MuiTablePagination-toolbar": {
    "& p": { margin: "0px" }, // Adjust margin for pagination
  },
}));

// ✅ Reusable Table Component
const ReusableTable = ({
  title,
  columns,
  fetchDataFunction,
  updateDataFunction,
  deleteDataFunction,
  selectionHandler, // Function to handle row selection (optional)
  RegisterComponent, // Component for adding new entries (optional)
}) => {
  // 🔥 Use Table Logic Hook
  const {
    data,
    loading,
    error,
    searchQuery,
    handleSearchChange,
    filters,
    handleFilterChange,
    clearFilter,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    editingRowId,
    editValues,
    handleEditClick,
    handleSaveClick,
    handleDeleteClick,
    localError,
    setLocalError,
    success,
    setSuccess,
    successMessage,
    selectedRow,
    handleRowSelection,
  } = useTableLogic({
    fetchDataFunction,
    updateDataFunction,
    deleteDataFunction,
    selectionHandler,
  });

  return (
    <Paper
      sx={{
        width: "700px",
        overflow: "hidden",
        p: 2,
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* ✅ Table Header (Title + Add New Button) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
          {title}
        </Typography>

        {/* Optional Register Button Component */}
        {RegisterComponent && <RegisterComponent />}
      </Box>

      {/* 🔍 Search Bar & Filters */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          placeholder={`Search ${title}...`}
          variant="outlined"
          sx={{
            maxWidth: "250px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": { borderColor: "#ddd" },
              "&:hover fieldset": { borderColor: "#bbb" },
              "&.Mui-focused fieldset": { borderColor: "#1976d2" },
            },
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
      </Box>

      {/* ✅ Table Content */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" sx={{ fontSize: "18px", fontWeight: "bold", textAlign: "center" }}>
          {error}
        </Typography>
      ) : (
        <>
          <TableContainer>
            <Table>
              {/* ✅ Table Head */}
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      <span style={{ fontWeight: "bold", fontSize: "0.8rem" }}>
                        {column[0].toUpperCase() + column.slice(1)}
                      </span>
                      <IconButton onClick={(e) => handleFilterChange(column)}>
                        <FilterListIcon />
                      </IconButton>
                    </TableCell>
                  ))}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              {/* ✅ Table Body */}
              <TableBody>
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      cursor: "pointer",
                      backgroundColor: selectedRow?.id === row.id ? "#f0f0f0" : "inherit",
                    }}
                    onClick={() => handleRowSelection(row)}
                  >
                    {columns.map((column) => (
                      <TableCell key={column} sx={{ fontSize: "0.9rem" }}>
                        {editingRowId === row.id ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={editValues[column] || ""}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, [column]: e.target.value }))}
                          />
                        ) : (
                          <Tooltip title={row[column]} arrow>
                            <span>{row[column]}</span>
                          </Tooltip>
                        )}
                      </TableCell>
                    ))}

                    {/* ✅ Actions Column */}
                    <TableCell align="right">
                      {editingRowId === row.id ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button variant="contained" onClick={handleSaveClick}>
                            Save
                          </Button>
                          <Button variant="contained" color="error" onClick={() => setEditingRowId(null)}>
                            Cancel
                          </Button>
                        </Box>
                      ) : (
                        <IconButton onClick={(e) => handleEditClick(row)}>
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ✅ Pagination */}
          <StyledTablePagination
            component="div"
            count={data.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 20]}
          />
        </>
      )}

      {/* ✅ Snackbars */}
      <Portal>
        <Snackbar open={!!localError} autoHideDuration={4000} onClose={() => setLocalError(null)}>
          <Alert severity="error">{localError}</Alert>
        </Snackbar>
      </Portal>
      <Portal>
        <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      </Portal>
    </Paper>
  );
};

export default ReusableTable;
