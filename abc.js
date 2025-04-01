import express from 'express';
import { uploadCIDAttachment, uploadCIDTaskAttachment } from '../controllers/attachmentController.js';
import upload from '../middlewares/fileUpload.js';

const router = express.Router();

// CID attachments
router.post('/cid/:cid_id/attachments', upload.single('file'), uploadCIDAttachment);

// CID Task attachments
router.post('/cid-task/:cid_task_id/attachments', upload.single('file'), uploadCIDTaskAttachment);

export default router;
