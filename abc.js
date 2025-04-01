import { saveAttachmentToDB } from '../services/attachmentService.js';

// Upload attachment for CID
export const uploadCIDAttachment = async (req, res) => {
  try {
    const { cid_id } = req.params;
    const file = req.file;

    if (!file) {
      throw new Error('File is required.');
    }

    const attachment = await saveAttachmentToDB({
      file_name: file.originalname,
      file_path: file.path,
      file_type: file.mimetype,
      file_size: file.size,
      cid_id,
      uploaded_by: req.user.id,
    });

    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Upload attachment for CID Task
export const uploadCIDTaskAttachment = async (req, res) => {
  try {
    const { cid_task_id } = req.params;
    const file = req.file;

    if (!file) {
      throw new Error('File is required.');
    }

    const attachment = await saveAttachmentToDB({
      file_name: file.originalname,
      file_path: file.path,
      file_type: file.mimetype,
      file_size: file.size,
      cid_task_id,
      uploaded_by: req.user.id,
    });

    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
