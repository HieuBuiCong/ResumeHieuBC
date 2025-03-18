import { useEffect, useState, useMemo } from "react";

const useTableLogic = ({
  fetchDataFn,
  identifierKey,
  filterCondition = null,
  deleteFn,
  updateFn,
  itemLabelKey,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFn();
      const filteredResult = filterCondition ? result.filter(filterCondition) : result;
      setData(filteredResult);
    } catch (error) {
      setError(error.message || "Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchDataFn, filterCondition]);

  const refreshData = () => fetchData();

  // ✅ Global Search
  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  // ✅ Open Filter Menu
  const handleOpenFilter = (event, column) => {
    setAnchorEl(event.currentTarget);
    setFilterColumn(column);
    setFilterSearch("");
  };

  // ✅ Toggle Filter Selection
  const handleFilterChange = (value) => {
    const strValue = String(value);
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
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 💕🆕 OPEN & CLOSE 3-DOT MENU
  const handleMenuOpen = (event, item) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  // 🦤 Edit Row
  const handleEditClick = (item) => {
    setEditingRowId(item[identifierKey]);
    setEditValues({ ...item });
    handleMenuClose();
  };

  // 🦤 Save Row
  const handleSaveClick = async () => {
    try {
      setLoading(true);
      await updateFn(selectedItem[identifierKey], editValues);
      setSuccess(true);
      setSuccessMessage(`${selectedItem[itemLabelKey]} updated successfully`);
    } catch (err) {
      setLocalError(err.message || "Failed to update item");
    } finally {
      setLoading(false);
      setSelectedItem(null);
      setEditingRowId(null);
      refreshData();
    }
  };

  // 🦤 Delete Row with Dialog
  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteFn(selectedItem[identifierKey]);
      setSuccess(true);
      setSuccessMessage(`${selectedItem[itemLabelKey]} deleted successfully`);
    } catch (err) {
      setLocalError(err.message || "Failed to delete item");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedItem(null);
      setEditingRowId(null);
      refreshData();
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const filteredData = useMemo(
    () =>
      data
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
        ),
    [data, filters, searchQuery]
  );

  const paginatedData = useMemo(
    () => filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage]
  );

  return {
    data: paginatedData,
    loading,
    error,
    searchQuery,
    handleSearchChange,
    filters,
    handleOpenFilter,
    handleFilterChange,
    clearFilter,
    anchorEl,
    setAnchorEl,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    menuAnchor,
    handleMenuOpen,
    handleMenuClose,
    selectedItem,
    editingRowId,
    editValues,
    setEditValues,
    handleEditClick,
    handleSaveClick,
    deleteDialogOpen,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    localError,
    success,
    successMessage,
    refreshData,
  };
};

export default useTableLogic;
