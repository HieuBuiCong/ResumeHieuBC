import {
  getAllCIDTasks,
  getCIDTasksByUser
} from "../models/cid_task.model.js";

// ✅ Get all CID tasks (Users can see all, but can only submit their assigned tasks)
export const getCIDTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // Assuming "admin" or "user"

    let tasks;
    if (userRole === "admin") {
      tasks = await getAllCIDTasks(); // Admins see all tasks
    } else {
      tasks = await getCIDTasksByUser(userId); // Users see only their assigned tasks
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
