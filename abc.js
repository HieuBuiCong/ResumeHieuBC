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
  IconButton,
  Box,
  Divider,
  Tooltip,
  DialogContentText
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { getTaskAnswers, saveTaskAnswers} from "../../services/answerService";
import { taskSubmit } from "../../services/taskService";
import { useNotification } from "../../context/NotificationContext";

const AnswerModal = ({ open, onClose, task }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
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

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => prev.map((ans) =>
      ans.task_category_question_id === questionId ? { ...ans, answer: value } : ans
    ));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await saveTaskAnswers(task.cid_task_id, answers);
      showNotification("Answers saved successfully!", "success");
      setEditing(false);
    } catch (error) {
      showNotification("Failed to save answers", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setConfirmOpen(false);
      const response = await taskSubmit(task.cid_task_id);

      // check if the status changed to submitted
      if(response?.data?.taskSubmitted) {
        showNotification("Task submitted successfully!", "success");
      } else {
        showNotification("Task submission failed", "error");
      }

      // delay for 1 sec
      setTimeout(() => {
        // check if the email are sent
        if(response?.data?.emailSent) {
          showNotification("Email notification sent successfully!", "success");
        } else {
          showNotification("Failed to send email notification", "warning");
        }
      }, 3000);
      onClose();

    } catch (error) {
      const errorMessage = error?.response?.data?.message || "Failed to submit answers";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
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
                  {editing ? (
                    <TextField
                      value={ans.answer || ""}
                      onChange={(e) => handleAnswerChange(ans.task_category_question_id, e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  ) : (
                    <Typography sx={{ color: ans.answer ? "text.primary" : "text.secondary" }}>
                      {ans.answer || "No answer provided"}
                    </Typography>
                  )}
                </Box>
              ))
            )
          )}
        </DialogContent>

        <DialogActions>
          {editing ? (
            <>
              <Button onClick={handleSave} startIcon={<CheckIcon />} disabled={loading} sx={{ backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45A049' }}}>Save</Button>
              <Button onClick={() => setEditing(false)} startIcon={<ClearIcon />} disabled={loading} sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#e53935' }}}>Cancel</Button>
            </>
          ) : (
            <>
              <Tooltip title="Edit your answers">
                <Button onClick={() => setEditing(true)} startIcon={<EditIcon />} disabled={loading} sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' }}}>Edit Answers</Button>
              </Tooltip>
              <Tooltip title="Submit your answers for review">
                <Button onClick={() => setConfirmOpen(true)} color="success" disabled={loading} sx={{ backgroundColor: '#00897b', color: 'white', '&:hover': { backgroundColor: '#00796b' }}}>Submit Answers</Button>
              </Tooltip>
              <Button onClick={onClose} color="error" disabled={loading} sx={{ backgroundColor: '#b71c1c', color: 'white', '&:hover': { backgroundColor: '#c62828' }}}>Close</Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog for Submission */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to submit your answers? You will not be able to edit them afterward.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleSubmit} color="success">Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnswerModal;
