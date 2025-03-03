import pool from "../config/database.js";
import { sendEmail } from "./emailService.js";
 
/**
* ✅ Sends an email to admins when a user requests a deadline extension.
* @param {number} cidTaskId - The task ID
* @param {number} userId - The ID of the user requesting the extension
* @param {string} reason - The reason for the extension request
* @param {string} proposedDate - The proposed new deadline
*/
export const sendExtensionRequestNotification = async (cidTaskId, userId, reason, proposedDate) => {
  try {
    // 🔹 1) Fetch Task & User Details
    const taskQuery = `
      SELECT
        ct.cid_task_id,
        ct.task_category_id,
        tc.task_name,
        ct.deadline AS current_deadline,
        c.cid_id,
        c.prev_rev,
        c.next_rev,
        p.part_number,
        p.part_name
      FROM cid_task ct
      JOIN task_category tc ON ct.task_category_id = tc.task_category_id
      JOIN cid c ON ct.cid_id = c.cid_id
      LEFT JOIN product p ON c.product_id = p.product_id
      WHERE ct.cid_task_id = $1
    `;
    const { rows: taskRows } = await pool.query(taskQuery, [cidTaskId]);
 
    if (taskRows.length === 0) {
      console.error(`❌ No task found with ID: ${cidTaskId}`);
      return;
    }
    const taskDetails = taskRows[0];
 
    // 🔹 2) Get Requesting User's Name
    const userQuery = `SELECT username, email FROM users WHERE user_id = $1`;
    const { rows: userRows } = await pool.query(userQuery, [userId]);
 
    if (userRows.length === 0) {
      console.error(`❌ No user found with ID: ${userId}`);
      return;
    }
    const user = userRows[0];
 
    // 🔹 3) Get Admin Emails
    const adminQuery = `SELECT email FROM users WHERE role_id = 1`; // Role 1 = Admin
    const { rows: admins } = await pool.query(adminQuery);
const recipients = admins.map(admin => admin.email);
 
    if (recipients.length === 0) {
      console.error("❌ No admins found to notify.");
      return;
    }
 
    // 🔹 4) Format Email Content
    const subject = `📩 Task #${taskDetails.cid_task_id} - Deadline Extension Requested`;
 
    const content = `
      <p>Hello,</p>
      <p>User <strong>${user.username}</strong> has requested a deadline extension for <strong>Task #${taskDetails.cid_task_id} - ${taskDetails.task_name}</strong>.</p>
 
      <h3>🔹 Task Details:</h3>
      <ul>
        <li><strong>Task ID:</strong> ${taskDetails.cid_task_id}</li>
        <li><strong>Task Name:</strong> ${taskDetails.task_name}</li>
        <li><strong>Current deadline:</strong> ${taskDetails.current_deadline}</li>
      </ul>
 
      <h3>🔹 Product Details:</h3>
      <ul>
        <li><strong>Part Number:</strong> ${taskDetails.part_number || "N/A"}</li>
        <li><strong>Part Name:</strong> ${taskDetails.part_name || "N/A"}</li>
      </ul>
 
      <h3>🔹 CID Details:</h3>
      <ul>
        <li><strong>CID ID:</strong> ${taskDetails.cid_id}</li>
        <li><strong>Previous Revision:</strong> ${taskDetails.prev_rev}</li>
        <li><strong>Next Revision:</strong> ${taskDetails.next_rev}</li>
      </ul>
 
      <h3>🔹 Extension Request Details:</h3>
      <ul>
Requested By: ${user.username} (${user.email})</li>
        <li><strong>Reason:</strong> ${reason}</li>
        <li><strong>Proposed New Deadline:</strong> ${proposedDate}</li>
      </ul>
 
      <p>Please review the request in the system.</p>
      <p>Best regards,<br>Your System</p>
    `;
 
    // 🔹 5) Send Email
    await sendEmail(recipients.join(","), subject, content, true);
    console.log(`📧 Deadline extension request notification sent to:`, recipients);
  } catch (error) {
    console.error("❌ Error sending deadline extension email:", error);
  }
};
