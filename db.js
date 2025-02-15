import pool from "../config/database.js";

// ✅ Create a new task category
export const createTaskCategory = async (taskName) => {
  const query = `INSERT INTO task_category (task_name) VALUES ($1) RETURNING *`;
  const values = [taskName];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all task categories
export const getAllTaskCategories = async () => {
  const query = "SELECT * FROM task_category ORDER BY task_category_id ASC";
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a task category by ID
export const getTaskCategoryById = async (taskCategoryId) => {
  const query = "SELECT * FROM task_category WHERE task_category_id = $1";
  const { rows } = await pool.query(query, [taskCategoryId]);
  return rows[0];
};

// ✅ Update a task category
export const updateTaskCategory = async (taskCategoryId, taskName) => {
  const query = `UPDATE task_category SET task_name = $1 WHERE task_category_id = $2 RETURNING *`;
  const { rows } = await pool.query(query, [taskName, taskCategoryId]);
  return rows[0];
};

// ✅ Delete a task category
export const deleteTaskCategory = async (taskCategoryId) => {
  const query = "DELETE FROM task_category WHERE task_category_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [taskCategoryId]);
  return rows[0];
};
