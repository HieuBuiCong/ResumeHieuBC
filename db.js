// Helper function to get user_id from username
const getUserIdFromUsername = async (username) => {
  const query = `SELECT user_id FROM user WHERE username = $1`;
  const { rows } = await pool.query(query, [username]);
  return rows[0]?.user_id;
};

// Helper function to get task_category_id from task_name
const getTaskCategoryIdFromTaskName = async (taskName) => {
  const query = `SELECT task_category_id FROM task_category WHERE task_name = $1`;
  const { rows } = await pool.query(query, [taskName]);
  return rows[0]?.task_category_id;
};

// ✅ Create a new CID task (Admin Only)
export const createCIDTask = async (taskData) => {
  const assignee_id = await getUserIdFromUsername(taskData.assignee_name);
  if (!assignee_id) throw new Error(`The assignee name: ${taskData.assignee_name} not found`);

  const task_category_id = await getTaskCategoryIdFromTaskName(taskData.task_name);
  if (!task_category_id) throw new Error(`Task name: ${taskData.task_name} not found`);

  const query = `
    INSERT INTO cid_task (task_category_id, cid_id, status, assignee_id, deadline)
    VALUES ($1, $2, COALESCE($3, 'in-progress'), $4, $5)
    RETURNING *`;

  const values = [
    task_category_id,
    taskData.cid_id,
    taskData.status,
    assignee_id,
    taskData.deadline,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
