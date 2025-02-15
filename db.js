import express from "express";
import {
  getCIDTasks,
  getCIDTask,
  addCIDTask,
  editCIDTask,
  editCIDTaskStatus,
  removeCIDTask
} from "../controllers/cid_task.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Admin Controls
router.get("/", authMiddleware, roleMiddleware("view_tasks"), getCIDTasks);
router.post("/", authMiddleware, roleMiddleware("create_task"), addCIDTask);
router.put("/:id", authMiddleware, roleMiddleware("update_task"), editCIDTask);
router.delete("/:id", authMiddleware, roleMiddleware("delete_task"), removeCIDTask);

// ✅ User can update only status
router.put("/:id/status", authMiddleware, roleMiddleware("update_status"), editCIDTaskStatus);

export default router;
