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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  DialogContentText,
  Box
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNotification } from "../../context/NotificationContext";
import { fetchPostponeHistory, requestPostpone, reviewPostpone } from "../../services/postponeService";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: "#347928",
    color: "#fff",
  },
  dialogContent: {
    padding: theme.spacing(2),
    backgroundColor: "#FFFBE6",
  },
  button: {
    margin: theme.spacing(1),
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
}));

const PostponeHistoryModal = ({ open, onClose, task, refreshData, isAdmin }) => {
  const classes = useStyles();
  const { showNotification } = useNotification();

  // ✅ State Management
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequest, setPendingRequest] = useState(null);

  // For User Request
  const [proposedDate, setProposedDate] = useState("");
  const [requestReason, setRequestReason] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);

  // For Admin Review
  const [decision, setDecision] = useState("approve");
  const [reviewReason, setReviewReason] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  // ✅ Fetch Postpone History
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchPostponeHistory(task.cid_task_id);

        if (response?.data) {
          setHistory(response.data);
          const pendingRequest = response.data.find((item) => item.status === "pending");
          setPendingRequest(pendingRequest || null);
        } else {
          throw new Error("Failed to fetch postpone history.");
        }
      } catch (error) {
        console.error("Error fetching postpone history:", error);
        showNotification(error.message || "Failed to fetch data.", "error");
        setHistory([]);
        setPendingRequest(null);
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchData();
  }, [open, task.cid_task_id, showNotification]);

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
      {/* ✅ Main Modal */}
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className={classes.dialogTitle}>
          Postpone History for Task: {task.task_name} | CID: {task.cid_id}
        </DialogTitle>
        <Divider />

        {/* ✅ Content Section */}
        <DialogContent dividers className={classes.dialogContent}>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : history?.length === 0 ? (
            <Typography>No postpone history available for this task.</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow className={classes.tableHeader}>
                    <TableCell>Requested By</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Proposed Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Approver Name</TableCell>
                    <TableCell>Approver Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((record, index) => (
                    <TableRow key={record.postpone_id || index}>
                      <TableCell>{record.username || 'N/A'}</TableCell>
                      <TableCell>{record.reason}</TableCell>
                      <TableCell>{new Date(record.proposed_date).toLocaleDateString()}</TableCell>
                      <TableCell>{record.status}</TableCell>
                      <TableCell>{record.approver_name || 'N/A'}</TableCell>
                      <TableCell>{record.approver_reason || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>

        {/* ✅ Actions */}
        <DialogActions>
          {/* ✅ User - Submit Extension Request */}
          {!isAdmin && (
            <Button
              onClick={() => setRequestOpen(true)}
              disabled={!!pendingRequest || loading}
              className={classes.button}
              sx={{ backgroundColor: pendingRequest ? '#ccc' : '#00897b', color: 'white' }}
            >
              {pendingRequest ? 'Pending Request' : 'Request Extension'}
            </Button>
          )}

          {/* ✅ Admin - Review Pending Requests */}
          {isAdmin && pendingRequest && (
            <Button
              onClick={() => setReviewOpen(true)}
              disabled={loading}
              className={classes.button}
              sx={{ backgroundColor: '#00897b', color: 'white' }}
            >
              Review Extension
            </Button>
          )}

          {/* ✅ Close Button */}
          <Button onClick={onClose} color="error" className={classes.button}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostponeHistoryModal;
