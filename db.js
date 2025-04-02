import { uploadTaskAttachment, fetchAttachmentsByTask, deleteAttachment } from "../../services/attachmentService";
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
------------------------------------------
// Attachment state
const [attachments, setAttachments] = useState([]);
const [attachmentLoading, setAttachmentLoading] = useState(false);

// Fetch attachments
const fetchAttachments = async () => {
  try {
    setAttachmentLoading(true);
    const res = await fetchAttachmentsByTask(task.cid_task_id);
    setAttachments(res.data.data);
  } catch (error) {
    showNotification("Failed to load attachments", "error");
  } finally {
    setAttachmentLoading(false);
  }
};

useEffect(() => {
  if (open) {
    fetchAttachments();
  }
}, [open, task.cid_task_id]);

---------------------------------
// Handle file upload
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    setAttachmentLoading(true);
    await uploadTaskAttachment(task.cid_task_id, file);
    showNotification("File uploaded successfully!", "success");
    fetchAttachments();
  } catch (error) {
    showNotification("Failed to upload file.", "error");
  } finally {
    setAttachmentLoading(false);
  }
};

// Handle file delete
const handleDeleteAttachment = async (attachment_id) => {
  try {
    setAttachmentLoading(true);
    await deleteAttachment(attachment_id);
    showNotification("File deleted successfully.", "success");
    fetchAttachments();
  } catch (error) {
    showNotification("Failed to delete file.", "error");
  } finally {
    setAttachmentLoading(false);
  }
};

------------------------------
<Divider sx={{ my: 2 }} />
<Box sx={{ my: 2 }}>
  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
    Attachments
  </Typography>

  {/* Attachment upload */}
  <Button
    variant="contained"
    component="label"
    startIcon={<AttachFileIcon />}
    sx={{ mb: 2 }}
    disabled={attachmentLoading}
  >
    {attachmentLoading ? "Uploading..." : "Upload File"}
    <input type="file" hidden onChange={handleFileUpload} />
  </Button>

  {/* Attachment list */}
  {attachmentLoading ? (
    <CircularProgress size={24} />
  ) : attachments.length === 0 ? (
    <Typography variant="body2">No attachments yet.</Typography>
  ) : (
    attachments.map((att) => (
      <Box key={att.attachment_id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          <a
            href={`${import.meta.env.VITE_API_BASE_URL}/${att.file_path}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {att.file_name}
          </a>
        </Typography>
        <IconButton
          color="error"
          size="small"
          onClick={() => handleDeleteAttachment(att.attachment_id)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    ))
  )}
</Box>
