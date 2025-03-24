import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AddTaskIcon from '@mui/icons-material/AddTask';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { cidRegister } from "../../services/cidService";

const CIDRegisterForm = ({ refreshData, setLocalError, setSuccess, setSuccessMessage }) => {
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    part_number: "",
    next_rev: "",
    supplier_id: "",
    rework_or_not: false,
    ots_or_not: false,
    status: "pending",
    deadline: null,
    change_notice: "",
    created_date: new Date(),
    closing_date: null,
    note: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleDateChange = (name, newValue) => {
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLocalError(null);
    setSuccess(false);

    try {
      await cidRegister(formData);
      setSuccess(true);
      setSuccessMessage("CID Created Successfully");
      refreshData();
      setOpenForm(false);
    } catch (error) {
      console.error(error);
      setLocalError(error?.error || "Failed to create CID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* New CID Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 3, pb: 2, width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{ borderRadius: "8px", fontSize: "0.875rem", padding: "10px 20px", marginTop: "20px" }}
        >
          New CID
        </Button>
      </Box>

      {/* CID Register Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New CID</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Part Number" name="part_number" value={formData.part_number} onChange={handleChange} required />
            <TextField label="Next Rev" name="next_rev" value={formData.next_rev} onChange={handleChange} required />
            <TextField label="Supplier ID" name="supplier_id" value={formData.supplier_id} onChange={handleChange} required />

            <FormControlLabel
              control={<Switch checked={formData.rework_or_not} onChange={handleSwitchChange} name="rework_or_not" />}
              label="Rework?"
            />

            <FormControlLabel
              control={<Switch checked={formData.ots_or_not} onChange={handleSwitchChange} name="ots_or_not" />}
              label="OTS?"
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="complete">Complete</MenuItem>
                <MenuItem value="submitted">Submitted</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={formData.deadline}
                onChange={(newValue) => handleDateChange("deadline", newValue)}
                renderInput={(params) => <TextField {...params} />}
              />

              <DatePicker
                label="Created Date"
                value={formData.created_date}
                onChange={(newValue) => handleDateChange("created_date", newValue)}
                renderInput={(params) => <TextField {...params} />}
              />

              <DatePicker
                label="Closing Date"
                value={formData.closing_date}
                onChange={(newValue) => handleDateChange("closing_date", newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <TextField label="Change Notice" name="change_notice" value={formData.change_notice} onChange={handleChange} multiline rows={2} />
            <TextField label="Note" name="note" value={formData.note} onChange={handleChange} multiline rows={2} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CIDRegisterForm;