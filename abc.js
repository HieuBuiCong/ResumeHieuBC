import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Select,
  MenuItem,
  TextField,
  Divider,
  DialogContentText,
  Box,
  Tooltip
} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { makeStyles } from "@mui/styles";
import { useNotification } from "../../context/NotificationContext";
import { fetchPostponeHistory, requestPostpone, reviewPostpone } from "../../services/postponeService";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: "#347928",
    color: theme.palette.common.white,
  },
  dialogContent: {
    padding: theme.spacing(2),
    backgroundColor: "#FFFBE6",
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  select: {
    marginBottom: theme.spacing(2),
  },
}));

const PostponeHistoryModal = ({ open, onClose, task, refreshData, isAdmin }) => {
  const classes = useStyles();
  const { showNotification } = useNotification();

  // State Management
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [decision, setDecision] = useState("approve");
  const [reviewReason, setReviewReason] = useState("");
  const [proposedDate, setProposedDate] = useState("");
  const [requestReason, setRequestReason] = useState("");

  const [reviewOpen, setReviewOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  // Fetch Postpone History
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchPostponeHistory(task.cid_task_id);
        if (response?.data) {
          setHistory(response.data);
          const pendingRequest = response.data.find((item) => item.status === "pending");
          setPendingRequest(pendingRequest);
        } else {
          throw new Error("Failed to fetch postpone history.");
        }
      } catch (error) {
        console.error("Error fetching postpone history:", error);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, task.cid_task_id]);

  // ✅ Handle Submit Request for Extension
  const handleRequestSubmit = async () => {
    try {
      if (!requestReason.trim() || !proposedDate) {
        return showNotification("Reason and proposed date are required.", "error");
      }

      setLoading(true);
      const response = await requestPostpone(task.cid_task_id, requestReason, proposedDate);

      if (response?.data?.success) {
        showNotification("Extension request submitted successfully!", "success");
        setRequestOpen(false);
        refreshData();
      } else {
        throw new Error(response?.data?.message || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Request Submit Error:", error);
      showNotification(error.message || "Failed to submit request.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Admin Review (Approve/Reject)
  const handleReviewSubmit = async () => {
    try {
      if (!reviewReason.trim()) {
        return showNotification("Review reason is required.", "error");
      }

      setLoading(true);
      const response = await reviewPostpone(pendingRequest.cid_task_id, decision, reviewReason);

      if (response?.data?.success) {
        showNotification(`Request ${decision} successfully!`, "success");
        setReviewOpen(false);
        refreshData();
      } else {
        throw new Error(response?.data?.message || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Review Submit Error:", error);
      showNotification(error.message || "Failed to submit review.", "error");
    } finally {
      setLoading(false);
    }
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
