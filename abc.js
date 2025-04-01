import multer from 'multer';
import path from 'path';

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where files are stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

export default upload;


-----------------------
CREATE TABLE attachments (
  attachment_id SERIAL PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- local storage path
  file_type VARCHAR(100),
  file_size BIGINT,
  cid_id INT REFERENCES cid(cid_id) ON DELETE CASCADE,
  cid_task_id INT REFERENCES cid_task(cid_task_id) ON DELETE CASCADE,
  uploaded_by INT REFERENCES users(user_id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (file_path)
);

CREATE INDEX idx_attachments_cid ON attachments(cid_id);
CREATE INDEX idx_attachments_task ON attachments(cid_task_id);
---------------------------

import pool from '../config/database.js';

export const addAttachment = async ({ file_name, file_path, file_type, file_size, cid_id = null, cid_task_id = null, uploaded_by }) => {
  const query = `
    INSERT INTO attachments (file_name, file_path, file_type, file_size, cid_id, cid_task_id, uploaded_by, uploaded_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
    RETURNING *;
  `;
  const values = [file_name, file_path, file_type, file_size, cid_id, cid_task_id, uploaded_by];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAttachmentsByCID = async (cid_id) => {
  const { rows } = await pool.query(
    'SELECT * FROM attachments WHERE cid_id = $1 ORDER BY uploaded_at DESC;',
    [cid_id]
  );
  return rows;
};

export const getAttachmentsByTask = async (cid_task_id) => {
  const { rows } = await pool.query(
    'SELECT * FROM attachments WHERE cid_task_id = $1 ORDER BY uploaded_at DESC;',
    [cid_task_id]
  );
  return rows;
};

export const deleteAttachment = async (attachment_id) => {
  const { rows } = await pool.query(
    'DELETE FROM attachments WHERE attachment_id = $1 RETURNING *;',
    [attachment_id]
  );
  return rows[0];
};

----------------------------------
import {
  addAttachment,
  getAttachmentsByCID,
  getAttachmentsByTask,
  deleteAttachment
} from '../models/attachmentModel.js';
import fs from 'fs';

// 🔹 Add Attachment for CID
export const addCidAttachment = async (req, res) => {
  try {
    const { cid_id } = req.params;
    const file = req.file;
    const uploaded_by = req.user.id;

    const attachment = await addAttachment({
      file_name: file.originalname,
      file_path: file.path,
      file_type: file.mimetype,
      file_size: file.size,
      cid_id,
      uploaded_by
    });

    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Add Attachment for CID Task
export const addTaskAttachment = async (req, res) => {
  try {
    const { cid_task_id } = req.params;
    const file = req.file;
    const uploaded_by = req.user.id;

    const attachment = await addAttachment({
      file_name: file.originalname,
      file_path: file.path,
      file_type: file.mimetype,
      file_size: file.size,
      cid_task_id,
      uploaded_by
    });

    res.status(201).json({ success: true, data: attachment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Fetch attachments by CID
export const fetchAttachmentsByCID = async (req, res) => {
  try {
    const { cid_id } = req.params;
    const attachments = await getAttachmentsByCID(cid_id);
    res.status(200).json({ success: true, data: attachments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Fetch attachments by CID Task
export const fetchAttachmentsByTask = async (req, res) => {
  try {
    const { cid_task_id } = req.params;
    const attachments = await getAttachmentsByTask(cid_task_id);
    res.status(200).json({ success: true, data: attachments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Delete Attachment
export const removeAttachment = async (req, res) => {
  try {
    const { attachment_id } = req.params;
    const deleted = await deleteAttachment(attachment_id);

    // 🗑️ Delete file from server
    fs.unlinkSync(deleted.file_path);

    res.status(200).json({ success: true, data: deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
4️⃣ ✅ Router (routes/attachmentRoutes.js):
javascript
Copy
Edit
import express from 'express';
import upload from '../middleware/upload.js';
import {
  addCidAttachment,
  addTaskAttachment,
  fetchAttachmentsByCID,
  fetchAttachmentsByTask,
  removeAttachment
} from '../controllers/attachmentController.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

// 🔹 Add attachments routes
router.post('/cid/:cid_id/attachments', verifyUser, upload.single('file'), addCidAttachment);
router.post('/cid-task/:cid_task_id/attachments', verifyUser, upload.single('file'), addTaskAttachment);

// 🔹 Get attachments routes
router.get('/cid/:cid_id/attachments', verifyUser, fetchAttachmentsByCID);
router.get('/cid-task/:cid_task_id/attachments', verifyUser, fetchAttachmentsByTask);

// 🔹 Delete attachment
router.delete('/attachments/:attachment_id', verifyUser, removeAttachment);

export default router;

---------------------------------
import express from 'express';
import upload from '../middleware/upload.js';
import {
  addCidAttachment,
  addTaskAttachment,
  fetchAttachmentsByCID,
  fetchAttachmentsByTask,
  removeAttachment
} from '../controllers/attachmentController.js';
import { verifyUser } from '../middleware/auth.js';

const router = express.Router();

// 🔹 Add attachments routes
router.post('/cid/:cid_id/attachments', verifyUser, upload.single('file'), addCidAttachment);
router.post('/cid-task/:cid_task_id/attachments', verifyUser, upload.single('file'), addTaskAttachment);

// 🔹 Get attachments routes
router.get('/cid/:cid_id/attachments', verifyUser, fetchAttachmentsByCID);
router.get('/cid-task/:cid_task_id/attachments', verifyUser, fetchAttachmentsByTask);

// 🔹 Delete attachment
router.delete('/attachments/:attachment_id', verifyUser, removeAttachment);

export default router;
