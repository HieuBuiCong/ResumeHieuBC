import pool from '../config/database.js';

export const saveAttachmentToDB = async ({
  file_name,
  file_path,
  file_type,
  file_size,
  cid_id = null,
  cid_task_id = null,
  uploaded_by,
}) => {
  const query = `
    INSERT INTO attachments (file_name, file_path, file_type, file_size, cid_id, cid_task_id, uploaded_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [file_name, file_path, file_type, file_size, cid_id, cid_task_id, uploaded_by];

  const { rows } = await pool.query(query, values);
  return rows[0];
};
