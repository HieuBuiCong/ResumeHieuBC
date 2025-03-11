// 1) States & Handlers
const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

function handleDeleteClick(user) {
  setSelectedUser(user);
  setDeleteDialogOpen(true);
  handleMenuClose(); 
}

function handleConfirmDelete() {
  console.log("Deleting user:", selectedUser);
  setDeleteDialogOpen(false);
  setSelectedUser(null);
  // await axios.delete(...) or your delete logic
}

function handleCancelDelete() {
  setDeleteDialogOpen(false);
  setSelectedUser(null);
}

// 2) Three-dot menu
<Menu anchorEl={menuAnchor} ...>
  <MenuItem onClick={() => handleEditClick(selectedUser)}>Edit</MenuItem>
  <MenuItem onClick={() => handleDeleteClick(selectedUser)} sx={{ color: 'red' }}>
    Delete
  </MenuItem>
</Menu>

// 3) Deletion Confirm Dialog
<Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete user: <strong>{selectedUser?.name}</strong>?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCancelDelete}>No</Button>
    <Button onClick={handleConfirmDelete} variant="contained" color="error">
      Yes, Delete
    </Button>
  </DialogActions>
</Dialog>