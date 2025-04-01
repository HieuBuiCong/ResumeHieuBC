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

--------------------------
npm install multer
-------------------------
// fileUpload.js
import multer from 'multer';
import path from 'path';

// set up local storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // files will be stored in uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// configure file filter and size
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // limit 20MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|pdf|doc|docx|xlsx|xls/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new Error('File type not supported.'));
  },
});

export default upload;
------------------------------------
