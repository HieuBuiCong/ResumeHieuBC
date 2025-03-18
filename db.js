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

// 🚀🚀 get task category data from API
import { taskQuestionDelete, taskQuestionUpdate, getTaskQuestionData } from "../../services/taskQuestionService";

// 🌑🌚🌚🌚🎯 dark mode
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme, ThemeProvider, Typography } from "@mui/material";

// Snackbar to handle delete and edit
import { Snackbar, Alert, Portal } from "@mui/material";
import { keyframes } from "@emotion/react";

import TaskQuestionRegisterForm from "./TaskQuestionRegisterForm";

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
const columns = ["task_category_id", "question_name"];

const TaskQuestionTable = ({selectedTaskCategoryForQuestion}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterColumn, setFilterColumn] = useState("");
    const [filterSearch, setFilterSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [taskQuestionData, setTaskQuestionData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 💕🆕 NEW: Three-dot Menu States
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [selectedTaskQuestion, setSelectedTaskQuestion] = useState(null);

    // 🦤 NEW: Row Editing State
    const [editingRowId, setEditingRowId] = useState(null);
    const [editValues, setEditValues] = useState({});
    
    // 🤣😂 NEW: Delete confirmation Dialog Open
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Dealing with Error of deleting, edit, changepassword
    const [localError, setLocalError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Load the task category data when mounted
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await getTaskQuestionData();
                const filteredData = data.filter(question => question.task_category_id === selectedTaskCategoryForQuestion.task_category_id);
                setTaskQuestionData(filteredData);
                console.log(filteredData); // Log the filtered data instead
            } catch (error) {
                setError(error.message || "Failed to load data");
                console.error(error); // Log the error for debugging
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedTaskCategoryForQuestion]);

    // refresh the task category
    const refreshTaskQuestion = async () => {
      try {
        setLoading(true);
        const data = await getTaskQuestionData();
        const filteredData = data.filter(question => question.task_category_id === selectedTaskCategoryForQuestion.task_category_id);
        console.log(filteredData);
        setTaskQuestionData(filteredData);
      } catch (err) {
        setError(err.message || "Failed to refresh taskQuestion");
      } finally {
        setLoading(false);
      }
    };

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
    const handleMenuOpen = (event, taskQuestion) => {
        setMenuAnchor(event.currentTarget);
        setSelectedTaskQuestion(taskQuestion);
    };
    const handleMenuClose = () => {
        setMenuAnchor(null);
        //setSelectedTaskQuestion(null);
    };

    // 🦤 NEW: Edit Row
    const handleEditClick = (taskQuestion) => {
        setEditingRowId(taskQuestion.task_category_question_id);
        setEditValues({ ...taskQuestion }); // Pre-fill textfields with row data
        console.log(editValues);
        handleMenuClose();
    }
    
    // 🦤🦤🦤🦤🦤🦤🦤🦤🦤🦤 NEW: Save Row (POST request placeholder)
    const handleSaveClick = async (taskQuestion) => {
        try {
        setLoading(true);
        await taskQuestionUpdate(selectedTaskQuestion.task_category_question_id, editValues );
        setSuccess(true);
        setSuccessMessage(`${selectedTaskQuestion.question_name} updated successfully`);
        
        } catch (err) {
        setLocalError(err.message || "Failed to update task category");
        } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setSelectedTaskQuestion(null);
        setEditingRowId(null);
        refreshTaskQuestion();
        }
        console.log("Updated task category:", selectedTaskQuestion);
    }

    // 🦤🦤🦤🦤🦤🦤🦤🦤🦤🦤 NEW: Delete a row with dialog
    const handleDeleteClick = (taskQuestion) => {
        console.log("Deleting task category:", taskQuestion);
        setSelectedTaskQuestion(taskQuestion);
        setDeleteDialogOpen(true);
        handleMenuClose(); 
    }

    const handleConfirmDelete =  async(taskQuestion) => {
        try {
        setLoading(true);
        await taskQuestionDelete(selectedTaskQuestion.task_category_question_id);
        refreshTaskQuestion();
        setSuccess(true);
        setSuccessMessage(`${selectedTaskQuestion.question_name} deleted successfully`);
        } catch (err) {
        setLocalError(err.message || "Failed to delete task category");
        } finally {
        setLoading(false);
        setDeleteDialogOpen(false);
        setSelectedTaskQuestion(null);
        setEditingRowId(null);
        }
        console.log("Deleted task category:", selectedTaskQuestion);
    }

    function handleCancelDelete() {
        setDeleteDialogOpen(false);
        setSelectedTaskQuestion(null);
    }

    // ✅ APPLY FILTER & SEARCH
    const filteredTaskQuestion = taskQuestionData
        .filter((taskQuestion) =>
        Object.keys(filters).every((column) =>
            filters[column]?.length ? filters[column].includes(String(taskQuestion[column])) : true // ✅ Convert all values to strings
        )
        )
        .filter((taskQuestion) =>
        Object.values(taskQuestion)
            .map((v) => String(v).toLowerCase()) // ✅ Convert everything to string & lowercase before filtering
            .join(" ")
            .includes(searchQuery.toLowerCase())
        );

  return (
    <ThemeProvider theme={theme}>
        {loading ? (
            <Paper
                sx={{
                width: "700px",
                overflow: "hidden",
                p: 2,
                borderRadius: "12px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                backgroundColor: theme.palette.backgroundColor.default,
                backdropFilter: "blur(10px)",
                }}
                >
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <CircularProgress />
                </div>
            </Paper>
        ) : error ? (
            <p className="display-4 text-danger fw-bold" style={{fontSize: "30px"}}>😒😒{error}😒😒</p>
        ) : (
            <>
                <Paper
                    sx={{
                    width: "700px",
                    overflow: "hidden",
                    p: 2,
                    borderRadius: "12px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    backgroundColor: theme.palette.backgroundColor.default,
                    backdropFilter: "blur(10px)",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: "5px" }}>
                        Questions for Task Category : {selectedTaskCategoryForQuestion.task_category_id}
                    </Typography>
                   {/* ✅ Container for Search Bar & Register Button */}
                    <Box 
                        sx={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center", 
                            gap: 2,
                            mb: 2,
                            width: "100%",
                            height: "70px", 
                        }}
                    >
                        {/* 🔍 Global Search */}
                        <TextField
                            placeholder="Search ..."
                            variant="outlined"
                            sx={{
                                maxWidth: "250px",
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
                        {/* ➕ Register New Task Question Button (aligned to the right) */}
                        <TaskQuestionRegisterForm refreshTaskQuestion={refreshTaskQuestion} setLocalError={setLocalError} setSuccess={setSuccess} setSuccessMessage={setSuccessMessage} />
                    </Box>

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
                                {filteredTaskQuestion.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((taskQuestion) => (
                                    <TableRow
                                        key={taskQuestion.task_category_question_id}
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
                                            <span>{taskQuestion[column]}</span>
                                            ) : editingRowId === taskQuestion.task_category_question_id ? (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={editValues[column] || ""}
                                                    onChange={(e) =>
                                                    setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
                                                    }
                                                />
                                            ) : (
                                                <Tooltip title={taskQuestion[column]} arrow>
                                                <span>{taskQuestion[column]}</span>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        ))}
                                        {/* ACTIONS: If editing => show Save button, else show 3-dot */}
                                        <TableCell align="right">
                                        {editingRowId === taskQuestion.task_category_question_id ? (
                                            <Box sx= {{display: 'flex', gap: 1}}>
                                            <Button variant="contained" onClick={() => handleSaveClick(taskQuestion.task_category_question_id)}>
                                                Save
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => setEditingRowId(null)}>
                                                Cancel
                                            </Button>
                                            </Box>
                                        ) : (
                                            <IconButton onClick={(e) => handleMenuOpen(e, taskQuestion)}>
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
                        count={filteredTaskQuestion.length}
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
                        Array.from(new Set(taskQuestionData.map((taskQuestion) => String(taskQuestion[filterColumn]))))
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
                        <MenuItem onClick={() => handleEditClick(selectedTaskQuestion)}>
                            <EditIcon sx={{ marginRight: 1 }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClick(selectedTaskQuestion)} sx={{ color: "red" }}>
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
                            <Button onClick={() => handleConfirmDelete(selectedTaskQuestion)} variant="contained" color="error">
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

export default TaskQuestionTable;
