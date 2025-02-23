import express from "express";
import {
  getCIDs,
  getCID,
  addCID,
  editCID,
  removeCID,
  sendSpecificCIDSummaryEmail,
} from "../controllers/cid.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Get all CIDs 
router.get("/", authMiddleware, getCIDs);

// ✅ Get a specific CID by ID
router.get("/:id", authMiddleware, getCID);

// ✅ Create a new CID (Admin Only)
router.post("/", authMiddleware, roleMiddleware("create_cid"), addCID);

// ✅ Update a CID (Admin Only)
router.put("/:id", authMiddleware, roleMiddleware("update_cid"), editCID);

// ✅ Delete a CID (Admin Only)
router.delete("/:id", authMiddleware, roleMiddleware("delete_cid"), removeCID);


// ✅ Admin triggers the email summary for all CIDs
router.post("/send-summary", authMiddleware, roleMiddleware("send_summary"), sendSpecificCIDSummaryEmail);


export default router;
