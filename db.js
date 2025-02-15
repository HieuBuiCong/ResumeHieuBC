import pool from "../config/database.js";

// ✅ Get all CID tasks for a specific CID
export const getCIDTasksByCID = async (cid_id) => {
  const query = `
    SELECT ct.*, s.status_name, u.username, tc.task_name
    FROM cid_task ct
    JOIN status s ON ct.status_id = s.status_id
    JOIN users u ON ct.user_id = u.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    WHERE ct.cid_id = $1
    ORDER BY ct.cid_task_id ASC`;

  const { rows } = await pool.query(query, [cid_id]);
  return rows;
};
