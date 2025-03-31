{/* Admin Review Dialog */}
<Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle className={classes.dialogTitle}>Review Extension Request</DialogTitle>
  <DialogContent className={classes.dialogContent}>
    <DialogContentText>Select your decision and provide a reason for approval or rejection.</DialogContentText>
    
    {/* Decision Select (Approve / Reject) */}
    <Select
      value={decision}
      onChange={(e) => setDecision(e.target.value)}
      fullWidth
      className={classes.select}
    >
      <MenuItem value="approve">Approve</MenuItem>
      <MenuItem value="reject">Reject</MenuItem>
    </Select>

    {/* Reason Textfield */}
    <TextField
      label="Approval Reason"
      multiline
      rows={4}
      fullWidth
      value={reviewReason}
      onChange={(e) => setReviewReason(e.target.value)}
      className={classes.textField}
    />
  </DialogContent>

  {/* Actions */}
  <DialogActions>
    <Button onClick={() => setReviewOpen(false)} color="inherit" className={classes.button}>
      Cancel
    </Button>
    <Button onClick={handleReviewSubmit} color="success" className={classes.button} disabled={loading}>
      Submit Review
    </Button>
  </DialogActions>
</Dialog>
