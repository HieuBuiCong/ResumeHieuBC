import pool from "../config/database.js";

/**
 * ✅ Updates task status based on logic previously in PostgreSQL trigger.
 * ✅ Now supports TIMESTAMP WITH TIME ZONE.
 * ✅ Converts deadlines to Hanoi time (`Asia/Ho_Chi_Minh`).
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

        // ✅ Update dependent tasks if current task is "complete" or "cancel"
        if (["complete", "cancel"].includes(status)) {
            await pool.query(`
                UPDATE cid_task 
                SET deadline = ( ($1::TIMESTAMP AT TIME ZONE 'UTC') + dependency_date ) AT TIME ZONE 'Asia/Ho_Chi_Minh'
                WHERE dependency_cid_id = $2
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
