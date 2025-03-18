const TaskCategoryRegisterForm = ({ refreshTaskCategory, setLocalError, setSuccess }) => {
  const [openForm, setOpenForm] = useState(false);
  const [formData, setFormData] = useState({ task_name: "" });
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    setLocalError(null);
    setSuccess(false);

    try {
      await taskCategoryRegister(formData);
      setSuccess(true);
      refreshTaskCategory(); // Refresh the table
      setOpenForm(false);
    } catch (error) {
      setLocalError(error?.message || "Failed to create task category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ "New Task Category" Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end", // ✅ Moves the button to the right
          px: 3,
          pb: 2,
          width: "100%",
          position: "sticky",
          top: 0,
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
            padding: "10px 20px", // ✅ Increased button size
          }}
          onClick={() => setOpenForm(true)}
        >
          New task category
        </Button>
      </Box>

      {/* ✅ Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Task Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Task Name"
            name="task_name"
            value={formData.task_name}
            onChange={handleChange}
            margin="dense"
            required
          />
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
