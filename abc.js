import pool from "../config/database.js";

/**
 * ✅ Updates CID status based on the status of its related cid_tasks.
 * - If one cid_task is "overdue" → CID is "overdue".
 * - Else, if one cid_task is "in-progress" → CID is "in-progress".
 * - Else, prioritizes status in this order: "submitted" → "complete" → "cancel" → "pending".
 */
export const updateCIDStatus = async (cidId) => {
    try {
        // 🔹 1) Get the Statuses of All Related cid_tasks
        const { rows: tasks } = await pool.query(`
            SELECT status, deadline 
            FROM cid_task 
            WHERE cid_id = $1
        `, [cidId]);

        if (tasks.length === 0) {
            throw new Error(`No tasks found for CID ID: ${cidId}`);
        }

        // 🔹 2) Determine the New CID Status
        let newStatus = "pending"; // Default status
        let latestDeadline = null;

        for (const task of tasks) {
            if (task.status === "overdue") {
                newStatus = "overdue";
                latestDeadline = task.deadline;
                break; // Highest priority, no need to check further
            } else if (task.status === "in-progress") {
                newStatus = "in-progress";
                latestDeadline = task.deadline;
            } else if (task.status === "submitted" && newStatus !== "in-progress") {
                newStatus = "submitted";
                latestDeadline = task.deadline;
            } else if (task.status === "complete" && !["in-progress", "submitted"].includes(newStatus)) {
                newStatus = "complete";
                latestDeadline = task.deadline;
            } else if (task.status === "cancel" && !["in-progress", "submitted", "complete"].includes(newStatus)) {
                newStatus = "cancel";
                latestDeadline = task.deadline;
            }
        }

        // 🔹 3) Update CID Status & Deadline in Database
        const updatedCID = await pool.query(`
            UPDATE cid
            SET status = $1, 
                deadline = $2
            WHERE cid_id = $3
            RETURNING *;
        `, [newStatus, latestDeadline, cidId]);

        console.log(`✅ CID #${cidId} updated to status: ${newStatus} with deadline: ${latestDeadline}`);
        return updatedCID.rows[0];

    } catch (error) {
        console.error("❌ Error updating CID status:", error);
        throw error;
    }
};

/**
 * ✅ Updates closing_date when CID status is "complete" or "cancel".
 */
export const updateCIDClosingDate = async (cidId) => {
    try {
        // 🔹 1) Check CID Status
        const { rows } = await pool.query(`
            SELECT status FROM cid WHERE cid_id = $1
        `, [cidId]);

        if (rows.length === 0) {
            throw new Error(`CID with ID ${cidId} not found.`);
        }

        const cidStatus = rows[0].status;

        // 🔹 2) Only Update closing_date if CID is "complete" or "cancel"
        if (["complete", "cancel"].includes(cidStatus)) {
            const closingDate = new Date();

            await pool.query(`
                UPDATE cid 
                SET closing_date = $1
                WHERE cid_id = $2
            `, [closingDate, cidId]);

            console.log(`✅ CID #${cidId} closing date set to ${closingDate}`);
        } else {
            console.log(`ℹ️ CID #${cidId} not complete/cancelled, no closing date update.`);
        }

    } catch (error) {
        console.error("❌ Error updating CID closing date:", error);
        throw error;
    }
};
