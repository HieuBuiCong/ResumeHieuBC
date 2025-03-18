import { useState, useEffect } from "react";

const useTableLogic = ({ fetchDataFunction, columns, selectionHandler }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchDataFunction();
        setData(result);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFunction();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (row) => {
    setEditingRowId(row[columns[0]]);
    setEditValues({ ...row });
  };

  const handleSelectRow = (row) => {
    setSelectedRow(row);
    selectionHandler(row);
  };

  const filteredData = data
    .filter((row) =>
      Object.values(row)
        .map((v) => String(v).toLowerCase())
        .join(" ")
        .includes(searchQuery.toLowerCase())
    );

  return {
    data: filteredData,
    searchQuery,
    setSearchQuery,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    loading,
    error,
    refreshData,
    handleSearchChange,
    handleEditClick,
    editingRowId,
    editValues,
    setEditValues,
    selectedRow,
    handleSelectRow,
  };
};

export default useTableLogic;
📌 2️⃣ Create ReusableTable.js (Reused Table Component)
This will keep all original styling, hover effects, buttons, and features intact.

jsx
Copy
Edit
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
  InputAdornment,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ReusableTable = ({
  columns,
  useTable,
  title,
  onDelete,
  onEdit,
  registerForm,
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
    handleEditClick,
    editingRowId,
    editValues,
    setEditValues,
    selectedRow,
    handleSelectRow,
  } = useTable;

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", p: 2, borderRadius: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", mb: 2 }}>
        {title}
      </Typography>

      {/* 🔹 Search Bar & Add Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <TextField
          placeholder="Search..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ maxWidth: "250px", borderRadius: "8px" }}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
        />
        {registerForm}
      </Box>

      {/* 🔹 Table Content */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column}>
                  <strong>{column.toUpperCase()}</strong>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <Typography color="error">{error}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={row[columns[0]]}
                  hover
                  sx={{
                    backgroundColor: selectedRow?.[columns[0]] === row[columns[0]] ? "#f5f5f5" : "inherit",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                  onClick={() => handleSelectRow(row)}
                >
                  {columns.map((column) => (
                    <TableCell key={column}>
                      {editingRowId === row[columns[0]] ? (
                        <TextField
                          variant="outlined"
                          size="small"
                          value={editValues[column] || ""}
                          onChange={(e) => setEditValues({ ...editValues, [column]: e.target.value })}
                        />
                      ) : (
                        row[column]
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <IconButton onClick={() => handleEditClick(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => onDelete(row)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReusableTable;
