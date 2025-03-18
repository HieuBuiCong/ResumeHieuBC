import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Box,
  Portal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { keyframes } from "@emotion/react";
import { taskCategoryRegister } from "../../services/taskCategoryService";

// Keyframes for sway animation
const sway = keyframes`
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
`;

const TaskCategoryRegisterForm = ({ refreshTaskCategory }) => {
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({ task_name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await taskCategoryRegister(formData);
      setSuccess(true);
      refreshTaskCategory(); // Refresh the task category table
      setOpenForm(false);
    } catch (error) {
      setError(error?.error || "Failed to create task category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Success & Error Snackbar */}
      <Portal>
        <Snackbar
          open={!!error}
          autoHideDuration={4000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ position: "fixed", zIndex: 9999, animation: `${sway} 0.5s ease-in-out`, marginTop: '64px' }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Portal>

      <Portal>
        <Snackbar
          open={success}
          autoHideDuration={4000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ animation: `${sway} 0.5s ease-in-out`, marginTop: '64px' }}
        >
          <Alert severity="success">Task category created successfully!</Alert>
        </Snackbar>
      </Portal>

      {/* ✅ Button positioned on the right */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            fontSize: "0.875rem",
            padding: "6px 16px",
          }}
          onClick={() => setOpenForm(true)}
        >
          New Task Category
        </Button>
      </Box>

      {/* ✅ Task Category Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Task Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <TextField
                fullWidth
                label="Task Name"
                name="task_name"
                value={formData.task_name}
                onChange={handleChange}
                margin="dense"
                required
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCategoryRegisterForm;
