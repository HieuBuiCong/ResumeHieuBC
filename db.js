import pool from "../config/database.js";

/**
 * ✅ Updates task status based on logic previously in PostgreSQL trigger
 */
export const updateTaskStatusLogic = async (taskId) => {
    try {
        // 1️⃣ Get the task details
        const { rows } = await pool.query("SELECT * FROM cid_task WHERE cid_task_id = $1", [taskId]);
        if (rows.length === 0) {
            throw new Error(`Task with ID ${taskId} not found.`);
        }

        const task = rows[0];
        let newStatus = task.status;
        let approvalDate = task.approval_date;

        // 2️⃣ If status is "complete" or "cancel", set approval_date
        if (["complete", "cancel"].includes(newStatus)) {
            approvalDate = new Date();
        } else {
            approvalDate = null; // Reset approval date if changed back
        }

        // 3️⃣ If the deadline has passed and status is "in-progress", mark as "overdue"
        if (task.deadline && new Date(task.deadline) < new Date() && newStatus === "in-progress") {
            newStatus = "overdue";
        }

        // 4️⃣ If the deadline is extended and the task was "overdue", reset to "in-progress"
        if (task.deadline && new Date(task.deadline) > new Date() && task.status === "overdue") {
            newStatus = "in-progress";
        }

        // 5️⃣ If the current task is not "complete" or "cancel", force dependent tasks to "pending"
        if (!["complete", "cancel"].includes(newStatus)) {
            await pool.query(`
                UPDATE cid_task
                SET status = 'pending'
                WHERE dependency_cid_id = $1
                AND status NOT IN ('complete', 'submitted', 'cancel')
            `, [taskId]);
        }

        // 6️⃣ If the task is "complete" or "cancel", update dependent tasks
        if (["complete", "cancel"].includes(newStatus)) {
            await pool.query(`
                UPDATE cid_task
                SET deadline = ($1 + dependency_date)
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

        // ✅ Update the task status and approval_date
        const updatedTask = await pool.query(`
            UPDATE cid_task
            SET status = $1, approval_date = $2
            WHERE cid_task_id = $3
            RETURNING *
        `, [newStatus, approvalDate, taskId]);

        return updatedTask.rows[0];

    } catch (error) {
        console.error("Error updating task status logic:", error);
        throw error;
    }
};
