import {
  getCIDTaskById,
  updateCIDTaskStatus
} from "../models/cid_task.model.js";
import {
  getQuestionsByCategoryId
} from "../models/task_category_question.model.js";
import {
  createTaskCategoryQuestionAnswer
} from "../models/task_category_question_answer.model.js";
import { sendEmail } from "../utils/emailService.js";

// ✅ User or Admin submits answers → Auto updates status to "submitted"
export const submitCIDTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role; // "admin" or "user"
    const { cid_task_id, answers, submit_as_user_id } = req.body;

    let submitterId = userId; // Default: The logged-in user
    if (userRole === "admin" && submit_as_user_id) {
      submitterId = submit_as_user_id; // Admin submits on behalf of a user
    }

    // Fetch CID Task
    const cidTask = await getCIDTaskById(cid_task_id);
    if (!cidTask) return res.status(404).json({ message: "CID Task not found" });

    // Ensure the user is allowed to submit this task
    if (userRole !== "admin" && cidTask.user_id !== userId) {
      return res.status(403).json({ message: "You can only submit your assigned tasks" });
    }

    // Fetch related questions
    const questions = await getQuestionsByCategoryId(cidTask.task_category_id);
    if (questions.length !== answers.length) {
      return res.status(400).json({ message: "All questions must be answered before submission" });
    }

    // Save each answer
    for (const ans of answers) {
      await createTaskCategoryQuestionAnswer({
        task_category_question_id: ans.question_id,
        cid_task_id,
        user_id: submitterId,
        answer: ans.answer
      });
    }

    // ✅ Change status to "submitted"
    await updateCIDTaskStatus(cid_task_id, 2, submitterId); // 2 = Submitted

    // ✅ Send email notification to task approver
    const approverEmail = "admin@example.com"; // Fetch dynamically later
    await sendEmail(
      approverEmail,
      "Task Submitted for Approval",
      `A task (ID: ${cid_task_id}) has been submitted. Please review and approve/reject.`
    );

    res.status(200).json({
      message: `Task submitted successfully by ${userRole === "admin" ? "admin on behalf of user" : "user"}`,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
