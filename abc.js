import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress,
  Box, FormControlLabel, Switch, Paper
} from "@mui/material";
import {
  Numbers as NumbersIcon,
  Update as UpdateIcon,
  Business as SupplierIcon,
  Event as EventIcon,
  Note as NoteIcon,
  Task as StatusIcon,
  ChangeCircle as ChangeNoticeIcon,
  Build as ReworkIcon,
  Inventory as OTSIcon,
  Add as AddIcon
} from "@mui/icons-material";
import { Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { cidRegister } from "../../services/cidService";
import { getProductData } from "../../services/productService";

const iconStyles = {
  fontSize: 30,
  color: "#1976d2", // Customize icon color here
};

const CIDRegisterForm = ({ refreshData, setLocalError, setSuccess, setSuccessMessage }) => {
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [productOptions, setProductOptions] = useState([]);

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
    note: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProductData();
      setProductOptions(products);
    };

    if (openForm) fetchProducts();
  }, [openForm]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSwitchChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.checked });
  const handleDateChange = (name, value) => setFormData({ ...formData, [name]: value });

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
      setLocalError(error?.error || "Failed to create CID.");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (icon, component) => (
    <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.5 }}>
      <Box>{icon}</Box>
      <Box flexGrow={1}>{component}</Box>
    </Paper>
  );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", px: 3, pb: 2 }}>
        <Button
          variant="contained" color="primary" startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
          sx={{ borderRadius: 2, padding: "8px 16px" }}
        >
          New CID
        </Button>
      </Box>

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New CID</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

            {renderField(<NumbersIcon sx={iconStyles} />, 
              <Autocomplete
                options={productOptions}
                getOptionLabel={(opt) => `${opt.part_number} - ${opt.part_name}`}
                onChange={(_, value) => setFormData({ ...formData, part_number: value?.part_number || "" })}
                renderInput={(params) => <TextField {...params} label="Part Number" required />}
              />
            )}

            {renderField(<UpdateIcon sx={iconStyles} />, 
              <TextField label="Next Rev" name="next_rev" value={formData.next_rev} onChange={handleChange} required />
            )}

            {renderField(<SupplierIcon sx={iconStyles} />, 
              <TextField label="Supplier ID" name="supplier_id" value={formData.supplier_id} onChange={handleChange} required />
            )}

            {renderField(<ReworkIcon sx={iconStyles} />, 
              <FormControlLabel control={
                <Switch checked={formData.rework_or_not} onChange={handleSwitchChange} name="rework_or_not" />
              } label="Rework?" />
            )}

            {renderField(<OTSIcon sx={iconStyles} />, 
              <FormControlLabel control={
                <Switch checked={formData.ots_or_not} onChange={handleSwitchChange} name="ots_or_not" />
              } label="OTS?" />
            )}

            {renderField(<StatusIcon sx={iconStyles} />, 
              <Autocomplete
                options={["pending", "in-progress", "complete", "submitted", "overdue"]}
                value={formData.status}
                onChange={(_, val) => setFormData({ ...formData, status: val || "pending" })}
                renderInput={(params) => <TextField {...params} label="Status" required />}
              />
            )}

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {renderField(<EventIcon sx={iconStyles} />, 
                <DatePicker
                  label="Deadline"
                  value={formData.deadline}
                  onChange={(val) => handleDateChange("deadline", val)}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}

              {renderField(<EventIcon sx={iconStyles} />, 
                <DatePicker
                  label="Created Date"
                  value={formData.created_date}
                  onChange={(val) => handleDateChange("created_date", val)}
                  renderInput={(params) => <TextField {...params} />}
                />
              )}
            </LocalizationProvider>

            {renderField(<ChangeNoticeIcon sx={iconStyles} />, 
              <TextField label="Change Notice" name="change_notice" multiline rows={2} value={formData.change_notice} onChange={handleChange} />
            )}

            {renderField(<NoteIcon sx={iconStyles} />, 
              <TextField label="Note" name="note" multiline rows={2} value={formData.note} onChange={handleChange} />
            )}

          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CIDRegisterForm;