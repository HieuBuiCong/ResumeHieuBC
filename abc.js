import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  DialogContentText,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNotification } from "../../context/NotificationContext";
import { getPostponeHistory, submitExtensionRequest, approveOrRejectExtension } from "../../services/postponeService";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: "#3f51b5",
    color: theme.palette.common.white,
  },
  dialogContent: {
    padding: theme.spacing(2),
    backgroundColor: "#f0f4f8",
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  select: {
    marginBottom: theme.spacing(2),
  },
}));

const PostponeHistoryModal = ({ open, onClose, task, isAdmin, refreshData }) => {
  const classes = useStyles();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  // For submitting extension request
  const [reason, setReason] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For admin approval or rejection
  const [decision, setDecision] = useState("approve");
  const [approvalReason, setApprovalReason] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getPostponeHistory(task.cid_task_id);
        setHistory(response?.data || []);
      } catch (error) {
        setError(error?.message || "Failed to fetch postpone history.");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchHistory();
  }, [open, task.cid_task_id]);

  // ✅ Submit Extension Request (User)
  const handleSubmitExtension = async () => {
    try {
      setIsSubmitting(true);
      const response = await submitExtensionRequest(task.cid_task_id, reason, proposedDate);
      showNotification(response?.data?.message || "Extension request submitted.", "success");
      onClose();
      refreshData();
    } catch (error) {
      showNotification(error?.response?.data?.message || "Failed to submit extension request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Admin Decision (Approve or Reject)
  const handleReviewSubmit = async () => {
    try {
      setLoading(true);
      const response = await approveOrRejectExtension(task.cid_task_id, decision, approvalReason);
      showNotification(response?.data?.message || "Extension request reviewed.", "success");
      onClose();
      refreshData();
    } catch (error) {
      showNotification(error?.response?.data?.message || "Failed to review extension request.", "error");
    } finally {
      setLoading(false);
    }
  };
};

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className={classes.dialogTitle}>
          Postpone History for Task: {task.task_name} | CID: {task.cid_id}
        </DialogTitle>
        <Divider />

        <DialogContent dividers className={classes.dialogContent}>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : history.length === 0 ? (
            <Typography>No postpone history available for this task.</Typography>
          ) : (
            history.map((record, index) => (
              <Box key={record.postpone_id || index} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {index + 1}. Requested by: {record.username}
                </Typography>
                <Typography><strong>Reason:</strong> {record.reason}</Typography>
                <Typography><strong>Proposed Date:</strong> {new Date(record.proposed_date).toLocaleDateString()}</Typography>
                <Typography><strong>Status:</strong> {record.status}</Typography>
                {record.approver_name && (
                  <Typography><strong>Approved By:</strong> {record.approver_name}</Typography>
                )}
                {record.approver_reason && (
                  <Typography><strong>Approver Reason:</strong> {record.approver_reason}</Typography>
                )}
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          )}
        </DialogContent>

        <DialogActions>
          {!isAdmin && (
            <Button
              onClick={() => setExtensionRequestOpen(true)}
              disabled={pendingRequest || loading}
              className={classes.button}
              sx={{ backgroundColor: pendingRequest ? '#ccc' : '#00897b', color: 'white', '&:hover': { backgroundColor: pendingRequest ? '#ccc' : '#00796b' } }}
            >
              {pendingRequest ? 'Pending Request' : 'Request Extension'}
            </Button>
          )}

          {isAdmin && hasPendingRequest && (
            <Button
              onClick={() => setReviewOpen(true)}
              disabled={loading}
              className={classes.button}
              sx={{ backgroundColor: '#00897b', color: 'white', '&:hover': { backgroundColor: '#00796b' } }}
            >
              Review Extension
            </Button>
          )}
          <Button onClick={onClose} color="error" className={classes.button} sx={{ backgroundColor: '#b71c1c', color: 'white', '&:hover': { backgroundColor: '#c62828' } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Extension Request Dialog */}
      <Dialog open={extensionRequestOpen} onClose={() => setExtensionRequestOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className={classes.dialogTitle}>Request Deadline Extension</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>Please provide a reason and proposed new deadline.</DialogContentText>
          <TextField
            label="Reason"
            multiline
            rows={4}
            fullWidth
            value={extensionReason}
            onChange={(e) => setExtensionReason(e.target.value)}
            className={classes.textField}
          />
          <TextField
            label="Proposed Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={proposedDate}
            onChange={(e) => setProposedDate(e.target.value)}
            className={classes.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExtensionRequestOpen(false)} color="inherit" className={classes.button}>
            Cancel
          </Button>
          <Button onClick={handleExtensionSubmit} color="success" className={classes.button} disabled={loading}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Admin Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className={classes.dialogTitle}>Review Extension Request</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText>Select your decision and provide a reason for approval or rejection.</DialogContentText>
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
            value={approvalReason}
            onChange={(e) => setApprovalReason(e.target.value)}
            className={classes.textField}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)} color="inherit" className={classes.button}>
            Cancel
          </Button>
          <Button onClick={handleReviewSubmit} color="success" className={classes.button} disabled={loading}>
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostponeHistoryModal;
