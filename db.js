import { createCIDTask } from "../models/cid_task.model.js";
import { sendEmail } from "../utils/emailService.js";

// ✅ Admin creates CID task and notifies the assigned user
export const addCIDTask = async (req, res) => {
  try {
    const { task_category_id, cid_id, status_id, user_id, deadline, task_approver_id } = req.body;

    if (!task_category_id || !cid_id || !status_id || !user_id || !deadline) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const task = await createCIDTask(req.body);

    // ✅ Notify the assigned user
    const userEmail = "assigned_user@example.com"; // Fetch dynamically from DB
    await sendEmail(
      userEmail,
      "New Task Assigned",
      `A new task has been assigned to you. Please log in and complete your responses.\nTask ID: ${task.cid_task_id}`
    );

    res.status(201).json({ message: "CID task created successfully and user notified", task });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
