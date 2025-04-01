CREATE TABLE attachments (
    attachment_id SERIAL PRIMARY KEY,
    cid_id INT REFERENCES cid(cid_id) ON DELETE CASCADE,
    cid_task_id INT REFERENCES cid_task(cid_task_id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);
------------------
// model.js
import pool from "../config/database.js";

// Add attachment (for both CID and CID Task)
export const addAttachment = async ({ cid_id, cid_task_id, file_name, file_url }) => {
  const query = `
    INSERT INTO attachments (cid_id, cid_task_id, file_name, file_url)
    VALUES ($1, $2, $3, $4) RETURNING *
  `;
  const values = [cid_id, cid_task_id, file_name, file_url];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// Get attachments by CID
export const getAttachmentsByCID = async (cid_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM attachments WHERE cid_id = $1 ORDER BY uploaded_at DESC`, 
    [cid_id]
  );
  return rows;
};

// Get attachments by CID Task
export const getAttachmentsByTask = async (cid_task_id) => {
  const { rows } = await pool.query(
    `SELECT * FROM attachments WHERE cid_task_id = $1 ORDER BY uploaded_at DESC`, 
    [cid_task_id]
  );
  return rows;
};

// Delete attachment
export const deleteAttachment = async (attachment_id) => {
  const { rows } = await pool.query(
    `DELETE FROM attachments WHERE attachment_id = $1 RETURNING *`, 
    [attachment_id]
  );
  return rows[0];
};
------------------------------

// controller.js
import * as AttachmentModel from '../models/attachmentModel.js';

// POST /api/cid/:cid_id/attachments
export const addCidAttachment = async (req, res) => {
  try {
    const { cid_id } = req.params;
    const { file_name, file_url } = req.body;

    const attachment = await AttachmentModel.addAttachment({ cid_id, cid_task_id: null, file_name, file_url });
    res.status(201).json({ success: true, data: attachment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/cid-task/:cid_task_id/attachments
export const addTaskAttachment = async (req, res) => {
  try {
    const { cid_task_id } = req.params;
    const { file_name, file_url } = req.body;

    const attachment = await AttachmentModel.addAttachment({ cid_id: null, cid_task_id, file_name, file_url });
    res.status(201).json({ success: true, data: attachment });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cid/:cid_id/attachments
export const getCidAttachments = async (req, res) => {
  try {
    const { cid_id } = req.params;
    const attachments = await AttachmentModel.getAttachmentsByCID(cid_id);
    res.status(200).json({ success: true, data: attachments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/cid-task/:cid_task_id/attachments
export const getTaskAttachments = async (req, res) => {
  try {
    const { cid_task_id } = req.params;
    const attachments = await AttachmentModel.getAttachmentsByTask(cid_task_id);
    res.status(200).json({ success: true, data: attachments });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/attachments/:attachment_id
export const deleteAttachment = async (req, res) => {
  try {
    const { attachment_id } = req.params;
    const deleted = await AttachmentModel.deleteAttachment(attachment_id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Attachment not found' });
    }

    res.status(200).json({ success: true, message: 'Attachment deleted successfully', data: deleted });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
-----------------

import express from 'express';
import * as AttachmentController from '../controllers/attachmentController.js';

const router = express.Router();

router.post('/cid/:cid_id/attachments', AttachmentController.addCidAttachment);
router.post('/cid-task/:cid_task_id/attachments', AttachmentController.addTaskAttachment);

router.get('/cid/:cid_id/attachments', AttachmentController.getCidAttachments);
router.get('/cid-task/:cid_task_id/attachments', AttachmentController.getTaskAttachments);

router.delete('/attachments/:attachment_id', AttachmentController.deleteAttachment);

export default router;
