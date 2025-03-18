import React from "react";
import {
  ThemeProvider,
  Paper,
  CircularProgress,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
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
  Typography,
  Tooltip,
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
import { keyframes } from "@emotion/react";

const sway = keyframes`
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
`;

const ReusableTable = ({
  logic,
  columns,
  identifierKey,
  title,
  RegisterFormComponent,
  theme,
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
    success,
    successMessage,
    refreshData,
    totalDataCount,
  } = logic;

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <Paper>...</Paper>
          <Box>...</Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {column.toUpperCase()}
                      <IconButton onClick={(e) => handleOpenFilter(e, column)}>
                        <FilterListIcon />
                      </IconButton>
                    </TableCell>
                  ))}
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {data.map((item) => (
                  <TableRow key={item[identifierKey]} hover>
                    {columns.map((column) => (
                      <TableCell key={column}>
                        {editingRowId === item[identifierKey] && column !== identifierKey ? (
                          <TextField
                            variant="outlined"
                            size="small"
                            value={editValues[column] || ""}
                            onChange={(e) =>
                              setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
                            }
                          />
                        ) : (
                          <Tooltip title={item[column]} arrow>
                            <span>{item[column]}</span>
                          </Tooltip>
                        )}
                      </TableCell>
                    ))}

                    <TableCell align="right">
                      {editingRowId === item[identifierKey] ? (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button variant="contained" onClick={handleSaveClick}>Save</Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => setEditingRowId(null)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      ) : (
                        <IconButton onClick={(e) => handleMenuOpen(e, item)}>
                          <MoreVertIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalDataCount}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15, 20, 50]}
          />

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Search filter..."
              size="small"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <List>...</List>
            <Button onClick={clearFilter} startIcon={<ClearIcon />}>
              Clear Filter
            </Button>
          </Menu>

          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleEditClick(selectedItem)}>
              <EditIcon /> Edit
            </MenuItem>
            <MenuItem onClick={() => handleDeleteClick(selectedItem)}>
              <DeleteIcon /> Delete
            </MenuItem>
          </Menu>

          <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>...</Dialog>

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
        </>
      )}
    </ThemeProvider>
  );
};

export default ReusableTable;
