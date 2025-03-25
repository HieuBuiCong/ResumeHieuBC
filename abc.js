export const createCIDTask = async (taskData) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // ✅ Start transaction

    const assignee_id = await getUserIdFromUsername(taskData.assignee_name);
    if (!assignee_id) throw new Error(`Assignee: ${taskData.assignee_name} not found`);

    const task_category_id = await getTaskCategoryIdFromTaskName(taskData.task_name);
    if (!task_category_id) throw new Error(`Task name: ${taskData.task_name} not found`);

    let status = taskData.status || 'in-progress';
    let deadline = taskData.deadline;

    // ✅ Handle dependency logic explicitly
    if (taskData.dependency_cid_id) {
      const dependencyResult = await client.query(
        `SELECT status, approval_date FROM cid_task WHERE cid_task_id = $1 FOR UPDATE`,
        [taskData.dependency_cid_id]
      );

      if (dependencyResult.rows.length === 0) {
        throw new Error(`Dependency task ID ${taskData.dependency_cid_id} not found.`);
      }

      const dependencyTask = dependencyResult.rows[0];

      if (!['complete', 'cancel'].includes(dependencyTask.status)) {
        status = 'pending';
      } else if (taskData.dependency_date && dependencyTask.approval_date) {
        const deadlineResult = await client.query(
          `SELECT (($1::timestamp AT TIME ZONE 'UTC') + ($2 * INTERVAL '1 day')) AT TIME ZONE 'Asia/Ho_Chi_Minh' AS calculated_deadline`,
          [dependencyTask.approval_date, taskData.dependency_date]
        );
        deadline = deadlineResult.rows[0].calculated_deadline;
      }
    }

    // ✅ Insert new task
    const insertQuery = `
      INSERT INTO cid_task (task_category_id, cid_id, status, assignee_id, deadline, dependency_cid_id, dependency_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

    const insertValues = [
      task_category_id,
      taskData.cid_id,
      status,
      assignee_id,
      deadline,
      taskData.dependency_cid_id || null,
      taskData.dependency_date || null,
    ];

    const { rows } = await client.query(insertQuery, insertValues);
    const createdTask = rows[0];

    // ✅ Immediately ensure consistency by running update logic on dependency task
    if (taskData.dependency_cid_id) {
      await updateTaskStatusLogic(taskData.dependency_cid_id);
    }

    await client.query('COMMIT'); // ✅ Commit transaction

    return createdTask;
  } catch (error) {
    await client.query('ROLLBACK'); // 🚨 Rollback on error
    console.error("Error creating CID Task:", error);
    throw error;
  } finally {
    client.release();
  }
};
