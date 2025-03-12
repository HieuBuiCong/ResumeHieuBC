import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import Papa from "papaparse";

// ✅ Export function
const handleExportCSV = () => {
  const csvData = usersData.map((user) => ({
    ID: user.id,
    Name: user.name,
    Email: user.email,
    Role: user.role,
    Department: user.department,
  }));

  const csv = Papa.unparse(csvData); // Convert data to CSV format

  // Create Blob and trigger download
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "user_data.csv");
};

// ✅ Add this button to your table component (above TableContainer)
<Button
  variant="contained"
  color="primary"
  onClick={handleExportCSV}
  sx={{ mb: 2 }}
>
  Export to CSV
</Button>