import pool from "../config/database.js";
import cron from "node-cron";

/**
 * ✅ Scheduled Job: Automatically update tasks from "in-progress" to "overdue" when deadline passes.
 * ✅ Runs every 5 minutes (adjust as needed).
 */
const checkOverdueTasks = async () => {
    try {
        console.log("🔄 Checking for overdue tasks...");

        // ✅ Find all "in-progress" tasks where deadline has passed
        const { rows: overdueTasks } = await pool.query(`
            SELECT cid_task_id FROM cid_task
            WHERE status = 'in-progress' 
            AND deadline < NOW()
        `);

        if (overdueTasks.length === 0) {
            console.log("✅ No overdue tasks found.");
            return;
        }

        // ✅ Update each overdue task to "overdue"
        const taskIds = overdueTasks.map(task => task.cid_task_id);
        await pool.query(`
            UPDATE cid_task 
            SET status = 'overdue' 
            WHERE cid_task_id = ANY($1)
        `, [taskIds]);

        console.log(`⚠️ Updated ${overdueTasks.length} tasks to "overdue".`);
    } catch (error) {
        console.error("❌ Error checking overdue tasks:", error);
    }
};

// ✅ Schedule this function to run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
    await checkOverdueTasks();
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh" // ✅ Ensures Hanoi timezone consistency
});

// ✅ Export the function for manual execution if needed
export default checkOverdueTasks;
