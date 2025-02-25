import {
    requestDeadlineExtension,
    getDeadlineExtensionRequests,
    reviewDeadlineExtension
} from "../models/postpone_reason.model.js";

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
