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
  Box,
  Divider,
  Tooltip,
  DialogContentText,
  Select,
  MenuItem
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { getTaskAnswers, saveTaskAnswers} from "../../services/answerService";
import { taskSubmit, reviewTask } from "../../services/taskService";
import { useNotification } from "../../context/NotificationContext";

const AnswerModal = ({ open, onClose, task, refreshData, isAdmin }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [decision, setDecision] = useState('approve');
  const [approvalReason, setApprovalReason] = useState('');
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await getTaskAnswers(task.cid_task_id);
        setAnswers(response.data);
      } catch (error) {
        showNotification("Failed to fetch answers", "error");
      } finally {
        setLoading(false);
      }
    };

    if (open) fetchAnswers();
  }, [open, task.cid_task_id]);

  const handleReviewSubmit = async () => {
    try {
      setLoading(true);
      const response = await reviewTask(task.cid_task_id, { decision, approvalReason });
      showNotification(response?.data?.message || "Review submitted successfully", "success");
      setReviewOpen(false);
      onClose();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to submit review.";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
      refreshData();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Task: {task.task_name} | CID: {task.cid_id}</DialogTitle>
        <Divider />

        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            answers.length === 0 ? (
              <Typography>No questions available for this task.</Typography>
            ) : (
              answers.map((ans, index) => (
                <Box key={ans.task_category_question_id} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{index + 1}. {ans.question_name}</Typography>
                  <Typography sx={{ color: ans.answer ? "text.primary" : "text.secondary" }}>
                    {ans.answer || "No answer provided"}
                  </Typography>
                </Box>
              ))
            )
          )}
        </DialogContent>

        <DialogActions>
          {isAdmin ? (
            <Button onClick={() => setReviewOpen(true)} color="success" sx={{ backgroundColor: '#00897b', color: 'white', '&:hover': { backgroundColor: '#00796b' }}}>Review</Button>
          ) : (
            <Tooltip title="Submit your answers for review">
              <Button onClick={() => setConfirmOpen(true)} color="success" disabled={loading} sx={{ backgroundColor: '#00897b', color: 'white', '&:hover': { backgroundColor: '#00796b' }}}>Submit Answers</Button>
            </Tooltip>
          )}
          <Button onClick={onClose} color="error" disabled={loading} sx={{ backgroundColor: '#b71c1c', color: 'white', '&:hover': { backgroundColor: '#c62828' }}}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)}>
        <DialogTitle>Review Task: {task.task_name}</DialogTitle>
        <DialogContent>
          <DialogContentText>Select your decision and provide an approval reason.</DialogContentText>
          <Select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
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
            placeholder="Provide detailed reasons for your decision"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleReviewSubmit} color="success" disabled={loading}>Submit Review</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnswerModal;
