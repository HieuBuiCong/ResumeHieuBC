import pool from "../config/database.js";

// Helper function to get user_id from username
const getUserIdFromUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const { rows } = await pool.query(query, [username]);
  return rows[0]?.user_id;
}

// Helper function to get task_category_id from task_name
const getTaskCategoryIdFromTaskName = async (taskName) => {
  const query = `SELECT * FROM task_category WHERE task_name = $1`;
  const { rows } = await pool.query(query, [taskName]);
  return rows[0]?.task_category_id;
}

// ✅ Create a new CID task (Admin Only)
export const createCIDTask = async (taskData) => {

  // convert assignee_name to assignee_id
  const assignee_id = await getUserIdFromUsername(taskData.assignee_name);
  if(!assignee_id) {
    throw new Error(`The assignee name : ${taskData.assignee_name} not found`);
  }
  // convert approver_name to approver_id
  const task_approver_id = await getUserIdFromUsername(taskData.approver_name);
  if(!task_approver_id) {
    throw new Error(`The approver name : ${taskData.approver_name} not found`);
  }
  // convert task_name to task_category_id
  const task_category_id = await getTaskCategoryIdFromTaskName(taskData.task_name);
  if(!task_category_id) {
    throw new Error(`Task name : ${taskData.task_name} not found`);
  }

  const query = `INSERT INTO cid_task (task_category_id, cid_id, status, assignee_id, deadline, task_approver_id)
                  VALUES ($1, $2, COALESCE($3, 'in-progress'), $4, $5, $6) RETURNING *`;
  const values = [
    task_category_id,
    taskData.cid_id,
    taskData.status,
    assignee_id,
    taskData.deadline,
    task_approver_id,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all CID tasks (Users can see all)
export const getAllCIDTasks = async () => {
  const query = `
    SELECT ct.*, s.status_name, u.username, tc.task_name, c.cid_id 
    FROM cid_task ct
    JOIN users u ON ct.user_id = u.user_id
    JOIN task_category tc ON ct.task_category_id = tc.task_category_id
    JOIN cid c ON ct.cid_id = c.cid_id
    ORDER BY ct.cid_task_id ASC`;

  const { rows } = await pool.query(query);
  return rows;
};

// // ✅ Get a CID task by ID
// export const getCIDTaskById = async (cidTaskId) => {
//   const query = "SELECT * FROM cid_task WHERE cid_task_id = $1";
//   const { rows } = await pool.query(query, [cidTaskId]);
//   return rows[0];
// };

// // ✅ Update a CID task (Admin Only)
// export const updateCIDTask = async (cidTaskId, updatedFields) => {
//   const fields = Object.keys(updatedFields)
//     .map((key, index) => `${key} = $${index + 1}`)
//     .join(", ");
//   const values = Object.values(updatedFields);

//   const query = `UPDATE cid_task SET ${fields} WHERE cid_task_id = $${values.length + 1} RETURNING *`;

//   const { rows } = await pool.query(query, [...values, cidTaskId]);
//   return rows[0];
// };


// // ✅ Delete a CID task (Admin Only)
// export const deleteCIDTask = async (cidTaskId) => {
//   const query = "DELETE FROM cid_task WHERE cid_task_id = $1 RETURNING *";
//   const { rows } = await pool.query(query, [cidTaskId]);
//   return rows[0];
// };


// // ✅ Update only the status (User Permission by answering question)
// export const updateCIDTaskStatus = async (cidTaskId, statusId, userId) => {
//     const query = `
//       UPDATE cid_task 
//       SET status_id = $1 
//       WHERE cid_task_id = $2 AND user_id = $3
//       RETURNING *`;
  
//     const { rows } = await pool.query(query, [statusId, cidTaskId, userId]);
//     return rows[0];
//   };


// // ✅ Approve or Reject Task (Updates `approval_date` and `task_approver_id`)
// export const updateCIDTaskApproval = async (cidTaskId, statusId, approverId) => {
//     const query = `
//       UPDATE cid_task 
//       SET status_id = $1, approval_date = CURRENT_TIMESTAMP, task_approver_id = $2 
//       WHERE cid_task_id = $3
//       RETURNING *`;
  
//     const { rows } = await pool.query(query, [statusId, approverId, cidTaskId]);
//     return rows[0];
//   };


//   // ✅ Get CID tasks assigned to a specific user
// export const getCIDTasksByUser = async (userId) => {
//     const query = `
//       SELECT ct.*, s.status_name, u.username, tc.task_name, c.cid_id 
//       FROM cid_task ct
//       JOIN status s ON ct.status_id = s.status_id
//       JOIN users u ON ct.user_id = u.user_id
//       JOIN task_category tc ON ct.task_category_id = tc.task_category_id
//       JOIN cid c ON ct.cid_id = c.cid_id
//       WHERE ct.user_id = $1
//       ORDER BY ct.cid_task_id ASC`;
  
//     const { rows } = await pool.query(query, [userId]);
//     return rows;
//   };

// // ✅ Get all CID tasks for a specific CID
// export const getCIDTasksByCID = async (cid_id) => {
//     const query = `
//       SELECT ct.*, s.status_name, u.username, tc.task_name
//       FROM cid_task ct
//       JOIN status s ON ct.status_id = s.status_id
//       JOIN users u ON ct.user_id = u.user_id
//       JOIN task_category tc ON ct.task_category_id = tc.task_category_id
//       WHERE ct.cid_id = $1
//       ORDER BY ct.cid_task_id ASC`;
  
//     const { rows } = await pool.query(query, [cid_id]);
//     return rows;
//   };
