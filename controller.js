import {
  createCIDTask,
  getAllCIDTasks,
  getCIDTaskById,
  updateCIDTask,
  deleteCIDTask,
  getCIDTasksByUser,
  getCIDTasksByCID,
} from "../models/cid_task.model.js";

import { updateTaskStatusLogic } from "../utils/taskStatusUtils.js"; // ✅ Import utility function

import {
  requestDeadlineExtension,
  getDeadlineExtensionRequests,
  reviewDeadlineExtension,
  getUserExtensionRequests
} from "../models/postpone_reason.model.js";

// ✅ Create a new CID task (Admin Only)
export const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = await createCIDTask(taskData);
    res.status(201).json({ success: true, message: "Task created successfully", data: newTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get all CID tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await getAllCIDTasks();
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving tasks", error: error.message });
  }
};

// ✅ Get a CID task by ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await getCIDTaskById(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving task", error: error.message });
  }
};

// ✅ Update a CID task (Admin Only)
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedTask = await updateCIDTask(id, updatedFields);

    if (!updatedTask) return res.status(404).json({ success: false, message: "Task not found" });

    // ✅ Call utility function to apply business logic
    const finalUpdatedTask = await updateTaskStatusLogic(id);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: finalUpdatedTask,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Delete a CID task (Admin Only)
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await deleteCIDTask(id);
    if (!deletedTask) return res.status(404).json({ success: false, message: "Task not found" });
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting task", error: error.message });
  }
};

// ✅ Submit Task (Users can only submit their assigned tasks)
export const submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Get logged-in user ID
    const userRoleId = parseInt(req.user.role, 10); // Get user role

    const task = await getCIDTaskById(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // 🚨 Check if the user is the assignee or an Admin
    if (userRoleId !== 1 && task.assignee_id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized. Only the assigned user can submit this task." });
    }

    // ✅ Use utility function to update the task status
    const updatedTask = await updateTaskStatusLogic(id, "submitted");

    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      data: updatedTask,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Approve or Reject Task (Admin Only)
export const approveOrRejectTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body;
    const approverId = req.user.id; // Get logged-in admin ID

    const newStatus = decision === "reject" ? "in-progress" : decision === "approve" ? "complete" : "cancel";

    // ✅ Fetch the task to check if it exists
    const task = await getCIDTaskById(id);
    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    // ✅ Use utility function to update the task status
    const updatedTask = await updateTaskStatusLogic(id, newStatus, approverId);

    res.status(200).json({
      success: true,
      message: "Task approved/rejected successfully",
      data: updatedTask,
    });

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Get tasks assigned to a specific user
export const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await getCIDTasksByUser(userId);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving tasks", error: error.message });
  }
};

// ✅ Get tasks for a specific CID
export const getTasksByCID = async (req, res) => {
  try {
    const { cid_id } = req.params;
    const tasks = await getCIDTasksByCID(cid_id);
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving tasks", error: error.message });
  }
};

//------------------------------------------------------------------------------------------------
// ✅ User requests a deadline extension
export const requestExtension = async (req, res) => {
  try {
      const { id } = req.params; // Task ID
      const userId = req.user.id; // User making request
      const { reason, proposedDate } = req.body;

      if (!reason || !proposedDate) {
          return res.status(400).json({ success: false, message: "Reason and proposed date are required." });
      }

      const extensionRequest = await requestDeadlineExtension(id, userId, reason, proposedDate);
      res.status(201).json({ success: true, message: "Deadline extension requested successfully", data: extensionRequest });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get all extension requests (for approvers)
export const getExtensions = async (req, res) => {
  try {
      const extensions = await getDeadlineExtensionRequests();
      res.status(200).json({ success: true, data: extensions });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Approver reviews the request (Approve/Reject)
export const reviewExtension = async (req, res) => {
  try {
      const { id } = req.params; // Postpone Reason ID
      const approverId = req.user.id; // Approver's ID
      const { decision, approverReason } = req.body;

      if (!["approved", "rejected"].includes(decision)) {
          return res.status(400).json({ success: false, message: "Decision must be 'approved' or 'rejected'." });
      }

      const reviewedRequest = await reviewDeadlineExtension(id, approverId, decision, approverReason);
      res.status(200).json({ success: true, message: `Request ${decision}`, data: reviewedRequest });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ Get all extension requests for the logged-in user.
 * - Users can **only see their own** extension requests.
 */
export const getUserExtensions = async (req, res) => {
  try {
      const userId = req.user.id; // Get logged-in user ID

      const extensions = await getUserExtensionRequests(userId);

      res.status(200).json({ success: true, data: extensions });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};
