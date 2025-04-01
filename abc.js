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
