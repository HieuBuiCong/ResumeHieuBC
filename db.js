import pool from "../config/database.js";

// Helper function to get user_id from username
const getUserIdFromUsername = async (username) => {
  const query = `SELECT user_id FROM users WHERE username = $1`;
  const { rows } = await pool.query(query, [username]);
  return rows[0]?.user_id;
};

// Helper function to get task_category_id from task_name
const getTaskCategoryIdFromTaskName = async (taskName) => {
  const query = `SELECT task_category_id FROM task_category WHERE task_name = $1`;
  const { rows } = await pool.query(query, [taskName]);
  return rows[0]?.task_category_id;
};

// ✅ Create a new CID task (Admin Only) - Now supports dependencies
export const createCIDTask = async (taskData) => {
  const assignee_id = await getUserIdFromUsername(taskData.assignee_name);
  if (!assignee_id) throw new Error(`The assignee name: ${taskData.assignee_name} not found`);

  const task_category_id = await getTaskCategoryIdFromTaskName(taskData.task_name);
  if (!task_category_id) throw new Error(`Task name: ${taskData.task_name} not found`);

  const query = `
    INSERT INTO cid_task (task_category_id, cid_id, status, assignee_id, deadline, dependency_cid_id, dependency_date)
    VALUES ($1, $2, COALESCE($3, 'in-progress'), $4, $5, $6, $7::INTERVAL)
    RETURNING *`;

  const values = [
    task_category_id,
    taskData.cid_id,
    taskData.status,
    assignee_id,
    taskData.deadline,
    taskData.dependency_cid_id || null, // ✅ Allows NULL if no dependency
    taskData.dependency_date || null   // ✅ Ensure INTERVAL format
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all CID tasks - Now includes dependency_cid_id and dependency_date
export const getAllCIDTasks = async () => {
  const query = `
    SELECT 
      ct.*, 
      tc.task_name, 
      c.cid_id,  
      u1.username AS assignee_name, 
      u2.username AS approver_name 
    FROM cid_task ct
    JOIN users u1 ON ct.assignee_id = u1.user_id
    LEFT JOIN users u2 ON ct.task_approver_id = u2.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    JOIN cid c ON ct.cid_id = c.cid_id
    ORDER BY ct.cid_task_id ASC`;

  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a CID task by ID - Now includes dependencies
export const getCIDTaskById = async (cidTaskId) => {
  const query = `
    SELECT 
      ct.*, 
      tc.task_name, 
      c.cid_id, 
      u1.username AS assignee_name, 
      u2.username AS approver_name 
    FROM cid_task ct
    JOIN users u1 ON ct.assignee_id = u1.user_id
    LEFT JOIN users u2 ON ct.task_approver_id = u2.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    JOIN cid c ON ct.cid_id = c.cid_id
    WHERE ct.cid_task_id = $1`;

  const { rows } = await pool.query(query, [cidTaskId]);
  return rows[0];
};

// ✅ Update a CID task (Admin Only) - Now allows updating dependencies
export const updateCIDTask = async (cidTaskId, updatedFields) => {
  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedFields);

  const query = `UPDATE cid_task SET ${fields} WHERE cid_task_id = $${values.length + 1} RETURNING *`;
  const { rows } = await pool.query(query, [...values, cidTaskId]);
  return rows[0];
};

// ✅ Get CID tasks assigned to a specific user - Now includes dependencies
export const getCIDTasksByUser = async (userId) => {
  const query = `
    SELECT 
      ct.*, 
      tc.task_name, 
      c.cid_id,  
      u1.username AS assignee_name, 
      u2.username AS approver_name 
    FROM cid_task ct
    JOIN users u1 ON ct.assignee_id = u1.user_id
    LEFT JOIN users u2 ON ct.task_approver_id = u2.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    JOIN cid c ON ct.cid_id = c.cid_id
    WHERE ct.assignee_id = $1
    ORDER BY ct.cid_task_id ASC`;

  const { rows } = await pool.query(query, [userId]);
  return rows;
};

// ✅ Get all CID tasks for a specific CID - Now includes dependencies
export const getCIDTasksByCID = async (cid_id) => {
  const query = `
    SELECT 
      ct.*, 
      tc.task_name, 
      c.cid_id, 
      u1.username AS assignee_name, 
      u2.username AS approver_name 
    FROM cid_task ct
    JOIN users u1 ON ct.assignee_id = u1.user_id
    LEFT JOIN users u2 ON ct.task_approver_id = u2.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    JOIN cid c ON ct.cid_id = c.cid_id
    WHERE ct.cid_id = $1
    ORDER BY ct.cid_task_id ASC`;

  const { rows } = await pool.query(query, [cid_id]);
  return rows;
};

// ✅ Delete a CID task (Admin Only)
export const deleteCIDTask = async (cidTaskId) => {
  const query = "DELETE FROM cid_task WHERE cid_task_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [cidTaskId]);
  return rows[0];
};

// ✅ Update only the status (User Permission by answering question) - ✅ Includes submitted_date update
export const updateCIDTaskStatus = async (cidTaskId, newStatus) => {
  const query = `
    UPDATE cid_task 
    SET status = $1, submitted_date = CURRENT_TIMESTAMP
    WHERE cid_task_id = $2
    RETURNING *`;

  const { rows } = await pool.query(query, [newStatus, cidTaskId]);
  return rows[0];
};

// ✅ Approve or Reject Task (Updates `approval_date` and `task_approver_id`)
export const updateCIDTaskApproval = async (cidTaskId, newStatus, approverId) => {
  const query = `
    UPDATE cid_task 
    SET status = $1, approval_date = CURRENT_TIMESTAMP, task_approver_id = $2 
    WHERE cid_task_id = $3
    RETURNING *`;

  const { rows } = await pool.query(query, [newStatus, approverId, cidTaskId]);
  return rows[0];
};

