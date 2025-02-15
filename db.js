import express from "express";
import {
  getCIDs,
  getCID,
  addCID,
  editCID,
  removeCID
} from "../controllers/cid.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// ✅ Get all CIDs (Admin Only)
router.get("/", authMiddleware, roleMiddleware("view_cids"), getCIDs);

// ✅ Get a specific CID by ID (Admin Only)
router.get("/:id", authMiddleware, roleMiddleware("view_cids"), getCID);

// ✅ Create a new CID (Admin Only)
router.post("/", authMiddleware, roleMiddleware("create_cid"), addCID);

// ✅ Update a CID (Admin Only)
router.put("/:id", authMiddleware, roleMiddleware("update_cid"), editCID);

// ✅ Delete a CID (Admin Only)
router.delete("/:id", authMiddleware, roleMiddleware("delete_cid"), removeCID);

export default router;
