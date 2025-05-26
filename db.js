import { Storage } from '@google-cloud/storage';

const storage = new Storage();
const bucketName = process.env.GCS_BUCKET; // Set this in your .env

export const uploadFileToGCS = async (fileBuffer, originalName, mimetype) => {
  const fileName = `${Date.now()}_${originalName}`;
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  await file.save(fileBuffer, {
    metadata: { contentType: mimetype },
    resumable: false,
  });

  // Make file public (optional)
  // await file.makePublic();

  // Get public URL (if public), else use signed URL for private access
  const [url] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
  });

  return {
    file_name: originalName,
    file_path: fileName,    // Store GCS path, not local path
    public_url: url,        // Save/download link to DB if you want
  };
};

export const deleteFileFromGCS = async (filePath) => {
  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);
  await file.delete();
};
