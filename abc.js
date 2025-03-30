export const updateCIDStatus = async (cidId, providedStatus = null) => {
  try {
    let newStatus = providedStatus;

    if (!providedStatus) {
      // 🔹 1) Get All Task Statuses for the CID
      const { rows: tasks } = await pool.query(`
        SELECT status, deadline 
        FROM cid_task 
        WHERE cid_id = $1
      `, [cidId]);

      if (tasks.length === 0) {
        throw new Error(`No tasks found for CID ID: ${cidId}`);
      }

      // 🔹 2) Determine the New CID Status Using Priority
      const statusPriority = ["overdue", "in-progress", "submitted", "complete", "cancel", "pending"];
      
      // Check for the highest priority status
      let highestPriorityStatus = "pending"; // Default status
      let latestDeadline = null;

      for (const task of tasks) {
        const taskPriority = statusPriority.indexOf(task.status);

        if (taskPriority === -1) {
          console.warn(`Unknown status '${task.status}' for task ${task.task_id}`);
          continue; // Skip unknown statuses
        }

        if (taskPriority < statusPriority.indexOf(highestPriorityStatus)) {
          highestPriorityStatus = task.status;
          latestDeadline = task.deadline;
        }
      }
      newStatus = highestPriorityStatus;
    }

    // 🔹 3) Update CID Status and Deadline
    const updatedCID = await pool.query(`
      UPDATE cid
      SET status = $1, 
          deadline = $2
      WHERE cid_id = $3
      RETURNING *;
    `, [newStatus, null, cidId]);

    console.log(`✅ CID #${cidId} updated to status: ${newStatus}`);
    return updatedCID.rows[0];

  } catch (error) {
    console.error("❌ Error updating CID status:", error);
    throw error;
  }
};
