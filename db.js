import express from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  submitTask,
  approveOrRejectTask,
  getTasksByUser,
  getTasksByCID
} from "../controllers/cid_task.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Admin Routes (Only Admins can create, update, delete, approve tasks)
router.post("/", authMiddleware, roleMiddleware("create_task"), createTask); // Create Task ✅
router.put("/:id", authMiddleware, roleMiddleware("update_task"), updateTask); // Update Task
router.delete("/:id", authMiddleware, roleMiddleware("delete_task"), deleteTask); // Delete Task
router.put("/:id/approve", authMiddleware, roleMiddleware("approve_task"), approveOrRejectTask); // Approve/Reject Task ✅

// ✅ Public Routes (Users & Admins can see tasks)
router.get("/", authMiddleware, getAllTasks); // Get All Tasks ✅
router.get("/:id", authMiddleware, getTaskById); // Get Task by ID ✅

// ✅ User Route (Users can only submit their own assigned tasks; Admins can submit for anyone)
router.put("/:id/submit", authMiddleware, roleMiddleware("update_status"), submitTask);

// ✅ Get Tasks by User or CID
router.get("/user/:userId", authMiddleware, getTasksByUser); // Get Tasks Assigned to a Specific User ✅
router.get("/cid/:cid_id", authMiddleware, getTasksByCID); // Get All Tasks for a Specific CID ✅

export default router;
