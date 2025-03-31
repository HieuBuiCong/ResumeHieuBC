import { useEffect, useState, useMemo } from "react";

const useTableLogic = ({
  fetchDataFn, // async function to fetch the Table data - TaskQuestionTable : getTaskQuestionData from taskQuestionService.js
  filterCondition = null,
  identifierKey, // with TaskQuestionTable : task_category_question_id, with TaskCategoryTable: task_category_id.
  deleteFn, // async function to delete table row - TaskQuestionTable : taskQuestionDelete
  updateFn, // async function to delete table row - TaskQuestionTable : taskQuestionUpdate
  itemLabelKey, // with TaskQuestionTable : task_name, with TaskCategoryTable: question_name. 
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});

  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [localError, setLocalError ] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Manange Answer Modal State
  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const handleOpenAnswers = () => {
    console.log("Opening AnswerModal for Task:", selectedItem);
    setAnswerModalOpen(true);
    handleMenuClose();
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchDataFn();
      const filteredResult = filterCondition ? result.filter(filterCondition) : result;
      setData(filteredResult);
    } catch (err) {
      setError(err.message || "Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchDataFn, filterCondition]);

  const refreshData = () => fetchData();

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleOpenFilter = (event, column) => {
    setAnchorEl(event.currentTarget);
    setFilterColumn(column);
    setFilterSearch("");
  };

  const handleFilterChange = (value) => {
    const strValue = String(value).trim();
    setFilters((prevFilters) => {
      const columnFilters = prevFilters[filterColumn] || [];
      
      return {
        ...prevFilters,
        [filterColumn]: columnFilters.includes(strValue)
          ? columnFilters.filter((v) => v !== strValue) // Uncheck if already selected
          : [...columnFilters, strValue], // Add new selection
      };
    });
  };

  const clearFilter = () => {
    setFilters((prev) => {
      const updatedFilters = { ...prev };
      delete updatedFilters[filterColumn];
      return updatedFilters;
    });
    setAnchorEl(null);
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event, item) => {
    setMenuAnchor(event.currentTarget);
    setSelectedItem(item);                           
  };

  const handleMenuClose = () => setMenuAnchor(null);

  const handleEditClick = (item) => {
    setEditingRowId(item[identifierKey]);
    setEditValues({ ...item });
    handleMenuClose();
  };

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      console.log(editValues);
      await updateFn(selectedItem[identifierKey], editValues);
      setSuccess(true);
      setSuccessMessage(`${selectedItem[itemLabelKey]} updated successfully`);
    } catch (err) {
      console.log(err);
      setLocalError(err.error || "Failed to update item");
    } finally {
      setLoading(false);
      setSelectedItem(null);
      setEditingRowId(null);
      refreshData();
    }
  };

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
      console.log(err);
      setLocalError(err?.error || err?.message || "Failed to delete item");
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
      data.filter((item) =>
        Object.keys(filters).every((column) => {
          const filterValues = filters[column];
          if (!filterValues || filterValues.length === 0) return true;
   
          return filterValues.includes(String(item[column]).trim());
        })
      )
      .filter((item) =>
        Object.values(item)
          .map((v) => String(v).toLowerCase())
          .join(" ")
          .includes(searchQuery.trim().toLowerCase())
      ),
    [data, filters, searchQuery]
  );

  const paginatedData = useMemo(
    () => filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredData, page, rowsPerPage]
  );

    // Ensure all unique values are shown in the filter dropdown
    const uniqueFilterValues = useMemo(
      () =>
        Array.from(new Set(data.map((dataItem) => String(dataItem[filterColumn])))),
      [data, filterColumn]
    );
  

  return {
    data: paginatedData,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    anchorEl,
    setAnchorEl,
    filterColumn,
    setFilterColumn,
    filterSearch,
    setFilterSearch,
    handleOpenFilter,
    handleFilterChange,
    clearFilter,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    menuAnchor,
    handleMenuOpen,
    handleMenuClose,
    selectedItem,
    editingRowId,
    setEditingRowId,
    editValues,
    setEditValues,
    handleEditClick,
    handleSaveClick,
    handleDeleteClick,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleCancelDelete,
    handleConfirmDelete,
    localError,
    setLocalError,
    success,
    setSuccess,
    successMessage,
    setSuccessMessage,
    refreshData,
    totalDataCount: filteredData.length,
    handleSearchChange,
    uniqueFilterValues,
    handleOpenAnswers, // update for handle open answer modal.
    answerModalOpen,
    setAnswerModalOpen,
  };
};

export default useTableLogic;
