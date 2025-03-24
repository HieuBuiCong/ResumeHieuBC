import { Autocomplete } from '@mui/material';

// Inside your DialogContent:
<Autocomplete
  options={productOptions}
  getOptionLabel={(option) => `${option.part_number} - ${option.part_name}`}
  value={
    productOptions.find((product) => product.part_number === formData.part_number) || null
  }
  onChange={(_, newValue) => {
    setFormData((prev) => ({
      ...prev,
      part_number: newValue ? newValue.part_number : "",
    }));
  }}
  renderInput={(params) => (
    <TextField {...params} label="Part Number" required />
  )}
  sx={{ width: "100%" }}
/>