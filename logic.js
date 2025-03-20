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
  Snackbar,
  Alert,
  Portal,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { margin, styled } from '@mui/system';



// 🌑🌚🌚🌚🎯 dark mode
import { useDarkMode } from "../../context/DarkModeContext";
import { createTheme, ThemeProvider } from "@mui/material";
import {  paperStyles, boxStyles, searchTextFieldStyles, snackBarStyles } from "./tableStyle.js";

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
    } = logic;

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
                            {title} for ID : {selectedItemByOtherTableFiltering.identifierKeyOfFilteringTable}  {/*🐦‍🔥🐦‍🔥🐦‍🔥🔥*/ }
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
                        <RegisterFormComponent refreshData={refreshData} setLocalError={setLocalError} setSuccess={setSuccess} setSuccessMessage={setSuccessMessage} />
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
                                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataItem) => (
                                    <TableRow
                                        key={dataItem[identifierKey]}
                                        hover
                                        sx={{
                                        height: "20px",
                                        cursor: "pointer",
                                        transition: "background 0.2s ease-in-out",
                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                        backgroundColor: selectedItemByOtherTableFiltering?.[identifierKeyOfFilteringTable] === dataItem[identifierKeyOfFilteringTable] ? "#f5f5f5" : "inherit",
                                        }}
                                        onClick= {() => setSelectedItemByOtherTableFiltering(dataItem)} //🆕 Select category on row click
                                    >
                                        {columns.map((column) => (
                                        <TableCell key={column} sx={{ fontSize: "0.9rem", maxWidth: "150px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                            {column === "task_category_id" ? (
                                            <span>{dataItem[column]}</span>
                                            ) : editingRowId === dataItem[identifierKey] ? (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={editValues[column] || ""}
                                                    onChange={(e) =>
                                                    setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
                                                    }
                                                />
                                            ) : (
                                                <Tooltip title={dataItem[column]} arrow>
                                                <span>{dataItem[column]}</span>
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
                        Array.from(new Set(dataItemData.map((dataItem) => String(dataItem[filterColumn]))))
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
                        <MenuItem onClick={() => handleEditClick(selectedItem)}>
                            <EditIcon sx={{ marginRight: 1 }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClick(selectedItem)} sx={{ color: "red" }}>
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
