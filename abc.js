import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
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
  Snackbar,
  Alert,
  Portal,
  Typography,
  Autocomplete,
} from "@mui/material";
import Popper from '@mui/material/Popper';
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { margin, styled, width } from '@mui/system';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { format } from 'date-fns';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AnswerModal from "./AnwserModal.jsx"; // this is for cid_Task show answers


// 🌑🌚🌚🌚🎯 dark mode
import { createTheme, ThemeProvider } from "@mui/material";
import {  paperStyles, boxStyles, searchTextFieldStyles, snackBarStyles } from "./tableStyle.js";

// Status color map
const statusColors = {
    "in-progress": "orange",
    "complete": "green",
    "overdue": "red",
    "pending": "grey",
    "submitted": "blue"
};

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  '& .MuiTablePagination-toolbar': {
    '& p': {
      margin: '0px', // Set your desired margin here
    },
  },
}));

const ReusableTable = ({
    logic, // all the state from useTableLogic
    columns, // list out columns you want to show : columns = ["task_category_id", "task_name"]
    identifierKey, // the id properties of table you want to show - TaskCategoryTable : task_category_id, TaskQuestionTable : task_category_q
    selectedItemByOtherTableFiltering, // for TaskCategoryTable that when clicking a row updates rows in TaskQuestionTable - setSelectedTaskCategoryForQuestion
    setSelectedItemByOtherTableFiltering, // the page component will send setSelectedItemByOtherTableFiltering= {setSelectedTaskCategoryForQuestion}
    identifierKeyOfFilteringTable, // id properties of its filtering table, for TaskCategoryTable it will be null and for TaskQuestionTable - it is task_category_id.
    title, // title of the table
    RegisterFormComponent, // register
    theme, // pass the theme
    //✨✨start  optional prop for CID
    productData, 
    handleSendSummaryEmail,
    //🔚🔚end optional prop for CID
    //✨✨start optional prop for CID Task
    userData,
    taskCategoryData,
    isTaskTable = false,
    //🔚🔚end optional prop for CID Task
  }) => {
    const {
      data,
      loading,
      error,
      searchQuery,
      handleSearchChange,
      anchorEl,
      handleOpenFilter,
      filterColumn,
      filterSearch,
      setFilterSearch,
      filters,
      handleFilterChange,
      clearFilter,
      page,
      rowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
      editingRowId,
      setEditingRowId,
      editValues,
      setEditValues,
      handleSaveClick,
      menuAnchor,
      handleMenuOpen,
      handleMenuClose,
      selectedItem,
      handleEditClick,
      handleDeleteClick,
      deleteDialogOpen,
      handleCancelDelete,
      handleConfirmDelete,
      localError,
      setLocalError,
      success,
      setSuccess,
      successMessage,
      setSuccessMessage,
      refreshData,
      totalDataCount,
      setAnchorEl,
      uniqueFilterValues,
      handleOpenAnswers,
      answerModalOpen,
      setAnswerModalOpen,
    } = logic;   

    const { isAdmin } = useContext(AuthContext);

    return (
        <ThemeProvider theme={theme}>
            <Paper sx={paperStyles(theme)} >
                {loading ? (
                        <div style={{ textAlign: "center", marginTop: "20px" }}>
                            <CircularProgress />
                        </div>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : (
                    <>  { identifierKeyOfFilteringTable === identifierKey ? (
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: "5px" }}>
                                {title}
                            </Typography> ) : (
                            <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: "5px" }}>
                                {title} for ID : {selectedItemByOtherTableFiltering[identifierKeyOfFilteringTable]}  {/*🐦‍🔥🐦‍🔥🐦‍🔥🔥*/ }
                            </Typography>
                            )
                        }
                        {/* ✅ Container for Search Bar & Register Button */}
                        <Box sx={boxStyles}>
                            {/* 🔍 Global Search */}
                            <TextField
                                placeholder="Search ..."
                                variant="outlined"
                                sx={searchTextFieldStyles(theme)}
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
                            <RegisterFormComponent refreshData={refreshData} setLocalError={setLocalError} setSuccess={setSuccess} setSuccessMessage={setSuccessMessage} identifierKeyOfFilteringTable={selectedItemByOtherTableFiltering[identifierKeyOfFilteringTable]} />
                        </Box>

                        <TableContainer className="pt-3" style={{width: "100%"}}>
                            <Table>
                                {/* TABLE HEAD WITH FILTER ICONS */}
                                <TableHead>
                                    <TableRow >
                                        {columns.map((column) => (
                                            <TableCell key={column} style={{ textAlign: "center"}}>
                                                <span 
                                                    style={{ fontWeight: "bold", fontSize: "0.7rem", cursor: "pointer" }} 
                                                    onClick={(e) => handleOpenFilter(e, column)}
                                                >
                                                    {column === identifierKey ? "ID" :
                                                    column === "rework_or_not" ? "Rework" :
                                                    column === "ots_or_not" ? "OTS" :
                                                    column === "part_number" ? "Part Number" :
                                                    column === "next_rev" ? "Next Rev" :
                                                    column === "created_date" ? "Created Date" :
                                                    column === "closing_date" ? "Closing Date" :
                                                    column === "change_notice" ? "Change Notice" :
                                                    column === "task_name" ? "Task Name" :
                                                    column === "submitted_date" ? "Submitted Date" :
                                                    column === "approval_date" ? "Approval Date" :
                                                    column === "assignee_name" ? "PIC" :
                                                    column === "question_name" ? "Question Name" :
                                                    column === "approver_name" ? "Approver Name" :
                                                    column === "dependency_cid_id" ? "Depending Task Id" :
                                                    column === "dependency_date" ? "Depending Days" :
                                                    column[0].toLocaleUpperCase() + column.slice(1)}
                                                </span>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                
                                {/*🦤🦤🦤🦤🦤🦤🦤🦤 TABLE BODY */}
                                <TableBody>
                                    {data.map((dataItem) => (
                                        <TableRow
                                            key={dataItem[identifierKey]}
                                            hover
                                            sx={{
                                            height: "30px",
                                            cursor: "pointer",
                                            transition: "background 0.2s ease-in-out",
                                            "&:hover": { backgroundColor: "#f5f5f5" },
                                            backgroundColor: selectedItemByOtherTableFiltering?.[identifierKeyOfFilteringTable] === dataItem[identifierKeyOfFilteringTable] && identifierKey === identifierKeyOfFilteringTable ? "#89A0B6" : "inherit",
                                            }}
                                            onClick= {setSelectedItemByOtherTableFiltering ? () => setSelectedItemByOtherTableFiltering(dataItem) : null} //🆕 Select category on row click
                                        >
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={column}
                                                    sx={{
                                                    fontSize: "0.75rem",
                                                    padding: "8px 12px",
                                                    whiteSpace:
                                                        editingRowId === dataItem[identifierKey]
                                                        ? "normal" // Allows multiline editing clearly
                                                        : column.toLowerCase().includes("date") || column === "deadline" || column === "status" || column === "part_number"
                                                        ? "nowrap"
                                                        : "nowrap",
                                                    wordBreak: "break-word",
                                                    overflow: editingRowId === dataItem[identifierKey] ? "auto" : "hidden",
                                                    textOverflow: editingRowId === dataItem[identifierKey] ? "clip" : "ellipsis",
                                                    maxWidth: editingRowId === dataItem[identifierKey] ? "none" : "250px",
                                                    maxHeight: "4.5rem",
                                                    verticalAlign: "center",
                                                    textAlign: "center"
                                                    }}
                                                >
                                                {editingRowId === dataItem[identifierKey] ? (
                                                    // EDIT MODE
                                                    column.toLowerCase().includes("deadline") ? (
                                                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                            <DatePicker
                                                            sx={{
                                                                "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                            }}
                                                            value={editValues[column] ? new Date(editValues[column]) : null}
                                                            onChange={(newValue) => {
                                                                setEditValues((prev) => ({
                                                                ...prev,
                                                                [column]: newValue?.toISOString().split('T')[0] || ""
                                                                }));
                                                            }}
                                                            renderInput={(params) => <TextField size="small" style={{minWidth: "200px"}} {...params} />}
                                                            />
                                                        </LocalizationProvider>
                                                    ) : column.toLowerCase() === "status" ? (
                                                        <Select
                                                            sx={{
                                                                "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                            }}
                                                            size="medium"
                                                            value={editValues[column] || ""}
                                                            onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                [column]: e.target.value
                                                            }))
                                                            }
                                                        >
                                                            {["in-progress", "overdue", "complete", "submitted", "pending", "cancel"].map((status) => (
                                                            <MenuItem key={status} value={status} sx={{
                                                                "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                            }}
                                                            >
                                                                {status}
                                                            </MenuItem>
                                                            ))}
                                                        </Select>
                                                    ) : (column.toLowerCase().includes("id") && column !== "dependency_cid_id") || column === "approver_name" || (column.toLowerCase().includes("date") && column !== "dependency_date")  ? (
                                                        <span>{dataItem[column]}</span>
                                                    ) : typeof dataItem[column] === "boolean" ? (
                                                        <Select
                                                            sx={{
                                                                "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                            }}
                                                            size="small"
                                                            value={editValues[column] || ""}
                                                            onChange={(e) =>
                                                            setEditValues((prev) => ({
                                                                ...prev,
                                                                [column]: e.target.value
                                                            }))
                                                            }
                                                        >
                                                            {["true", "false"].map((status) => (
                                                            <MenuItem key={status} value={status}>
                                                                {status}
                                                            </MenuItem>
                                                            ))}
                                                        </Select>
                                                    ) : column === "part_number" && productData ? (
                                                        <Autocomplete
                                                            options={productData}
                                                            getOptionLabel={(opt) => `${opt.part_number} - ${opt.part_name}`}
                                                            size="small"
                                                            disablePortal={true} // this allows overflow outside table cell
                                                            PopperComponent={(props) => (
                                                            <Popper {...props} placement="top-start" style={{ width: props.style.width }} />
                                                            )}
                                                            PopperProps={{
                                                            sx: {
                                                                minWidth: "300px !important", // or your preferred width
                                                            },
                                                            }}
                                                            onChange={(_, value) => setEditValues((prev) => ({ ...prev, [column]: value?.part_number }))}
                                                            renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                sx={{
                                                                "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                                minWidth: "400px !important",
                                                                }}
                                                            />
                                                            )}
                                                            ListboxProps={{
                                                            sx: {
                                                                "& .MuiAutocomplete-option": {
                                                                fontSize: "0.7rem", // Adjust the font size here
                                                                },
                                                                maxHeight: "150px", // Set the max height for the listbox
                                                                overflow: "auto", // Enable scrolling
                                                            },
                                                            }}
                                                        />
                                                    ) : column === "assignee_name" && userData ? (
                                                        <Autocomplete
                                                            options={userData}
                                                            getOptionLabel={(opt) => `${opt.username}`}
                                                            size="small"
                                                            disablePortal={true} // this allows overflow outside table cell
                                                            PopperComponent={(props) => (
                                                                <Popper {...props} placement="top-start" style={{ width: props.style.width }} />
                                                            )}
                                                            PopperProps={{
                                                                sx: {
                                                                minWidth: "300px !important", // or your preferred width
                                                                },
                                                            }}
                                                            onChange={(_, value) => setEditValues((prev) => ({ ...prev, [column]: value?.username }))}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                {...params}
                                                                sx={{
                                                                    "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                    "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                    "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                    "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                                    minWidth: "200px !important",
                                                                }}
                                                                />
                                                            )}
                                                            ListboxProps={{
                                                                sx: {
                                                                "& .MuiAutocomplete-option": {
                                                                    fontSize: "0.7rem", // Adjust the font size here
                                                                },
                                                                maxHeight: "200px", // Set the max height for the listbox
                                                                overflow: "auto", // Enable scrolling
                                                                },
                                                            }}
                                                        />
                                                    ) : column === "task_name" && taskCategoryData ? (
                                                        <Autocomplete
                                                            options={taskCategoryData}
                                                            getOptionLabel={(opt) => `${opt.task_name}`}
                                                            size="small"
                                                            disablePortal={true} // this allows overflow outside table cell
                                                            PopperComponent={(props) => (
                                                                <Popper {...props} placement="top-start" style={{ width: props.style.width }} />
                                                            )}
                                                            PopperProps={{
                                                                sx: {
                                                                minWidth: "300px !important", // or your preferred width
                                                                },
                                                            }}
                                                            onChange={(_, value) => setEditValues((prev) => ({ ...prev, [column]: value?.task_name }))}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                {...params}
                                                                sx={{
                                                                    "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                    "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                    "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                    "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                                    minWidth: "250px !important",
                                                                }}
                                                                />
                                                            )}
                                                            ListboxProps={{
                                                                sx: {
                                                                "& .MuiAutocomplete-option": {
                                                                    fontSize: "0.7rem", // Adjust the font size here
                                                                },
                                                                maxHeight: "200px", // Set the max height for the listbox
                                                                overflow: "auto", // Enable scrolling
                                                                },
                                                            }}
                                                        />
                                                    ) : column === "dependency_cid_id" ? (
                                                        <Autocomplete
                                                            options={data}
                                                            getOptionLabel={(opt) => `${opt.cid_task_id}`}
                                                            size="small"
                                                            disablePortal={true} // this allows overflow outside table cell
                                                            PopperComponent={(props) => (
                                                                <Popper {...props} placement="top-start" style={{ width: props.style.width }} />
                                                            )}
                                                            PopperProps={{
                                                                sx: {
                                                                minWidth: "300px !important", // or your preferred width
                                                                },
                                                            }}
                                                            onChange={(_, value) => setEditValues((prev) => ({ ...prev, [column]: value?.part_number }))}
                                                            renderInput={(params) => (
                                                                <TextField
                                                                {...params}
                                                                sx={{
                                                                    "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                                                    "& .MuiAutocomplete-input": { fontSize: "0.8rem" },
                                                                    "& .MuiOutlinedInput-input": { fontSize: "0.8rem" },
                                                                    "& .MuiSelect-select": { fontSize: "0.8rem" },
                                                                    minWidth: "110px !important",
                                                                }}
                                                                />
                                                            )}
                                                            ListboxProps={{
                                                                sx: {
                                                                "& .MuiAutocomplete-option": {
                                                                    fontSize: "0.7rem", // Adjust the font size here
                                                                },
                                                                maxHeight: "200px", // Set the max height for the listbox
                                                                overflow: "auto", // Enable scrolling
                                                                },
                                                            }}
                                                        />
                                                    ) 
                                                    : (
                                                        <TextField
                                                            variant="outlined"
                                                            multiline
                                                            fullWidth
                                                            InputProps={{
                                                                sx: {
                                                                fontSize: "0.8rem",
                                                                padding: "4px 8px",
                                                                whiteSpace: "normal",
                                                                overflow: "visible",
                                                                textOverflow: "clip",
                                                                minWidth: column === "next_rev"? "100px !important" : column === "supplier_id"? "200px !important" : column === "dependency_date"? "50px !important" : "350px !important" ,
                                                                }
                                                            }}
                                                            value={editValues[column] || ""}
                                                            onChange={(e) => setEditValues((prev) => ({ ...prev, [column]: e.target.value }))}
                                                        />
                                                    )
                                                ) : (
                                                    // VIEW MODE
                                                    <Tooltip
                                                        title={
                                                            // this is to show product information of CID Table
                                                            column === "part_number" && productData
                                                            ? (
                                                                <div style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                                                                {(() => {
                                                                    const product = productData.find(p => p.part_number === dataItem[column]);
                                                                    return product ? (
                                                                    <>
                                                                        <div><strong>Product ID:</strong> {product.product_id}</div>
                                                                        <div><strong>Model:</strong> {product.model}</div>
                                                                        <div><strong>Part Number:</strong> {product.part_number}</div>
                                                                        <div><strong>Part Name:</strong> {product.part_name}</div>
                                                                        <div><strong>Owner:</strong> {product.owner}</div>
                                                                    </>
                                                                    ) : (
                                                                    "No product info available"
                                                                    );
                                                                })()}
                                                                </div>
                                                            ) :
                                                            (column === "assignee_name" || column === "approver_name") && userData
                                                            ? (
                                                                <div style={{ fontSize: "0.9rem", lineHeight: "1.5" }}>
                                                                {(() => {
                                                                    const user = userData.find(u => u.username === dataItem[column]);
                                                                    return user ? (
                                                                    <>
                                                                        <div><strong>User Id:</strong> {user.user_id}</div>
                                                                        <div><strong>User Name:</strong> {user.username}</div>
                                                                        <div><strong>Role:</strong> {user.role_name}</div>
                                                                        <div><strong>Department:</strong> {user.department_name}</div>
                                                                    </>
                                                                    ) : (
                                                                    "No product info available"
                                                                    );
                                                                })()}
                                                                </div>
                                                            )
                                                            : ( <span style={{fontSize: "0.9rem", lineHeight: "1.5", whiteSpace: "pre-line"}}>
                                                                    {dataItem[column]?.toString().split("+").join("\n") || ""}
                                                                </span>
                                                            )
                                                        }
                                                        arrow
                                                        placement="top"
                                                        componentsProps={{
                                                            tooltip: {
                                                            sx: {
                                                                fontSize: "0.8rem",
                                                                padding: "12px",
                                                                backgroundColor: "#333",
                                                                color: "#fff",
                                                                borderRadius: "6px",
                                                                whiteSpace: "normal",
                                                            },
                                                            },
                                                        }}
                                                    >
                                                        <span>
                                                            {typeof dataItem[column] === "boolean" ? (
                                                            dataItem[column] ? (
                                                                <CheckIcon sx={{ color: "green" }} />
                                                            ) : (
                                                                <ClearIcon sx={{ color: "red" }} />
                                                            )
                                                            ) : (column.toLowerCase().includes("date") && column !== "dependency_date" ) || column === "deadline" ? (
                                                            dataItem[column] ?format(new Date(dataItem[column]), "dd-MMM-yy") : ""
                                                            ) : column.toLowerCase() === "status" ? (
                                                            <span
                                                                style={{
                                                                padding: "2px 8px",
                                                                borderRadius: "12px",
                                                                backgroundColor:
                                                                statusColors[dataItem[column]?.toLowerCase()] || "#ddd",
                                                                color: "#fff",
                                                                fontWeight: 500,
                                                                fontSize: "0.7rem",
                                                                textTransform: "capitalize",
                                                                }}
                                                            >
                                                                {dataItem[column]}
                                                            </span>
                                                            ) : (
                                                            dataItem[column]
                                                            )}
                                                        </span>
                                                    </Tooltip>
                                                )}
                                                </TableCell>
                                            ))}
                                            {/* ACTIONS: If editing => show Save button, else show 3-dot */}
                                            <TableCell align="right">
                                            {editingRowId === dataItem[identifierKey] ? (
                                                <Box sx= {{display: 'flex', gap: 1}}>
                                                <Button variant="contained" onClick={() => handleSaveClick(dataItem[identifierKey])}>
                                                    Save
                                                </Button>
                                                <Button variant="contained" color="error" onClick={() => setEditingRowId(null)}>
                                                    Cancel
                                                </Button>
                                                </Box>
                                            ) : (
                                                <IconButton onClick={(e) => handleMenuOpen(e, dataItem)}>
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
                            count={totalDataCount}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[3, 5, 10, 15, 20,50]}
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
                            uniqueFilterValues
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

                        {/* 💕🆕 3-DOT MENU (EDIT / DELETE / SEND SUMMARY EMAIL) */}
                        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
                            {/* Show Edit and Delete only if user is Admin */}
                            {isAdmin ? [
                                <MenuItem key="edit" onClick={() => handleEditClick(selectedItem)}>
                                <EditIcon sx={{ marginRight: 1 }} />
                                Edit
                                </MenuItem>,
                                <MenuItem key="delete" onClick={() => handleDeleteClick(selectedItem)} sx={{ color: "red" }}>
                                <DeleteIcon sx={{ marginRight: 1 }} />
                                Delete
                                </MenuItem>,
                            ] : null}
                            {/* Conditionally show Send Summary Email if function is passed */}
                            {isAdmin && handleSendSummaryEmail && (
                                <MenuItem key="send-email" onClick={() => handleSendSummaryEmail(selectedItem)}>
                                    <LocalPostOfficeIcon sx={{ marginRight: 1, color: "blue" }} />
                                    Send Summary
                                </MenuItem>
                            )}

                            {isTaskTable &&  (
                                <MenuItem onClick={handleOpenAnswers}>
                                    <VisibilityIcon sx={{marginRight: 1}} />
                                    View Answers
                                </MenuItem>
                            )}
                        </Menu>

                        {/* Render AnswerModal when Open */}
                        {isTaskTable && selectedItem && (
                            <AnswerModal
                            open={answerModalOpen}
                            onClose={() => setAnswerModalOpen(false)}
                            task={selectedItem}
                            />
                        )}

                        {/*Deletion Confirm Dialog*/}
                        <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    Are you sure you want to delete ?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCancelDelete}>No</Button>
                                <Button onClick={() => handleConfirmDelete(selectedItem)} variant="contained" color="error">
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                        
                        {/* ✅ Error Snackbar */}
                        <Portal>
                            <Snackbar
                                open={!!localError} // open if there is a error
                                autoHideDuration={4000}
                                onClose={() => setLocalError(null)}
                                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // position at the top right of the screen
                                sx={snackBarStyles}
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
                                sx={snackBarStyles}
                            >
                                <Alert severity="success">{successMessage}</Alert>
                            </Snackbar>
                        </Portal>
                    </>
                )}
            </Paper>
        </ThemeProvider>
    );
};

export default ReusableTable;
