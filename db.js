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
import { taskCategoryDelete, taskCategoryUpdate, getTaskCategoryData } from "../../services/taskCategoryService";

// 🌑🌚🌚🌚🎯 dark mode
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme, ThemeProvider, Typography } from "@mui/material";

// Snackbar to handle delete and edit
import { Snackbar, Alert, Portal } from "@mui/material";
import { keyframes } from "@emotion/react";

import TaskCategoryRegisterForm from "./TaskCategoryRegisterForm";

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

const TaskCategoryTable = ({selectedTaskCategoryForQuestion, setSelectedTaskCategoryForQuestion}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const [filterColumn, setFilterColumn] = useState("");
    const [filterSearch, setFilterSearch] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [taskCategoryData, setTaskCategoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Load the task category data when mounted
    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const data = await getTaskCategoryData();
            setTaskCategoryData(data);
            console.log(taskCategoryData);
          } catch (error) {
            setError(error.message || "Failed to load data");
          } finally {
            setLoading(false);
          }
        }
        fetchData();
    }, []);

    // refresh the task category
    const refreshTaskCategory = async () => {
      try {
        setLoading(true);
        const data = await getTaskCategoryData();
        setTaskCategoryData(data);
      } catch (err) {
        setError(err.message || "Failed to refresh taskCategory");
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
