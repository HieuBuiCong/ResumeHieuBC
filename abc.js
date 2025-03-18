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
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState(null);

  // Fetch data when component mounts
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

  // Function to refresh data (used after edit/delete)
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

  // Search Handler
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // Pagination Handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Select Row (for Task Category -> Task Questions)
  const handleSelectRow = (row) => {
    setSelectedRow(row);
    selectionHandler(row);
  };

  // Edit Row
  const handleEditClick = (row) => {
    setEditingRowId(row[columns[0]]);
    setEditValues({ ...row });
  };

  // Apply Filters & Search
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
    success,
    setSuccess,
    successMessage,
    setSuccessMessage,
    localError,
    setLocalError,
  };
};

export default useTableLogic;
