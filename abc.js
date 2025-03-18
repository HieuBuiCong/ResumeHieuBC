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
  TablePagination,
  InputAdornment,
  Box,
  Tooltip,
  CircularProgress,
  Typography,
} from "@mui/material";

import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";

import useTableLogic from "../../hooks/useTableLogic";
import { useDarkMode } from "../../context/DarkModeContext";

// ✅ Styled Pagination
const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  "& .MuiTablePagination-toolbar": {
    "& p": {
      margin: "0px",
    },
  },
}));

const ReusableTable = ({
  title,
  columns,
  fetchDataFunction,
  selectionHandler,
  registerFormComponent: RegisterForm,
}) => {
  const {
    data,
    searchQuery,
    handleSearchChange,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    loading,
    error,
    refreshData,
    handleEditClick,
    editingRowId,
    editValues,
    setEditValues,
    selectedRow,
    handleSelectRow,
    success,
    setSuccess,
    successMessage,
    setSuccessMessage,
    localError,
    setLocalError,
  } = useTableLogic({ fetchDataFunction, columns, selectionHandler });

  // Dark Mode
  const { darkMode } = useDarkMode();
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: { main: darkMode ? "#90caf9" : "#1976d2" },
      background: { default: darkMode ? "#121212" : "#f8f9fa" },
      backgroundColor: {
        default: darkMode ? "rgba(33, 31, 31, 0.7)" : "rgba(255,255,255,0.7)",
      },
      text: { primary: darkMode ? "#ffffff" : "#000000" },
    },
  });
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
        <Typography variant="h6" sx={{ color: "red", textAlign: "center" }}>
          {error}
        </Typography>
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
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}
            >
              {title}
            </Typography>

            {/* 🔍 Search & Register Button */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                width: "100%",
              }}
            >
              {/* Search Bar */}
              <TextField
                placeholder={`Search ${title}...`}
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

              {/* Register Button */}
              {RegisterForm && (
                <RegisterForm refreshData={refreshData} setLocalError={setLocalError} setSuccess={setSuccess} setSuccessMessage={setSuccessMessage} />
              )}
            </Box>

            {/* Table */}
            <TableContainer>
              <Table>
                {/* Table Header */}
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column} sx={{ fontWeight: "bold" }}>
                        {column.toUpperCase()}
                        <IconButton>
                          <FilterListIcon />
                        </IconButton>
                      </TableCell>
                    ))}
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>

                {/* Table Body */}
                <TableBody>
                  {data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.id}
                        hover
                        onClick={() => handleSelectRow(row)}
                        sx={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedRow?.id === row.id ? "#f5f5f5" : "inherit",
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell key={column}>
                            {editingRowId === row.id ? (
                              <TextField
                                variant="outlined"
                                size="small"
                                value={editValues[column] || ""}
                                onChange={(e) =>
                                  setEditValues((prev) => ({
                                    ...prev,
                                    [column]: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              <Tooltip title={row[column]} arrow>
                                <span>{row[column]}</span>
                              </Tooltip>
                            )}
                          </TableCell>
                        ))}

                        {/* Actions */}
                        <TableCell>
                          <IconButton onClick={() => handleEditClick(row)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <StyledTablePagination
              component="div"
              count={data.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 15, 20, 50]}
            />
          </Paper>

          {/* ✅ Success Snackbar */}
          <Portal>
            <Snackbar
              open={success}
              autoHideDuration={4000}
              onClose={() => setSuccess(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert severity="success">{successMessage}</Alert>
            </Snackbar>
          </Portal>

          {/* ❌ Error Snackbar */}
          <Portal>
            <Snackbar
              open={!!localError}
              autoHideDuration={4000}
              onClose={() => setLocalError(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert severity="error">{localError}</Alert>
            </Snackbar>
          </Portal>
        </>
      )}
    </ThemeProvider>
  );
};

export default ReusableTable;
