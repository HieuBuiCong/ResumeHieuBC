      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className={classes.dialogTitle}>Review Extension Request</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>Select your decision, provide a reason, and optionally set a new deadline.</DialogContentText>
          <Select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            fullWidth
            className={classes.select}
          >
            <MenuItem value="approve">Approve</MenuItem>
            <MenuItem value="reject">Reject</MenuItem>
          </Select>
          <TextField
            label="Approval Reason"
            multiline
            rows={4}
            fullWidth
            value={reviewReason}
            onChange={(e) => setReviewReason(e.target.value)}
            className={classes.textField}
          />
          {decision === "approve" && (
            <DatePicker
              label="Set New Deadline (Optional)"
              value={proposedDate}
              onChange={(newValue) => setProposedDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              className={classes.textField}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)} color="inherit" className={classes.button}>Cancel</Button>
          <Button onClick={handleReviewSubmit} color="success" className={classes.button} disabled={loading}>Submit Review</Button>
        </DialogActions>
      </Dialog>
