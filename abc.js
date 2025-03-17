const TaskCategoryTable = ({ taskCategoryData, loading, setLoading, error, refreshTaskCategory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterColumn, setFilterColumn] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredTaskCategory = taskCategoryData
    .filter(taskCategory =>
      Object.keys(filters).every(column =>
        filters[column]?.length ? filters[column].includes(String(taskCategory[column])) : true
      ))
    .filter(taskCategory =>
      Object.values(taskCategory)
        .map(String).join(" ").toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

  const handleExportCSV = () => {
    const csv = Papa.unparse(taskCategoryData);
    saveAs(new Blob([csv]), "taskCategory_data.csv");
  };

  const handleMenuOpen = (event, taskCategory) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTaskCategory(taskCategory);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await taskCategoryDelete(selectedTaskCategory.task_category_id);
      setSuccessMessage("Deleted successfully");
      setSuccess(true);
      refreshTaskCategory();
    } catch (err) {
      setLocalError(err.message || "Delete failed");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <TextField
            placeholder="Search..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{ startAdornment: <SearchIcon /> }}
          />
          <IconButton onClick={handleExportCSV}><SaveAltIcon /></IconButton>
        </Box>

        {loading ? (
          <Box textAlign="center"><CircularProgress /></Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell key={column}>
                        {column}
                        <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setFilterColumn(column); }}>
                          <FilterListIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    ))}
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTaskCategory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(taskCategory => (
                      <TableRow key={taskCategory.task_category_id}>
                        {columns.map(col => (
                          <TableCell key={col}>
                            {editingRowId === taskCategory.task_category_id ? (
                              <TextField
                                size="small"
                                value={editValues[col]}
                                onChange={e => setEditValues({...editValues, [col]: e.target.value})}
                              />
                            ) : taskCategory[col]}
                          </TableCell>
                        ))}
                        <TableCell>
                          {editingRowId === taskCategory.task_category_id ? (
                            <>
                              <Button onClick={handleSaveClick}>Save</Button>
                              <Button color="error" onClick={() => setEditingRowId(null)}>Cancel</Button>
                            </>
                          ) : (
                            <IconButton onClick={(e) => handleMenuOpen(e, taskCategory)}><MoreVertIcon /></IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredTaskCategory.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(e, p) => setPage(p)}
              onRowsPerPageChange={e => setRowsPerPage(+e.target.value)}
            />
          </>
        )}

        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => setEditingRowId(selectedTaskCategory.task_category_id)}>
            <EditIcon fontSize="small" /> Edit
          </MenuItem>
          <MenuItem onClick={() => setDeleteDialogOpen(true)}>
            <DeleteIcon fontSize="small" /> Delete
          </MenuItem>
        </Menu>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
          </DialogActions>
        </Dialog>

        <Portal>
          <Snackbar open={!!localError} autoHideDuration={4000} onClose={() => setLocalError(null)}>
            <Alert severity="error">{localError}</Alert>
          </Snackbar>
          <Snackbar open={success} autoHideDuration={4000} onClose={() => setSuccess(false)}>
            <Alert severity="success">{successMessage}</Alert>
          </Snackbar>
        </Portal>
      </Paper>
    </ThemeProvider>
  );
};

export default TaskCategoryTable;