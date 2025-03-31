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
  DialogContentText,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { makeStyles } from "@mui/styles";
import { getTaskAnswers, saveTaskAnswers} from "../../services/answerService";
import { taskSubmit, reviewTask } from "../../services/taskService";
import { useNotification } from "../../context/NotificationContext";

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
  iconButton: {
    marginLeft: theme.spacing(1),
  },
  select: {
    marginBottom: theme.spacing(2),
  },

}));

const AnswerModal = ({ open, onClose, task, refreshData, isAdmin }) => {
  const classes = useStyles();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { showNotification } = useNotification();
  // this is for approval
  const [reviewOpen, setReviewOpen] = useState(false);
  const [decision, setDecision] = useState('approve');
  const [approver_reason, setApprovalReason] = useState('');

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await getTaskAnswers(task.cid_task_id);
        setAnswers(response.data);
      } catch (error) {
        showNotification(`Failed to fetch answers: ${error.message}`, "error");
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
  
      console.log("API Response:", response?.data?.message); // Debugging
  
      // ✅ Check for the correct response format
      if (response?.data?.success) {
        if (response?.data?.taskSubmitted) {
          showNotification("Task submitted successfully!", "success");
        } else {
          showNotification("Task submission failed.", "error");
          return; // Stop here if submission failed
        }
  
        // ✅ Handle Email Notification with a delay
        setTimeout(() => {
          if (response?.data?.emailSent) {
            showNotification("Email notification sent successfully!", "success");
          } else {
            showNotification("Failed to send email notification.", "warning");
          }
        }, 2000);

        onClose();
      } else {
        throw new Error(response?.data?.message || "Task submission failed.");
      }
  
    } catch (error) {
      console.error("Submission Error:", error);
      const errorMessage = error?.response?.data?.message || error.message || "Failed to submit answers.";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
      refreshData();

        // set page reload
        setTimeout(() => {
          window.location.reload();
      }, 4000);    
    }
  };

  //🔥 handle Approval
  const handleReviewSubmit = async () => {
    try {
      setLoading(true);
      setReviewOpen(false);
      const response = await reviewTask(task.cid_task_id, { decision, approver_reason });
      console.log("API Response:", response?.data?.message); // Debugging

      if (response?.data?.success) {
        showNotification("Task reviewed successfully!", "success");
      } else {
        showNotification("Task review failed.", "error");
        return; // Stop here if submission failed
      }

      setReviewOpen(false);
      onClose();

      setTimeout(() => {
        if (response?.data?.emailSent) {
            showNotification("Email notification sent successfully!", "success");
        } else {
            showNotification("Failed to send email notification.", "warning");
        }
      }, 2000);
      
    } catch (error) {
      console.log("here is the error: ",error);
      const errorMessage = error?.response?.data?.message || error?.response || error?.message || "Failed to submit review.";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
      refreshData();

      // set page reload
      setTimeout(() => {
          window.location.reload();
      }, 4000);
    }
  };


  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className={classes.dialogTitle}>
          Task: {task.task_name} | CID: {task.cid_id}
        </DialogTitle>
        <Divider />
  
        <DialogContent dividers className={classes.dialogContent}>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            answers.length === 0 ? (
              <Typography>No questions available for this task.</Typography>
            ) : (
              answers.map((ans, index) => (
                <Box key={`${ans.task_category_question_id}-${index}`} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {index + 1}. {ans.question_name}
                  </Typography>
                  {editing ? (
                    <TextField
                      value={ans.answer || ""}
                      onChange={(e) => handleAnswerChange(ans.task_category_question_id, e.target.value)}
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      className={classes.textField}
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
              <Button
                onClick={handleSave}
                startIcon={<CheckIcon />}
                disabled={loading}
                className={classes.button}
                sx={{ backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45A049' } }}
              >
                Save
              </Button>
              <Button
                onClick={() => setEditing(false)}
                startIcon={<ClearIcon />}
                disabled={loading}
                className={classes.button}
                sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#e53935' } }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Tooltip title="Edit your answers">
                <Button
                  onClick={() => setEditing(true)}
                  startIcon={<EditIcon />}
                  disabled={loading}
                  className={classes.button}
                  sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}
                >
                  Edit Answers
                </Button>
              </Tooltip>
              <Tooltip title="Submit your answers for review">
                {isAdmin ? (
                  <Button
                    onClick={() => setReviewOpen(true)}
                    color="success"
                    className={classes.button}
                    sx={{ backgroundColor: '#00897b', color: 'white', '&:hover': { backgroundColor: '#00796b' } }}
                  >
                    Review
                  </Button>
                ) : (
                  <Button
                    onClick={() => setConfirmOpen(true)}
                    color="success"
                    disabled={loading}
                    className={classes.button}
                    sx={{ backgroundColor: '#00897b', color: 'white', '&:hover': { backgroundColor: '#00796b' } }}
                  >
                    Submit Answers
                  </Button>
                )}
              </Tooltip>
              <Button
                onClick={onClose}
                color="error"
                disabled={loading}
                className={classes.button}
                sx={{ backgroundColor: '#b71c1c', color: 'white', '&:hover': { backgroundColor: '#c62828' } }}
              >
                Close
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
  
      {/* Confirm Dialog for Submission */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className={classes.dialogTitle}>
          Confirm Submission
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText sx={{marginTop: "10px"}}>
            Are you sure you want to submit your answers? You will not be able to edit them afterward.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmOpen(false)}
            color="inherit"
            className={classes.button}
            sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#e53935' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="success"
            className={classes.button}
            sx={{ backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45A049' } }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
  
      {/* Review Dialog */}
      <Dialog open={reviewOpen} onClose={() => setReviewOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className={classes.dialogTitle}>
          Review Task: {task.task_name}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <DialogContentText sx={{ marginTop: "10px" }}>
            Select your decision and provide an approval reason.
          </DialogContentText>
          <Select
            value={decision}
            onChange={(e) => setDecision(e.target.value)}
            fullWidth
            className={classes.select}
            sx={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <MenuItem value="approve">Approve</MenuItem>
            <MenuItem value="reject">Reject</MenuItem>
          </Select>
          <TextField
            label="Approval Reason"
            multiline
            rows={4}
            fullWidth
            value={approver_reason}
            onChange={(e) => setApprovalReason(e.target.value)}
            placeholder="Provide detailed reasons for your decision"
            className={classes.textField}
            sx={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setReviewOpen(false)}
            color="inherit"
            className={classes.button}
            sx={{ backgroundColor: '#f44336', color: 'white', '&:hover': { backgroundColor: '#e53935' } }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
            color="success"
            className={classes.button}
            sx={{ backgroundColor: '#4CAF50', color: 'white', '&:hover': { backgroundColor: '#45A049' } }}
            disabled={loading}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AnswerModal;
