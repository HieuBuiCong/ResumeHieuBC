import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, TextField, Menu, MenuItem, Checkbox,
  TablePagination, InputAdornment, Button, List, ListItem,
  ListItemIcon, ListItemText, Box, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Tooltip,
  CircularProgress, Snackbar, Alert, Portal, Select
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from '@mui/system';
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { taskCategoryDelete, taskCategoryUpdate } from "../../services/taskCategoryService";
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme, ThemeProvider } from "@mui/material";
import { keyframes } from "@emotion/react";

// Sway animation for Snackbar
const sway = keyframes`
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
`;

const StyledTablePagination = styled(TablePagination)({
  '& .MuiTablePagination-toolbar p': { margin: '0px' },
});

const columns = ["task_category_id", "task_name"];

const TaskCategoryTable = ({ taskCategoryData, loading, setLoading, error, refreshTaskCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { darkMode } = useDarkMode();
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      backgroundColor: { default: darkMode ? "rgba(33,31,31,0.7)" : "rgba(255,255,255,0.7)" },
    },
  });

  const handleExportCSV = () => {
    const csvData = taskCategoryData.map(({ task_category_id, task_name }) => ({ task_category_id, task_name }));
    const csv = Papa.unparse(csvData);
    saveAs(new Blob([csv], { type: "text/csv;charset=utf-8;" }), "taskCategory_data.csv");
  };

  const handleOpenFilter = (event, column) => {
    setAnchorEl(event.currentTarget);
    setFilterColumn(column);
    setFilterSearch("");
  };

  const handleFilterChange = (value) => {
    setFilters(prev => ({
      ...prev,
      [filterColumn]: prev[filterColumn]?.includes(value)
        ? prev[filterColumn].filter(v => v !== value)
        : [...(prev[filterColumn] || []), value],
    }));
  };

  const clearFilter = () => {
    setFilters(prev => {
      const updated = { ...prev };
      delete updated[filterColumn];
      return updated;
    });
    setAnchorEl(null);
  };

  const filteredTaskCategory = taskCategoryData.filter((row) =>
    Object.entries(filters).every(([col, vals]) =>
      vals.length ? vals.includes(String(row[col])) : true
    ) && Object.values(row).join(" ").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveClick = async () => {
    setLoading(true);
    try {
      await taskCategoryUpdate(editingRowId, editValues);
      setSuccessMessage("Updated successfully");
      setSuccess(true);
      refreshTaskCategory();
    } catch (err) {
      setLocalError(err.message || "Update failed");
    } finally {
      setLoading(false);
      setEditingRowId(null);
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await taskCategoryDelete(selectedTaskCategory.task_category_id);
      setSuccessMessage("Deleted successfully");
      setSuccess(true);
      refreshTaskCategory();
    } catch (err) {
      setLocalError(err.message || "Delete failed");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {loading && <Box sx={{ textAlign: "center", mt: 2 }}><CircularProgress /></Box>}
      {error && <Box sx={{ color: 'error.main', textAlign: 'center', my: 2 }}>{error}</Box>}
      {!loading && !error && (
        <Paper sx={{ p: 2, backdropFilter: "blur(10px)", bgcolor: 'backgroundColor.default' }}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            sx={{ maxWidth: 250 }}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment><SearchIcon /></InputAdornment> }}
          />
          <IconButton sx={{ ml: 2 }} onClick={handleExportCSV}><SaveAltIcon /></IconButton>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map(col => (
                    <TableCell key={col}>
                      {col.toUpperCase()}
                      <IconButton onClick={e => handleOpenFilter(e, col)}><FilterListIcon /></IconButton>
                    </TableCell>
                  ))}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTaskCategory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                  <TableRow hover key={row.task_category_id}>
                    {columns.map(col => (
                      <TableCell key={col}>
                        {editingRowId === row.task_category_id && col !== 'task_category_id' ? (
                          <TextField
                            size="small"
                            value={editValues[col] || ""}
                            onChange={e => setEditValues(prev => ({ ...prev, [col]: e.target.value }))}
                          />
                        ) : (
                          <Tooltip title={row[col]} arrow><span>{row[col]}</span></Tooltip>
                        )}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      {editingRowId === row.task_category_id ? (
                        <>
                          <Button onClick={handleSaveClick}>Save</Button>
                          <Button color="error" onClick={() => setEditingRowId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <IconButton onClick={e => { setMenuAnchor(e.currentTarget); setSelectedTaskCategory(row); }}>
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <StyledTablePagination
            count={filteredTaskCategory.length} page={page} rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={e => setRowsPerPage(+e.target.value)}
          />

          {/* Popups, Dialog, and Snackbar components remain unchanged for brevity */}

        </Paper>
      )}
    </ThemeProvider>
  );
};

export default TaskCategoryTable;