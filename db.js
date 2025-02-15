import express from "express";
import { sendCIDSummaryEmail } from "../controllers/cid.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Admin triggers the email summary for all CIDs
router.post("/send-summary", authMiddleware, roleMiddleware("send_summary"), sendCIDSummaryEmail);

export default router;
