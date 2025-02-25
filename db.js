/**
 * ✅ Get all extension requests for a specific user.
 * - Users can **only see their own** extension requests.
 * - Returns the task name, CID, current status, and the approver’s decision (if available).
 */
export const getUserExtensionRequests = async (userId) => {
    try {
        const query = `
            SELECT 
                pr.postpone_reason_id, 
                pr.cid_task_id, 
                pr.reason, 
                pr.proposed_date, 
                pr.status, 
                pr.created_at, 
                pr.approver_reason, 
                pr.reviewed_at, 
                t.task_name, 
                c.cid_id 
            FROM postpone_reason pr
            JOIN cid_task t ON pr.cid_task_id = t.cid_task_id
            JOIN cid c ON t.cid_id = c.cid_id
            WHERE pr.user_id = $1
            ORDER BY pr.created_at DESC;
        `;
        const { rows } = await pool.query(query, [userId]);
        return rows;
    } catch (error) {
        console.error("❌ Error in getUserExtensionRequests:", error);
        throw error;
    }
};
------------------------------------------------------------------------------------------
import { getUserExtensionRequests } from "../models/postpone_reason.model.js";

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
-------------------------------------------------------
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { getUserExtensions } from "../controllers/cid_task.controller.js";

const router = express.Router();

// ✅ User can see their own deadline extension requests
router.get("/extensions/mine", authMiddleware, getUserExtensions);

export default router;
