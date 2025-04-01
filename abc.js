import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, IconButton, Box } from '@mui/material';
import { Delete as DeleteIcon, UploadFile as UploadIcon } from '@mui/icons-material';
import { useNotification } from '../context/NotificationContext';
import { fetchAttachmentsByCID, fetchAttachmentsByTask, uploadCidAttachment, uploadTaskAttachment, deleteAttachment } from '../services/attachmentService';

const AttachmentModal = ({ open, onClose, cid_id, cid_task_id }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { showNotification } = useNotification();

  // Determine fetch method based on provided ID
  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const response = cid_id 
        ? await fetchAttachmentsByCID(cid_id) 
        : await fetchAttachmentsByTask(cid_task_id);
      setAttachments(response.data.data);
    } catch (error) {
      showNotification('Failed to load attachments.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchAttachments();
  }, [open, cid_id, cid_task_id]);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      cid_id
        ? await uploadCidAttachment(cid_id, file)
        : await uploadTaskAttachment(cid_task_id, file);
      showNotification('File uploaded successfully!', 'success');
      fetchAttachments();
    } catch (error) {
      showNotification('Failed to upload file.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Handle file delete
  const handleDelete = async (attachment_id) => {
    try {
      await deleteAttachment(attachment_id);
      showNotification('File deleted successfully.', 'success');
      fetchAttachments();
    } catch (error) {
      showNotification('Failed to delete file.', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Attachments ({cid_id ? `CID: ${cid_id}` : `Task: ${cid_task_id}`})
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress />
          </Box>
        ) : attachments.length === 0 ? (
          <Typography>No attachments found.</Typography>
        ) : (
          attachments.map((file) => (
            <Box key={file.attachment_id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <a href={`${import.meta.env.VITE_API_BASE_URL}/${file.file_path}`} target="_blank" rel="noopener noreferrer">
                {file.file_name}
              </a>
              <IconButton color="error" onClick={() => handleDelete(file.attachment_id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" component="label" startIcon={<UploadIcon />} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
          <input hidden type="file" onChange={handleFileUpload} />
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AttachmentModal;
