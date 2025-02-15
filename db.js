import pool from "../config/database.js";

// ✅ Get all CID tasks (Users can see all)
export const getAllCIDTasks = async () => {
  const query = `
    SELECT ct.*, s.status_name, u.username, tc.task_name, c.cid_id 
    FROM cid_task ct
    JOIN status s ON ct.status_id = s.status_id
    JOIN users u ON ct.user_id = u.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    JOIN cid c ON ct.cid_id = c.cid_id
    ORDER BY ct.cid_task_id ASC`;

  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get CID tasks assigned to a specific user
export const getCIDTasksByUser = async (userId) => {
  const query = `
    SELECT ct.*, s.status_name, u.username, tc.task_name, c.cid_id 
    FROM cid_task ct
    JOIN status s ON ct.status_id = s.status_id
    JOIN users u ON ct.user_id = u.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    JOIN cid c ON ct.cid_id = c.cid_id
    WHERE ct.user_id = $1
    ORDER BY ct.cid_task_id ASC`;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};
