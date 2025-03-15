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
  Typography
} from "@mui/material";
import {
  AccountCircle,
  Email,
  Work,
  Business,
  SupervisorAccount
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { keyframes } from "@emotion/react";

import { userRegister } from "../../services/userService";

const roles = ["admin", "user"];
const departments = ["PE", "QA", "SCM"];

// Keyframes for sway animation
const sway = keyframes`
  0% { transform: translateX(100%); }
  50% { transform: translateX(-10%); }
  100% { transform: translateX(0); }
`;

const UserHeaderRegisterForm = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role_name: "",
    department_name: "",
    leader_email: "",
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
      await userRegister(formData);
      setSuccess(true);
      Navigate(0);
    } catch (err) {
      setError(err?.message || "Failed to create user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={4000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          animation: `${sway} 0.5s ease-in-out`,
          marginTop: '64px',
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      {/* ✅ Success Snackbar */}
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
        <Alert severity="success">User created successfully!</Alert>
      </Snackbar>

      {/* ✅ User Header */}
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
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Users
        </Typography>

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
          New User
        </Button>
      </Box>

      {/* ✅ User Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm" fullScreen={fullScreen}>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <AccountCircle sx={{ color: theme.palette.primary.main }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="dense"
                required
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Email sx={{ color: theme.palette.secondary.main }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="dense"
                required
                sx={{ mb: 2 }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Work sx={{ color: theme.palette.success.main }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                select
                label="Role"
                name="role_name"
                value={formData.role_name}
                onChange={handleChange}
                margin="dense"
                required
                sx={{ mb: 2 }}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Business sx={{ color: theme.palette.warning.main }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                select
                label="Department"
                name="department_name"
                value={formData.department_name}
                onChange={handleChange}
                margin="dense"
                required
                sx={{ mb: 2 }}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SupervisorAccount sx={{ color: theme.palette.error.main }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                label="Leader Email"
                name="leader_email"
                type="email"
                value={formData.leader_email}
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

export default UserHeaderRegisterForm;
