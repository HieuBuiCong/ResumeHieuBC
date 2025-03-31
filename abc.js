import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { fetchPostponeHistory, submitExtensionRequest, reviewExtensionRequest } from '../../services/postponeService';
import { useNotification } from '../../context/NotificationContext';

const PostponeHistoryModal = ({ open, onClose, task, isAdmin }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [reason, setReason] = useState('');
  const [proposedDate, setProposedDate] = useState('');
  const [decision, setDecision] = useState('approve');
  const [approverReason, setApproverReason] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchPostponeHistory(task.cid_task_id);
        setHistory(response.history);
        setPendingRequest(response.pendingRequest);
      } catch (error) {
        showNotification('Failed to fetch postpone history.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchData();
  }, [open, task.cid_task_id]);

  const handleSubmitExtension = async () => {
    try {
      await submitExtensionRequest(task.cid_task_id, reason, proposedDate);
      showNotification('Extension request submitted successfully.', 'success');
      onClose();
    } catch (error) {
      showNotification(error?.response?.data?.message || 'Failed to submit request.', 'error');
    }
  };

  const handleReviewSubmit = async () => {
    try {
      await reviewExtensionRequest(task.cid_task_id, decision, approverReason);
      showNotification('Extension request reviewed successfully.', 'success');
      setReviewModalOpen(false);
      onClose();
    } catch (error) {
      showNotification(error?.response?.data?.message || 'Failed to review request.', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Postpone History for Task: {task.task_name}</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : history.length === 0 ? (
          <Typography>No postpone history available.</Typography>
        ) : (
          history.map((entry, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <Typography><strong>Status:</strong> {entry.status}</Typography>
              <Typography><strong>Reason:</strong> {entry.reason}</Typography>
              <Typography><strong>Proposed Date:</strong> {entry.proposed_date}</Typography>
              <Typography><strong>Reviewed At:</strong> {entry.reviewed_at || 'N/A'}</Typography>
            </div>
          ))
        )}
      </DialogContent>

      <DialogActions>
        {pendingRequest ? (
          isAdmin ? (
            <Button onClick={() => setReviewModalOpen(true)} color="primary" variant="contained">Review Extension</Button>
          ) : (
            <Typography color="warning">Pending approval...</Typography>
          )
        ) : !isAdmin ? (
          <>
            <TextField
              label="Reason"
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
            />
            <TextField
              label="Proposed Date"
              type="date"
              value={proposedDate}
              onChange={(e) => setProposedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <Button onClick={handleSubmitExtension} color="success" variant="contained">Submit Extension Request</Button>
          </>
        ) : null}
        <Button onClick={onClose} color="error">Close</Button>
      </DialogActions>

      {/* Admin Review Modal */}
      <Dialog open={reviewModalOpen} onClose={() => setReviewModalOpen(false)}>
        <DialogTitle>Review Extension Request</DialogTitle>
        <DialogContent>
          <Typography><strong>Reason:</strong> {pendingRequest?.reason}</Typography>
          <Typography><strong>Proposed Date:</strong> {pendingRequest?.proposed_date}</Typography>
          <FormControl fullWidth>
            <InputLabel>Decision</InputLabel>
            <Select value={decision} onChange={(e) => setDecision(e.target.value)}>
              <MenuItem value="approve">Approve</MenuItem>
              <MenuItem value="reject">Reject</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Approver Reason"
            multiline
            rows={3}
            value={approverReason}
            onChange={(e) => setApproverReason(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewSubmit} color="primary" variant="contained">Submit Review</Button>
          <Button onClick={() => setReviewModalOpen(false)} color="error">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default PostponeHistoryModal;
