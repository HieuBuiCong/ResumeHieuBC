{/* 💕🆕 3-DOT MENU (EDIT / DELETE / SEND SUMMARY EMAIL) */}
<Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
  
  {/* Show Edit and Delete only if user is Admin */}
  {isAdmin ? [
    <MenuItem key="edit" onClick={() => handleEditClick(selectedItem)}>
      <EditIcon sx={{ marginRight: 1 }} />
      Edit
    </MenuItem>,
    <MenuItem key="delete" onClick={() => handleDeleteClick(selectedItem)} sx={{ color: "red" }}>
      <DeleteIcon sx={{ marginRight: 1 }} />
      Delete
    </MenuItem>
  ] : null}

  {/* Conditionally show Send Summary Email if function is passed */}
  {handleSendSummaryEmail && (
    <MenuItem key="send-email" onClick={() => handleSendSummaryEmail(selectedItem)}>
      <SaveAltIcon sx={{ marginRight: 1 }} />
      Send Summary Email
    </MenuItem>
  )}
</Menu>
