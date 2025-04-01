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
