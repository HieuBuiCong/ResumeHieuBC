import {
  getCIDTaskById,
  updateCIDTaskStatus
} from "../models/cid_task.model.js";
import {
  getQuestionsByCategoryId
} from "../models/task_category_question.model.js";
import {
  createTaskCategoryQuestionAnswer,
  getAnswersByCIDTask
} from "../models/task_category_question_answer.model.js";
import { sendEmail } from "../utils/emailService.js";

// ✅ User submits answers → Auto updates status to "submitted"
export const submitCIDTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cid_task_id, answers } = req.body;

    // Fetch CID Task
    const cidTask = await getCIDTaskById(cid_task_id);
    if (!cidTask) return res.status(404).json({ message: "CID Task not found" });

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
        user_id: userId,
        answer: ans.answer
      });
    }

    // ✅ Change status to "submitted"
    await updateCIDTaskStatus(cid_task_id, 2, userId); // 2 = Submitted

    // ✅ Send email notification to admin/approver
    const approverEmail = "admin@example.com"; // Fetch this dynamically later
    await sendEmail(
      approverEmail,
      "Task Submitted for Approval",
      `A user has submitted answers for task ID ${cid_task_id}. Please review and approve/reject.`
    );

    res.status(200).json({ message: "Answers submitted successfully. Status updated to submitted." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
