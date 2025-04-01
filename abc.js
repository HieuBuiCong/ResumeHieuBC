import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotification } from "../context/NotificationContext";

const FileUploadComponent = ({ cid_id, cid_task_id }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fetchUploadedFiles = async () => {
    setLoading(true);
    try {
      const endpoint = cid_id
        ? `/api/cid/${cid_id}/attachments`
        : `/api/cid-task/${cid_task_id}/attachments`;

      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.success) {
        setUploadedFiles(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      showNotification("Failed to fetch uploaded files.", "error");
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      showNotification("Please select a file first.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const endpoint = cid_id
        ? `/api/cid/${cid_id}/attachments`
        : `/api/cid-task/${cid_task_id}/attachments`;

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showNotification("File uploaded successfully!", "success");
        setSelectedFile(null);
        fetchUploadedFiles();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      showNotification(`Upload failed: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFile = (file) => {
    window.open(file.file_path, "_blank"); // assuming file_path is accessible URL
  };

  const handleDeleteFile = async (fileId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/attachments/${fileId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        showNotification("File deleted successfully.", "success");
        fetchUploadedFiles();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      showNotification(`Delete failed: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 3, width: "100%", mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Attachments
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <input
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          type="file"
          onChange={handleFileChange}
          hidden
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
            Select File
          </Button>
        </label>

        {selectedFile && <Typography>{selectedFile.name}</Typography>}

        <Button
          variant="contained"
          color="success"
          onClick={uploadFile}
          disabled={loading || !selectedFile}
        >
          Upload
        </Button>
      </Box>

      <Typography variant="subtitle1">Uploaded Files:</Typography>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : uploadedFiles.length > 0 ? (
        <List>
          {uploadedFiles.map((file) => (
            <ListItem key={file.attachment_id} divider>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText
                primary={file.file_name}
                secondary={`Uploaded: ${new Date(file.uploaded_at).toLocaleDateString()}`}
                onClick={() => handleOpenFile(file)}
                sx={{ cursor: "pointer" }}
              />
              <IconButton edge="end" onClick={() => handleDeleteFile(file.attachment_id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No files uploaded yet.
        </Typography>
      )}
    </Paper>
  );
};

export default FileUploadComponent;
