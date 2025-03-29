      {/* Render AnswerModal when Open */}
      {isTaskTable && selectedItem && (
        <AnswerModal
          open={answerModalOpen}
          onClose={() => setAnswerModalOpen(false)}
          task={selectedItem}
        />
      )}
-----------------
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
  Box
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { getTaskAnswers, saveTaskAnswers, submitTaskAnswers } from "../../services/answerService";
import { useNotification } from "../../context/NotificationContext";

const AnswerModal = ({ open, onClose, task }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
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
      await submitTaskAnswers(task.cid_task_id);
      showNotification("Answers submitted successfully!", "success");
      onClose();
    } catch (error) {
      showNotification("Failed to submit answers", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Answers for Task: {task.task_name}</DialogTitle>

      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : (
          answers.length === 0 ? (
            <Typography>No questions available for this task.</Typography>
          ) : (
            answers.map((ans, index) => (
              <Box key={ans.task_category_question_id} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{index + 1}. {ans.question_text}</Typography>
                {editing ? (
                  <TextField
                    value={ans.answer || ""}
                    onChange={(e) => handleAnswerChange(ans.task_category_question_id, e.target.value)}
                    fullWidth
                    multiline
                    rows={3}
                  />
                ) : (
                  <Typography>{ans.answer || "No answer provided"}</Typography>
                )}
              </Box>
            ))
          )
        )}
      </DialogContent>

      <DialogActions>
        {editing ? (
          <>
            <Button onClick={handleSave} startIcon={<CheckIcon />} disabled={loading}>
              Save
            </Button>
            <Button onClick={() => setEditing(false)} startIcon={<ClearIcon />} disabled={loading}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setEditing(true)} startIcon={<EditIcon />} disabled={loading}>
              Edit Answers
            </Button>
            <Button onClick={handleSubmit} color="success" disabled={loading}>
              Submit Answers
            </Button>
            <Button onClick={onClose} color="error" disabled={loading}>
              Close
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AnswerModal;
