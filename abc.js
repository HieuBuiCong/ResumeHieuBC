import apiClient from "./apiClient";

// Get attachments by CID
export const fetchAttachmentsByCID = (cid_id) => apiClient.get(`/cid/${cid_id}/attachments`);

// Get attachments by Task ID
export const fetchAttachmentsByTask = (cid_task_id) => apiClient.get(`/cid-task/${cid_task_id}/attachments`);

// Add attachment to CID
export const uploadCidAttachment = (cid_id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`/cid/${cid_id}/attachments`, formData);
};

// Add attachment to Task
export const uploadTaskAttachment = (cid_task_id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`/cid-task/${cid_task_id}/attachments`, formData);
};

// Delete attachment
export const deleteAttachment = (attachment_id) => apiClient.delete(`/attachments/${attachment_id}`);
