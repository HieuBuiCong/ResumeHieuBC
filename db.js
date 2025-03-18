 return (
    <ThemeProvider theme={theme}>
        {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
                <CircularProgress />
            </div>
        ) : error ? (
            <p className="display-4 text-danger fw-bold" style={{fontSize: "30px"}}>😒😒{error}😒😒</p>
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
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary", marginBottom: "5px" }}>
                        Task Category
                    </Typography>
                   {/* ✅ Container for Search Bar & Register Button */}
                    <Box 
                        sx={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center", 
                            gap: 2,
                            mb: 2,
                            width: "100%",
                            height: "70px", 
                        }}
                    >
                        {/* 🔍 Global Search */}
                        <TextField
                            placeholder="Search ..."
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
                                    "&.Mui-focused fieldset": { borderColor: "#1976d2" }
                                }
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
                        {/* ➕ Register New Task Category Button (aligned to the right) */}
                        <TaskCategoryRegisterForm refreshTaskCategory={refreshTaskCategory} setLocalError={setLocalError} setSuccess={setSuccess} setSuccessMessage={setSuccessMessage} />
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
                                {filteredTaskCategory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((taskCategory) => (
                                    <TableRow
                                        key={taskCategory.task_category_id}
                                        hover
                                        sx={{
                                        height: "20px",
                                        cursor: "pointer",
                                        transition: "background 0.2s ease-in-out",
                                        "&:hover": { backgroundColor: "#f5f5f5" },
                                        backgroundColor: selectedTaskCategoryForQuestion?.task_category_id === taskCategory.task_category_id ? "#f5f5f5" : "inherit",
                                        }}
                                        onClick= {() => setSelectedTaskCategoryForQuestion(taskCategory)} //🆕 Select category on row click
                                    >
                                        {columns.map((column) => (
                                        <TableCell key={column} sx={{ fontSize: "0.9rem", maxWidth: "150px", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                                            {column === "task_category_id" ? (
                                            <span>{taskCategory[column]}</span>
                                            ) : editingRowId === taskCategory.task_category_id ? (
                                                <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    value={editValues[column] || ""}
                                                    onChange={(e) =>
                                                    setEditValues((prev) => ({ ...prev, [column]: e.target.value }))
                                                    }
                                                />
                                            ) : (
                                                <Tooltip title={taskCategory[column]} arrow>
                                                <span>{taskCategory[column]}</span>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        ))}
                                        {/* ACTIONS: If editing => show Save button, else show 3-dot */}
                                        <TableCell align="right">
                                        {editingRowId === taskCategory.task_category_id ? (
                                            <Box sx= {{display: 'flex', gap: 1}}>
                                            <Button variant="contained" onClick={() => handleSaveClick(taskCategory.task_category_id)}>
                                                Save
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => setEditingRowId(null)}>
                                                Cancel
                                            </Button>
                                            </Box>
                                        ) : (
                                            <IconButton onClick={(e) => handleMenuOpen(e, taskCategory)}>
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
                        count={filteredTaskCategory.length}
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
                        Array.from(new Set(taskCategoryData.map((taskCategory) => String(taskCategory[filterColumn]))))
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
                        <MenuItem onClick={() => handleEditClick(selectedTaskCategory)}>
                            <EditIcon sx={{ marginRight: 1 }} />
                            Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClick(selectedTaskCategory)} sx={{ color: "red" }}>
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
                            <Button onClick={() => handleConfirmDelete(selectedTaskCategory)} variant="contained" color="error">
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>

                {/* ✅ Error Snackbar */}
                <Portal>
                    <Snackbar
                        open={!!localError} // open if there is a error
                        autoHideDuration={4000}
                        onClose={() => setLocalError(null)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // position at the top right of the screen
                        sx={{
                        position: "fixed", // ensure snack bar is fixed and unaffected by the Dialog backdrop
                        zIndex: 9999, // ensure snackbar appear above other UI element
                        animation: `${sway} 0.5s ease-in-out`, // applies sway animation to the snack bar
                        marginTop: '64px',
                        }}
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
                        sx={{
                        animation: `${sway} 0.5s ease-in-out`,
                        marginTop: '64px', 
                        }}
                    >
                        <Alert severity="success">{successMessage}</Alert>
                    </Snackbar>
                </Portal>
            </>
        )}
    </ThemeProvider>
  );
