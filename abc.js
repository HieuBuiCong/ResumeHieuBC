// ✅ Create a new CID task (Admin Only) - Now supports dependencies
export const createCIDTask = async (taskData) => {
  const assignee_id = await getUserIdFromUsername(taskData.assignee_name);
  if (!assignee_id) throw new Error(`The assignee name: ${taskData.assignee_name} not found`);

  const task_category_id = await getTaskCategoryIdFromTaskName(taskData.task_name);
  if (!task_category_id) throw new Error(`Task name: ${taskData.task_name} not found`);

  const query = `
    INSERT INTO cid_task (task_category_id, cid_id, status, assignee_id, deadline, dependency_cid_id, dependency_date)
    VALUES ($1, $2, COALESCE($3, 'in-progress'), $4, $5, $6, $7)
    RETURNING *`;

  const values = [
    task_category_id,
    taskData.cid_id,
    taskData.status,
    assignee_id,
    taskData.deadline,
    taskData.dependency_cid_id || null, // ✅ Allows NULL if no dependency
    taskData.dependency_date || null   
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

-------------
import pool from "../config/database.js";

/**
 * ✅ Updates task status correctly based on dependencies.
 * ✅ Ensures dependent tasks are "pending" if their parent task is not complete.
 */
export const updateTaskStatusLogic = async (taskId, newStatus = null, approverId = null) => {
    try {
        // Fetch task details
        const { rows } = await pool.query("SELECT * FROM cid_task WHERE cid_task_id = $1", [taskId]);
        if (rows.length === 0) {
            throw new Error(`Task with ID ${taskId} not found.`);
        }

        const task = rows[0];
        let status = newStatus || task.status;
        let approvalDate = task.approval_date;
        let submittedDate = task.submitted_date;

        // ✅ If status is "submitted", update submitted_date
        if (status === "submitted") {
            submittedDate = new Date(); // Automatically stores in UTC
        }

        // ✅ If status is "complete" or "cancel", update approval_date
        if (["complete", "cancel"].includes(status)) {
            approvalDate = new Date(); // Automatically stores in UTC
        } else {
            approvalDate = null; // Reset approval date if status changes back
        }

        // ✅ If deadline has passed and task is still "in-progress", mark as "overdue"
        if (task.deadline && new Date(task.deadline) < new Date() && status === "in-progress") {
            status = "overdue";
        }

        // ✅ If the deadline is extended and task was "overdue", reset to "in-progress"
        if (task.deadline && new Date(task.deadline) > new Date() && task.status === "overdue") {
            status = "in-progress";
        }

        // 🚨 **FIX: Dependent Tasks Should Not Be "In-Progress" If Parent is Not Completed**
        if (["overdue", "in-progress", "pending", "submitted"].includes(status)) {
            await pool.query(`
                UPDATE cid_task 
                SET status = 'pending'
                WHERE dependency_cid_id = $1
                AND status NOT IN ('complete', 'submitted', 'cancel')
            `, [taskId]);
        }
        
        //✅ If the current task is "complete" or "cancel" update dependent tasks deadline of mother deadline + dependency_date and status of "in-progress"
        if (["complete", "cancel"].includes(status)) {
            await pool.query(`
                UPDATE cid_task
                SET deadline = (
                    CASE
                        WHEN dependency_date = 0 THEN deadline
                        ELSE ($1::TIMESTAMP AT TIME ZONE 'UTC') + (dependency_date * INTERVAL '1 day')
                    END
                ) AT TIME ZONE 'Asia/Ho_Chi_Minh'
                WHERE dependency_cid_id = $2
                AND dependency_cid_id IS NOT NULL  -- ✅ Only update if task has a dependency
                AND status NOT IN ('complete', 'submitted', 'cancel')
            `, [approvalDate, taskId]);
            
            await pool.query(`
                UPDATE cid_task 
                SET status = 'in-progress'
                WHERE dependency_cid_id = $1
                AND status NOT IN ('complete', 'submitted', 'cancel')
                AND deadline IS NOT NULL AND deadline > NOW()
            `, [taskId]);

            await pool.query(`
                UPDATE cid_task 
                SET status = 'overdue'
                WHERE dependency_cid_id = $1
                AND status NOT IN ('complete', 'submitted', 'cancel')
                AND deadline IS NOT NULL AND deadline < NOW()
            `, [taskId]);
        }

        // ✅ Update the main task in the database
        const updatedTask = await pool.query(`
            UPDATE cid_task
            SET status = $1, 
                approval_date = $2,
                submitted_date = $3
            WHERE cid_task_id = $4
            RETURNING *,
                approval_date AT TIME ZONE 'Asia/Ho_Chi_Minh' AS local_approval_date,
                submitted_date AT TIME ZONE 'Asia/Ho_Chi_Minh' AS local_submitted_date,
                deadline AT TIME ZONE 'Asia/Ho_Chi_Minh' AS local_deadline
        `, [status, approvalDate, submittedDate, taskId]);

        return updatedTask.rows[0];

    } catch (error) {
        console.error("Error updating task status logic:", error);
        throw error;
    }
};
