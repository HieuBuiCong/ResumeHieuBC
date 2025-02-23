import express from "express";
import {
  getCIDs,
  getCID,
  addCID,
  editCID,
  removeCID,
  sendSpecificCIDSummaryEmail,
  triggerOverdueCheck, // Optional: Only if manually triggering overdue checks
} from "../controllers/cid.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Get all CIDs
router.get("/", authMiddleware, getCIDs);

// ✅ Get a specific CID by ID
router.get("/:id", authMiddleware, getCID);

// ✅ Create a new CID (using part_number from frontend)
router.post("/", authMiddleware, roleMiddleware("create_cid"), addCID);

// ✅ Update a CID (using part_number if provided)
router.put("/:id", authMiddleware, roleMiddleware("update_cid"), editCID);

// ✅ Delete a CID
router.delete("/:id", authMiddleware, roleMiddleware("delete_cid"), removeCID);

// ✅ Send CID summary email (admin only)
router.post("/send-summary", authMiddleware, roleMiddleware("send_summary"), sendSpecificCIDSummaryEmail);

// ✅ (Optional) Manually trigger overdue checks 
router.post("/check-overdue", authMiddleware, roleMiddleware("manage_cid"), triggerOverdueCheck);

export default router;
