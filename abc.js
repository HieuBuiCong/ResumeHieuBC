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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/system";
import { Snackbar, Alert, Portal } from "@mui/material";
import { keyframes } from "@emotion/react";

// Animation for Snackbar
const sway = keyframes`
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
`;

// Pagination Styling
const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  '& .MuiTablePagination-toolbar': {
    '& p': { margin: '0px' },
  },
}));

const ReusableTable = ({
  columns,
  tableLogic,
  handleUpdate,
  handleDelete,
  CustomRegisterForm, // Component for Register Button (Optional)
  title,
}) => {
  const {
    data,
    loading,
    error,
    page,
    rowsPerPage,
    searchQuery,
    handleSearchChange,
    filters,
    handleFilterChange,
    clearFilters,
    refreshData,
    selectedRow,
    handleRowSelect,
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
  } = tableLogic;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2, borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      {/* 🔹 Title & Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>{title}</Typography>
        {CustomRegisterForm && <CustomRegisterForm refreshData={refreshData} />}
      </Box>

      {/* 🔍 Search & Export */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          placeholder="Search..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ maxWidth: "250px", borderRadius: "8px" }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#999" }} /></InputAdornment>,
          }}
        />
        <Button variant="contained" startIcon={<SaveAltIcon />} onClick={() => alert("Export CSV")} sx={{ borderRadius: "8px" }}>
          Export
        </Button>
      </Box>

      {/* 📜 Table Content */}
      <TableContainer>
        <Table>
          {/* TABLE HEAD */}
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  <span style={{ fontWeight: "bold", fontSize: "0.8rem" }}>{column.toUpperCase()}</span>
                  <IconButton onClick={() => handleFilterChange(column, "")}>
                    <FilterListIcon />
                  </IconButton>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* TABLE BODY */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center" sx={{ color: "red" }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => handleRowSelect(row)}
                  sx={{
                    backgroundColor: selectedRow?.id === row.id ? "rgba(0, 123, 255, 0.1)" : "transparent",
                    "&:hover": { backgroundColor: "rgba(0, 123, 255, 0.05)" },
                  }}
                >
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {editingRowId === row.id ? (
                        <TextField
                          value={editValues[column] || ""}
                          onChange={(e) => tableLogic.setEditValues(prev => ({ ...prev, [column]: e.target.value }))}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Tooltip title={row[column]} arrow>
                          <span>{row[column]}</span>
                        </Tooltip>
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    {editingRowId === row.id ? (
                      <>
                        <Button variant="contained" size="small" onClick={() => handleSaveClick(handleUpdate)}>
                          Save
                        </Button>
                        <Button variant="outlined" size="small" color="error" onClick={() => tableLogic.setEditingRowId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <IconButton onClick={() => handleEditClick(row)}>
                        <MoreVertIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDeleteClick(handleDelete, row.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📌 Pagination */}
      <StyledTablePagination
        component="div"
        count={data.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(e, newPage) => tableLogic.setPage(newPage)}
        onRowsPerPageChange={(e) => tableLogic.setRowsPerPage(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[5, 10, 15, 20, 50]}
      />

      {/* ✅ Notifications */}
      <Portal>
        <Snackbar open={!!localError} autoHideDuration={4000} onClose={() => setLocalError(null)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ zIndex: 9999, animation: `${sway} 0.5s ease-in-out`, mt: '64px' }}>
          <Alert severity="error">{localError}</Alert>
        </Snackbar>
        <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ animation: `${sway} 0.5s ease-in-out`, mt: '64px' }}>
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>
      </Portal>
    </Paper>
  );
};

export default ReusableTable;
