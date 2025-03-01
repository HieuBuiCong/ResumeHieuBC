import pool from "../config/database.js";
import { sendEmail } from "./emailUtils.js";

/**
 * ✅ Send an email notification with full task details when answers are submitted.
 * @param {number} cidTaskId - The ID of the submitted task.
 */
export const sendAnswerSubmissionNotification = async (cidTaskId) => {
  try {
    // 🔹 1) Fetch Task, CID, and Product Details
    const taskQuery = `
      SELECT 
        ct.cid_task_id, 
        ct.task_category_id, 
        tc.task_name, 
        ct.status, 
        c.cid_id, 
        c.prev_rev, 
        c.next_rev, 
        p.product_id,
        p.part_number, 
        p.part_name,
        ct.task_approver_id
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

    // 🔹 2) Get Submitted Questions & Answers
    const qaQuery = `
      SELECT 
        q.question_name, 
        a.answer
      FROM task_category_question_answer a
      JOIN task_category_question q 
        ON a.task_category_question_id = q.task_category_question_id
      WHERE a.cid_task_id = $1
    `;
    const { rows: qaRows } = await pool.query(qaQuery, [cidTaskId]);

    // 🔹 3) Get Admins' & Approver's Emails
    const userQuery = `
      SELECT email 
      FROM users 
      WHERE role_id = 1 OR user_id = $1
    `;
    const { rows: users } = await pool.query(userQuery, [taskDetails.task_approver_id]);

    const recipients = users.map(user => user.email);
    if (recipients.length === 0) {
      console.error("❌ No recipients found for answer submission notification.");
      return;
    }

    // 🔹 4) Format Email Content
    const answersHtml = qaRows.length
      ? qaRows.map(q => `<p><strong>${q.question_name}:</strong> ${q.answer || "No Answer"}</p>`).join("")
      : "<p>No answers submitted.</p>";

    const subject = `📩 Task #${taskDetails.cid_task_id} - Answers Submitted`;

    const content = `
      <p>Hello,</p>
      <p>The assigned user has submitted answers for <strong>Task #${taskDetails.cid_task_id} - ${taskDetails.task_name}</strong>.</p>

      <h3>🔹 Task Details:</h3>
      <ul>
        <li><strong>Task ID:</strong> ${taskDetails.cid_task_id}</li>
        <li><strong>Task Name:</strong> ${taskDetails.task_name}</li>
        <li><strong>Status:</strong> ${taskDetails.status}</li>
      </ul>

      <h3>🔹 Product Details:</h3>
      <ul>
        <li><strong>Product ID:</strong> ${taskDetails.product_id || "N/A"}</li>
        <li><strong>Part Number:</strong> ${taskDetails.part_number || "N/A"}</li>
        <li><strong>Part Name:</strong> ${taskDetails.part_name || "N/A"}</li>
      </ul>

      <h3>🔹 CID Details:</h3>
      <ul>
        <li><strong>CID ID:</strong> ${taskDetails.cid_id}</li>
        <li><strong>Previous Revision:</strong> ${taskDetails.prev_rev}</li>
        <li><strong>Next Revision:</strong> ${taskDetails.next_rev}</li>
      </ul>

      <h3>🔹 Submitted Answers:</h3>
      ${answersHtml}

      <p>Please review the task in the system.</p>
      <p>Best regards,<br>Your System</p>
    `;

    // 🔹 5) Send Email
    await sendEmail(recipients.join(","), subject, content, true);
    console.log(`📧 Notification sent for Task #${cidTaskId} to:`, recipients);
  } catch (error) {
    console.error("❌ Error sending answer submission email:", error);
  }
};
