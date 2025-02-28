import pool from "../config/database.js";
import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

/**
 * ✅ Fetch users with pending tasks and send reminder emails.
 */
const sendPendingTaskEmails = async () => {
    try {
        console.log("🔄 Fetching pending tasks for email reminders...");

        // ✅ Fetch users with or "overdue" tasks
        const query = `
            SELECT 
                u.email, 
                u.username, 
                ct.cid_task_id, 
                tc.task_name, 
                ct.status, 
                ct.deadline 
            FROM cid_task ct
            JOIN users u ON ct.assignee_id = u.user_id
            JOIN task_category tc ON ct.task_category_id = tc.task_category_id
            WHERE ct.status IN ('in-progress', 'overdue')
            ORDER BY u.email;
        `;

        const { rows: tasks } = await pool.query(query);

        if (tasks.length === 0) {
            console.log("✅ No pending tasks. No emails sent.");
            return;
        }

        // ✅ Group tasks by user email
        const userTasksMap = {};
        tasks.forEach(task => {
            if (!userTasksMap[task.email]) {
                userTasksMap[task.email] = {
                    username: task.username,
                    tasks: []
                };
            }
            userTasksMap[task.email].tasks.push(task);
        });

        // ✅ Send emails
        await sendEmails(userTasksMap);
    } catch (error) {
        console.error("❌ Error in sendPendingTaskEmails:", error);
    }
};

/**
 * ✅ Send reminder emails to users.
 */
const sendEmails = async (userTasksMap) => {
    // ✅ Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,  // Sender email from environment variables
            pass: process.env.EMAIL_PASS   // App password from environment variables
        }
    });

    for (const [email, user] of Object.entries(userTasksMap)) {
        const taskList = user.tasks.map(task => 
            `- **${task.task_name}** (Status: ${task.status}, Deadline: ${task.deadline.toISOString().split("T")[0]})`
        ).join("\n");

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🔔 Task Reminder: Pending Tasks",
            html: `<p>Hi <strong>${user.username}</strong>,</p>
                   <p>You have the following pending tasks:</p>
                   <ul>${taskList.replace(/-/g, "<li>").replace(/\n/g, "</li>")}</ul>
                   <p>Please complete them as soon as possible.</p>
                   <p>Best regards,<br>CID Task Management System</p>`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`📧 Reminder email sent to: ${email}`);
        } catch (error) {
            console.error(`❌ Failed to send email to ${email}:`, error);
        }
    }
};

// ✅ Schedule this function to run daily at 8 AM Hanoi time
cron.schedule("0 8 * * *", async () => {
    await sendPendingTaskEmails();
}, {
    scheduled: true,
    timezone: "Asia/Ho_Chi_Minh"
});

export default sendPendingTaskEmails;
