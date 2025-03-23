import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { format } from 'date-fns';
import { MenuItem, Select } from '@mui/material';

// Status color map
const statusColors = {
  "in-progress": "orange",
  "complete": "green",
  "overdue": "red",
  "pending": "grey",
  "submitted": "blue"
};

<TableCell
  key={column}
  sx={{
    fontSize: "0.9rem",
    maxWidth: "150px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }}
>
  {editingRowId === dataItem[identifierKey] ? (
    // EDIT MODE
    column.toLowerCase().includes("date") || column === "Deadline" ? (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={editValues[column] ? new Date(editValues[column]) : null}
          onChange={(newValue) => {
            setEditValues((prev) => ({
              ...prev,
              [column]: newValue?.toISOString().split('T')[0] || ""
            }));
          }}
          renderInput={(params) => <TextField size="small" {...params} />}
        />
      </LocalizationProvider>
    ) : column.toLowerCase() === "status" ? (
      <Select
        size="small"
        value={editValues[column] || ""}
        onChange={(e) =>
          setEditValues((prev) => ({
            ...prev,
            [column]: e.target.value
          }))
        }
      >
        {["in-progress", "overdue", "complete", "submitted", "pending"].map((status) => (
          <MenuItem key={status} value={status}>
            {status}
          </MenuItem>
        ))}
      </Select>
    ) : (
      <TextField
        variant="outlined"
        size="small"
        value={editValues[column] || ""}
        onChange={(e) =>
          setEditValues((prev) => ({
            ...prev,
            [column]: e.target.value
          }))
        }
      />
    )
  ) : (
    // VIEW MODE
    <Tooltip title={dataItem[column]?.toString()} arrow>
      <span>
        {typeof dataItem[column] === "boolean" ? (
          dataItem[column] ? (
            <CheckIcon sx={{ color: "green" }} />
          ) : (
            <ClearIcon sx={{ color: "red" }} />
          )
        ) : column.toLowerCase().includes("date") || column === "Deadline" ? (
          format(new Date(dataItem[column]), "dd-MMM-yy")
        ) : column.toLowerCase() === "status" ? (
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "12px",
              backgroundColor: statusColors[dataItem[column]?.toLowerCase()] || "#ddd",
              color: "#fff",
              fontWeight: 500,
              fontSize: "0.8rem",
              textTransform: "capitalize"
            }}
          >
            {dataItem[column]}
          </span>
        ) : (
          dataItem[column]
        )}
      </span>
    </Tooltip>
  )}
</TableCell>