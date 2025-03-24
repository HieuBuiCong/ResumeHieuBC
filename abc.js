import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress,
  Box, FormControlLabel, Switch, InputAdornment
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>

            <Autocomplete
              options={productOptions}
              getOptionLabel={(opt) => `${opt.part_number} - ${opt.part_name}`}
              onChange={(_, value) => setFormData({ ...formData, part_number: value?.part_number || "" })}
              renderInput={(params) => (
                <TextField {...params} label="Part Number" required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <TextField label="Next Rev" name="next_rev" value={formData.next_rev} onChange={handleChange} required
              InputProps={{
                startAdornment: <InputAdornment position="start"><UpdateIcon /></InputAdornment>,
              }}
            />

            <TextField label="Supplier ID" name="supplier_id" value={formData.supplier_id} onChange={handleChange} required
              InputProps={{
                startAdornment: <InputAdornment position="start"><SupplierIcon /></InputAdornment>,
              }}
            />

            <FormControlLabel control={
              <Switch checked={formData.rework_or_not} onChange={handleSwitchChange} name="rework_or_not" />
            } label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><ReworkIcon />Rework?</Box>} />

            <FormControlLabel control={
              <Switch checked={formData.ots_or_not} onChange={handleSwitchChange} name="ots_or_not" />
            } label={<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}><OTSIcon />OTS?</Box>} />

            <Autocomplete
              options={["pending", "in-progress", "complete", "submitted", "overdue"]}
              value={formData.status}
              onChange={(_, val) => setFormData({ ...formData, status: val || "pending" })}
              renderInput={(params) => (
                <TextField {...params} label="Status" required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <InputAdornment position="start"><StatusIcon /></InputAdornment>,
                  }}
                />
              )}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Deadline"
                value={formData.deadline}
                onChange={(val) => handleDateChange("deadline", val)}
                renderInput={(params) => <TextField {...params}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <InputAdornment position="start"><EventIcon /></InputAdornment>,
                  }} />}
              />

              <DatePicker
                label="Created Date"
                value={formData.created_date}
                onChange={(val) => handleDateChange("created_date", val)}
                renderInput={(params) => <TextField {...params}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: <InputAdornment position="start"><EventIcon /></InputAdornment>,
                  }} />}
              />
            </LocalizationProvider>

            <TextField label="Change Notice" name="change_notice" value={formData.change_notice} onChange={handleChange} multiline rows={2}
              InputProps={{
                startAdornment: <InputAdornment position="start"><ChangeNoticeIcon /></InputAdornment>,
              }}
            />

            <TextField label="Note" name="note" value={formData.note} onChange={handleChange} multiline rows={2}
              InputProps={{
                startAdornment: <InputAdornment position="start"><NoteIcon /></InputAdornment>,
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CIDRegisterForm;