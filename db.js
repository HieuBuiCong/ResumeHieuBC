import express from "express";
import {
  submitCIDTask,
  reviewCIDTask
} from "../controllers/cid_task.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ User submits answers (Auto-status update)
router.post("/submit", authMiddleware, roleMiddleware("update_status"), submitCIDTask);

// ✅ Admin approves/rejects task
router.post("/review", authMiddleware, roleMiddleware("approve_task"), reviewCIDTask);

export default router;
