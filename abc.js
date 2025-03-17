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
  MenuItem,
  useTheme,
  useMediaQuery,
  Grid,
  Box,
  Typography,
  Portal,
} from "@mui/material";
import {
  Business,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { keyframes } from "@emotion/react";

import { taskCategoryRegister } from "../../services/taskCategoryService";


// Keyframes for sway animation
const sway = keyframes`
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
`;

const TaskCategoryRegisterForm = ({refreshTaskCategory}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    department_name: "",
  });

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
    console.log(formData);

    try {
      // Simulate API request
      await taskCategoryRegister(formData);
      setSuccess(true);
      refreshTaskCategory(); // 🎯 refresh the department table after update 
      setOpenForm(false);
    } catch (error) {
      setError(error?.error || "Failed to create department. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Error Snackbar */}
        <Portal>
            <Snackbar
                open={!!error} // open if there is a error
                autoHideDuration={4000}
                onClose={() => setError(null)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // position at the top right of the screen
                sx={{
                position: "fixed", // ensure snack bar is fixed and unaffected by the Dialog backdrop
                zIndex: 9999, // ensure snackbar appear above other UI element
                animation: `${sway} 0.5s ease-in-out`, // applies sway animation to the snack bar
                marginTop: '64px',
                }}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Portal>
      {/* ✅ Success Snackbar */}
        <Portal>
            <Snackbar
                open={success}
                autoHideDuration={4000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{
                animation: `${sway} 0.5s ease-in-out`,
                marginTop: '64px', 
                }}
            >
                <Alert severity="success">Task category created successfully!</Alert>
            </Snackbar>
        </Portal>

      {/* ✅ Department Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          pb: 2,
          width: "100%",
          position: "sticky",  // ✅ Ensures it stays above the table
          top: 0,  // ✅ Sticks to top within the scrollable area
          zIndex: 2,
        }}
      >

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
          New task category
        </Button>
      </Box>

      {/* ✅ department Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm" fullScreen={fullScreen}>
        <DialogTitle>Create New Task Category</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Business sx={{ color: "red" }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                label="Department"
                name="department_name"
                value={formData.department_name}
                onChange={handleChange}
                margin="dense"
                required
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskCategoryRegisterForm;
