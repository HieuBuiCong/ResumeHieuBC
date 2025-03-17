import React, { useEffect, useState } from "react";
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
  Select,
  CircularProgress,
  // ...
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SaveAltIcon from '@mui/icons-material/SaveAlt';
// 💕🆕 NEW: For 3-dot menu
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { margin, styled } from '@mui/system';

import { saveAs } from "file-saver";
import Papa from "papaparse";

// 🚀🚀 get task category data from API
import { taskCategoryDelete, taskCategoryUpdate } from "../../services/taskCategoryService";

// 🌑🌚🌚🌚🎯 dark mode
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme, ThemeProvider, Typography } from "@mui/material";

// Snackbar to handle delete and edit
import { Snackbar, Alert, Portal } from "@mui/material";
import { keyframes } from "@emotion/react";
// Keyframes for sway animation
const sway = keyframes`
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
`;

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  '& .MuiTablePagination-toolbar': {
    '& p': {
      margin: '0px', // Set your desired margin here
    },
  },
}));

// ✅ Table Columns
const columns = ["task_category_id", "task_name"];

const TaskCategoryTable = ({taskCategoryData, loading, setLoading, error, departmentData, refreshTaskCategory}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 💕🆕 NEW: Three-dot Menu States
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState(null);

  // 🦤 NEW: Row Editing State
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  
  // 🤣😂 NEW: Delete confirmation Dialog Open
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Dealing with Error of deleting, edit, changepassword
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 🌑🌚🌚🌚🎯 dark mode
  const { darkMode } = useDarkMode();
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#90caf9" : "#1976d2" },
      background: { default: darkMode ? "#121212" : "#f8f9fa" },
      backgroundColor : {default: darkMode ? "rgba(33, 31, 31, 0.7)" : "rgba(255,255,255,0.7)"},
      text: { primary: darkMode ? "#ffffff" : "#000000" },
    },
  });


  // 🚕🚕🚕 Export CSV function
  const handleExportCSV = () => {
    const csvData = taskCategoryData.map((taskCategory) => ({
      Task_Category_id: taskCategory.task_category_id,
      Task_Category_name: taskCategory.task_category_name,
    }));

    const csv = Papa.unparse(csvData); // Convert data to CSV format

    // Create Blob and trigger download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "taskCategory_data.csv");
  };

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

  // 💕🆕 OPEN & CLOSE 3-DOT MENU
  const handleMenuOpen = (event, taskCategory) => {
      setMenuAnchor(event.currentTarget);
      setSelectedTaskCategory(taskCategory);
  };
  const handleMenuClose = () => {
      setMenuAnchor(null);
      //setSelectedTaskCategory(null);
  };

  // 🦤 NEW: Edit Row
  const handleEditClick = (taskCategory) => {
      setEditingRowId(taskCategory.task_category_id);
      setEditValues({ ...taskCategory }); // Pre-fill textfields with row data
      console.log(editValues);
      handleMenuClose();
  }
  
  // 🦤🦤🦤🦤🦤🦤🦤🦤🦤🦤 NEW: Save Row (POST request placeholder)
  const handleSaveClick = async (taskCategory) => {
    try {
      setLoading(true);
      await taskCategoryUpdate(selectedTaskCategory.task_category_id, editValues );
      setSuccess(true);
      setSuccessMessage(`${selectedTaskCategory.task_name} updated successfully`);
      
    } catch (err) {
      setLocalError(err.message || "Failed to update task category");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedTaskCategory(null);
      setEditingRowId(null);
      refreshTaskCategory();
    }
    console.log("Updated task category:", selectedTaskCategory);
  }

  // 🦤🦤🦤🦤🦤🦤🦤🦤🦤🦤 NEW: Delete a row with dialog
  const handleDeleteClick = (taskCategory) => {
    console.log("Deleting task category:", taskCategory);
    setSelectedTaskCategory(taskCategory);
    setDeleteDialogOpen(true);
    handleMenuClose(); 
  }

  const handleConfirmDelete =  async(taskCategory) => {
    try {
      setLoading(true);
      await taskCategoryDelete(selectedTaskCategory.task_category_id);
      refreshTaskCategory();
      setSuccess(true);
      setSuccessMessage(`${selectedTaskCategory.task_name} deleted successfully`);
    } catch (err) {
      setLocalError(err.message || "Failed to delete task category");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedTaskCategory(null);
      setEditingRowId(null);
    }
    console.log("Deleted task category:", selectedTaskCategory);
  }

  function handleCancelDelete() {
    setDeleteDialogOpen(false);
    setSelectedTaskCategory(null);
  }

  // ✅ APPLY FILTER & SEARCH
  const filteredTaskCategory = taskCategoryData
    .filter((taskCategory) =>
      Object.keys(filters).every((column) =>
        filters[column]?.length ? filters[column].includes(String(taskCategory[column])) : true // ✅ Convert all values to strings
      )
    )
    .filter((taskCategory) =>
      Object.values(taskCategory)
        .map((v) => String(v).toLowerCase()) // ✅ Convert everything to string & lowercase before filtering
        .join(" ")
        .includes(searchQuery.toLowerCase())
    );

  return (
    <ThemeProvider theme={theme}>
        {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <CircularProgress />
            </div>
        ) : error ? (
            <p className="display-4 text-danger fw-bold" style={{fontSize: "30px"}}>😒😒{error}😒😒</p>
        ) : (
            <>
                <Paper
                    sx={{
                    width: "1200px",
                    overflow: "hidden",
                    p: 2,
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    backgroundColor: theme.palette.backgroundColor.default,
                    backdropFilter: "blur(10px)",
                    }}
                >

                    {/* 🔍 Global Search */}
                    <TextField
                        placeholder="Search task category..."
                        variant="outlined"
                        fullWidth
                        sx={{
                            maxWidth: "250px",
                            maxHeight: "100px",
                            borderRadius: "8px",
                            backgroundColor: theme.palette.backgroundColor.default,
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

                    {/*✅ Add this button to table component (above TableContainer)*/}
                    <SaveAltIcon
                        variant="contained"
                        color="primary"
                        onClick={handleExportCSV}
                        sx={{
                            ml: "52rem",
                            mt: 3,
                            width: "60px",
                            '&:hover': {
                            backgroundColor: 'rgba(68, 57, 168, 0.1)', // Change background color on hover
                            transform: 'scale(1.1)', // Slightly increase size on hover
                            }
                        }}
                    >
                    </SaveAltIcon>

                    <TableContainer className="pt-3">
                        <Table>
                            {/* TABLE HEAD WITH FILTER ICONS */}
                            <TableHead>
                                <TableRow >
                                    {columns.map((column) => (
                                        <TableCell key={column}>
                                            <span style={{ fontWeight: "bold", fontSize: "0.8rem" }}>{column === "id" ? column.toLocaleUpperCase() : column[0].toLocaleUpperCase() + column.slice(1)}</span>
                                            <IconButton onClick={(e) => handleOpenFilter(e, column)}>
                                            <FilterListIcon />
                                            </IconButton>
                                        </TableCell>

                                    ))}
                                </TableRow>
                            </TableHead>

                            {/*🦤🦤🦤🦤🦤🦤🦤🦤 TABLE BODY */}
                            <TableBody>
                                {filteredTaskCategory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((taskCategory) => (
                                    <TableRow
                                        key={taskCategory.task_category_id}
                                        hover
                                        sx={{
                                        height: "20px",
                                        cursor: "pointer",
                                        transition: "background 0.2s ease-in-out",
                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                        }}
                                    >
                                        {columns.map((column) => (
                                        <TableCell key={column} sx={{ fontSize: "0.9rem", maxWidth: "150px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                            {column === "task_category_id" ? (
                                            <span>{taskCategory[column]}</span>
                                            ) : editingRowId === taskCategory.task_category_id ? (
                                                column === "role_name" ? (
                                                <Select
                                                value={editValues[column] || ""}
                                                onChange={(e) =>
                                                    setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
                                                }
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                >
                                                {roleData.map((role) => (
                                                    <MenuItem key={role.role_id} value={role.role_name}>
                                                    {role.role_name}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                                ) : column === "department_name" ? (
                                                <Select
                                                value={editValues[column] || ""}
                                                onChange={(e) =>
                                                    setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
                                                }
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                >
                                                {departmentData.map((dept) => (
                                                    <MenuItem key={dept.department_id} value={dept.department_name}>
                                                    {dept.department_name}
                                                    </MenuItem>
                                                ))}
                                                </Select>
                                                ) : (
                                                <TextField
                                                    variant="outlined"
                                                size="small"
                                                value={editValues[column] || ""}
                                                onChange={(e) =>
                                                    setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
                                                    }
                                                />
                                                )
                                            ) : (
                                                <Tooltip title={taskCategory[column]} arrow>
                                                <span>{taskCategory[column]}</span>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        ))}
                                        {/* ACTIONS: If editing => show Save button, else show 3-dot */}
                                        <TableCell align="right">
                                        {editingRowId === taskCategory.task_category_id ? (
                                            <Box sx= {{display: 'flex', gap: 1}}>
                                            <Button variant="contained" onClick={() => handleSaveClick(taskCategory.task_category_id)}>
                                                Save
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => setEditingRowId(null)}>
                                                Cancel
                                            </Button>
                                            </Box>
                                        ) : (
                                            <IconButton onClick={(e) => handleMenuOpen(e, taskCategory)}>
                                            <MoreVertIcon />
                                            </IconButton>
                                        )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* 📌 Pagination */}
                    <StyledTablePagination
                        component="div"
                        count={filteredTaskCategory.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 15, 20,50]}
                    />

                    {/* COLUMN FILTER POPPER */}
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
                            Array.from(new Set(taskCategoryData.map((taskCategory) => String(taskCategory[filterColumn]))))
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

                    {/* 💕🆕 3-DOT MENU (EDIT / DELETE) */}
                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => handleEditClick(selectedTaskCategory)}>
                            <EditIcon sx={{ marginRight: 1 }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClick(selectedTaskCategory)} sx={{ color: "red" }}>
                            <DeleteIcon sx={{ marginRight: 1 }} />
                            Delete
                        </MenuItem>
                    </Menu>

                    {/*Deletion Confirm Dialog*/}
                    <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete task category ?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelDelete}>No</Button>
                            <Button onClick={() => handleConfirmDelete(selectedTaskCategory)} variant="contained" color="error">
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>

                {/* ✅ Error Snackbar */}
                <Portal>
                    <Snackbar
                        open={!!localError} // open if there is a error
                        autoHideDuration={4000}
                        onClose={() => setLocalError(null)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // position at the top right of the screen
                        sx={{
                        position: "fixed", // ensure snack bar is fixed and unaffected by the Dialog backdrop
                        zIndex: 9999, // ensure snackbar appear above other UI element
                        animation: `${sway} 0.5s ease-in-out`, // applies sway animation to the snack bar
                        marginTop: '64px',
                        }}
                    >
                        <Alert severity="error">{localError}</Alert>
                    </Snackbar>
                </Portal>
                {/* ✅ Success Snackbar */}
                <Portal>
                    <Snackbar
                        open={success}
                        autoHideDuration={4000}
                        onClose={() => setSuccess(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        sx={{
                        animation: `${sway} 0.5s ease-in-out`,
                        marginTop: '64px', 
                        }}
                    >
                        <Alert severity="success">{successMessage}</Alert>
                    </Snackbar>
                </Portal>
            </>
        )}
    </ThemeProvider>
  );
};

export default TaskCategoryTable;
