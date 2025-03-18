import { useState, useEffect } from "react";

/**
 * Custom hook to manage table logic (fetching data, filtering, editing, etc.)
 * @param {Function} fetchDataFunction - API function to fetch data
 * @param {Function} updateDataFunction - API function to update data
 * @param {Function} deleteDataFunction - API function to delete data
 * @param {Function} selectionHandler - Function to handle row selection (if needed)
 * @returns {Object} - State and handlers for table management
 */

const useTableLogic = (fetchDataFunction, updateDataFunction, deleteDataFunction, selectionHandler = null) => {
  // 📝 Table Data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔍 Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  // 📄 Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 📝 Editing States
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});

  // 🚀 Snackbar States
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 🏗️ Row Selection
  const [selectedRow, setSelectedRow] = useState(null);

  // 📡 Fetch Data on Mount & Refresh
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

  // ✅ Handle Row Selection (For Click Highlight & Related Data Updates)
  const handleRowSelection = (rowData) => {
    setSelectedRow(rowData);
    if (selectionHandler) selectionHandler(rowData);
  };
  
  // ✅ Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // ✅ Apply Filters to Table Data
  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: prev[column]?.includes(value)
        ? prev[column].filter((v) => v !== value) // Remove value if already in filter
        : [...(prev[column] || []), value], // Add value if not present
    }));
  };
  
  // ✅ Clear Filters for a Specific Column
  const clearFilter = (column) => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      delete updatedFilters[column];
      return updatedFilters;
    });
  };
  
  // ✅ Handle Editing Row (Clicking "Edit" Button)
  const handleEditClick = (rowData) => {
    setEditingRowId(rowData.id);
    setEditValues({ ...rowData }); // Pre-fill text fields with row data
  };
  
  // ✅ Handle Save Edit (API Call)
  const handleSaveClick = async () => {
    try {
      setLoading(true);
      await updateDataFunction(editingRowId, editValues);
      setSuccess(true);
      setSuccessMessage("Successfully updated data.");
      refreshData();
    } catch (err) {
      setLocalError(err.message || "Failed to update data.");
    } finally {
      setLoading(false);
      setEditingRowId(null);
    }
  };
  
  // ✅ Handle Delete Row (API Call)
  const handleDeleteClick = async (rowData) => {
    try {
      setLoading(true);
      await deleteDataFunction(rowData.id);
      setSuccess(true);
      setSuccessMessage("Successfully deleted data.");
      refreshData();
    } catch (err) {
      setLocalError(err.message || "Failed to delete data.");
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ Refresh Data After Updates
  const refreshData = async () => {
    try {
      setLoading(true);
      const updatedData = await fetchDataFunction();
      setData(updatedData);
    } catch (err) {
      setLocalError(err.message || "Failed to refresh data.");
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ Handle Pagination Changes
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // ✅ Apply Search & Filters
  const filteredData = data
    .filter((item) =>
      Object.keys(filters).every((column) =>
        filters[column]?.length ? filters[column].includes(String(item[column])) : true
      )
    )
    .filter((item) =>
      Object.values(item)
        .map((v) => String(v).toLowerCase())
        .join(" ")
        .includes(searchQuery.toLowerCase())
    );

return {
  data: filteredData,
  loading,
  error,
  searchQuery,
  setSearchQuery,
  handleSearchChange,
  filters,
  setFilters,
  handleFilterChange,
  clearFilter,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  editingRowId,
  setEditingRowId,
  editValues,
  setEditValues,
  handleEditClick,
  handleSaveClick,
  handleDeleteClick,
  localError,
  setLocalError,
  success,
  setSuccess,
  successMessage,
  setSuccessMessage,
  selectedRow,
  setSelectedRow,
  handleRowSelection,
  refreshData,
};

export default useTableLogic;
