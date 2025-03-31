<LocalizationProvider dateAdapter={AdapterDateFns}>
  <Dialog open={requestOpen} onClose={() => setRequestOpen(false)} maxWidth="sm" fullWidth>
    <DialogTitle className={classes.dialogTitle}>Request Deadline Extension</DialogTitle>
    <DialogContent className={classes.dialogContent}>
      <DialogContentText>
        Please provide a reason and select the proposed new deadline.
      </DialogContentText>
      <TextField
        label="Reason for Extension"
        multiline
        rows={4}
        fullWidth
        value={requestReason}
        onChange={(e) => setRequestReason(e.target.value)}
        className={classes.textField}
        margin="normal"
      />
      <DatePicker
        label="Proposed New Deadline"
        value={proposedDate}
        onChange={(date) => setProposedDate(date)}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setRequestOpen(false)} color="inherit" className={classes.button}>
        Cancel
      </Button>
      <Button
        onClick={handleRequestSubmit}
        color="success"
        className={classes.button}
        disabled={loading || !requestReason || !proposedDate}
      >
        Submit Request
      </Button>
    </DialogActions>
  </Dialog>
</LocalizationProvider>
