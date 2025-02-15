import pool from "../config/database.js";

// ✅ Create a new CID task (Admin Only)
export const createCIDTask = async (taskData) => {
  const query = `
    INSERT INTO cid_task (task_category_id, cid_id, status_id, user_id, deadline) 
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;

  const values = [
    taskData.task_category_id,
    taskData.cid_id,
    taskData.status_id,
    taskData.user_id,
    taskData.deadline
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all CID tasks (Admin Only)
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

// ✅ Get a CID task by ID
export const getCIDTaskById = async (cidTaskId) => {
  const query = "SELECT * FROM cid_task WHERE cid_task_id = $1";
  const { rows } = await pool.query(query, [cidTaskId]);
  return rows[0];
};

// ✅ Update a CID task (Admin Only)
export const updateCIDTask = async (cidTaskId, updatedFields) => {
  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedFields);

  const query = `UPDATE cid_task SET ${fields} WHERE cid_task_id = $${values.length + 1} RETURNING *`;

  const { rows } = await pool.query(query, [...values, cidTaskId]);
  return rows[0];
};

// ✅ Update only the status (User Permission)
export const updateCIDTaskStatus = async (cidTaskId, statusId, userId) => {
  const query = `
    UPDATE cid_task 
    SET status_id = $1 
    WHERE cid_task_id = $2 AND user_id = $3
    RETURNING *`;

  const { rows } = await pool.query(query, [statusId, cidTaskId, userId]);
  return rows[0];
};

// ✅ Delete a CID task (Admin Only)
export const deleteCIDTask = async (cidTaskId) => {
  const query = "DELETE FROM cid_task WHERE cid_task_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [cidTaskId]);
  return rows[0];
};
