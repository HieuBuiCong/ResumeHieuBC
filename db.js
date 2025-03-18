const {
  data,                  // paginated and filtered data
  loading,               // loading state boolean
  error,                 // error message or null
  
  searchQuery,           // current global search input
  handleSearchChange,    // handler for global search input
  
  filters,               // object containing active column filters
  handleOpenFilter,      // open filter dropdown handler
  handleFilterChange,    // toggle filter selection handler
  clearFilter,           // clear filter selection handler
  anchorEl,              // anchor for filter menu positioning
  setAnchorEl,           // setter for anchorEl (filter menu)
  
  page,                  // current page number
  rowsPerPage,           // rows displayed per page
  handleChangePage,      // pagination page-change handler
  handleChangeRowsPerPage, // rows-per-page-change handler
  
  menuAnchor,            // anchor for three-dot (menu) positioning
  handleMenuOpen,        // open row action menu handler
  handleMenuClose,       // close row action menu handler
  
  selectedItem,          // currently selected item (for edit/delete actions)
  
  editingRowId,          // ID of the row currently being edited
  editValues,            // values being edited
  setEditValues,         // setter for edited values
  
  handleEditClick,       // handler to initiate row editing
  handleSaveClick,       // save edited row data handler
  
  deleteDialogOpen,      // state of delete confirmation dialog
  handleDeleteClick,     // handler for initiating delete action
  handleConfirmDelete,   // handler confirming delete action
  handleCancelDelete,    // cancel delete action handler
  
  localError,            // local errors (CRUD related)
  success,               // CRUD operation success state
  successMessage,        // success message text
  
  refreshData,           // manually refresh table data function
} = useTableLogic({
  fetchDataFn: getTaskCategoryData,
  identifierKey: "task_category_id",
  deleteFn: taskCategoryDelete,
  updateFn: taskCategoryUpdate,
  itemLabelKey: "task_name",
});
