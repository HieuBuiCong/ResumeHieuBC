// ✅ Get Answers for a Task by Task ID
export const getAnswersByTaskId = async (cid_task_id) => {
  const query = `
    SELECT a.task_category_question_id, a.answer, q.question_name
    FROM task_category_question_answer a
    JOIN task_category_question q ON a.task_category_question_id = q.task_category_question_id
    WHERE a.cid_task_id = $1
  `;
  const { rows } = await pool.query(query, [cid_task_id]);
  return rows;
};

// ✅ Update Answers for a Task
export const updateAnswers = async (cid_task_id, answers) => {
  const updateQuery = `
    UPDATE task_category_question_answer
    SET answer = $1
    WHERE cid_task_id = $2 AND task_category_question_id = $3
  `;

  for (const { task_category_question_id, answer } of answers) {
    await pool.query(updateQuery, [answer, cid_task_id, task_category_question_id]);
  }

  return true;
};


// controllers/answer.controller.js
import { getAnswersByTaskId, updateAnswers } from "../models/answer.model.js";

// ✅ Get Answers by Task ID
export const getAnswers = async (req, res) => {
  try {
    const { task_id } = req.params;
    const answers = await getAnswersByTaskId(task_id);
    res.status(200).json({ success: true, data: answers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Answers
export const saveAnswers = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Invalid answer data." });
    }

    await updateAnswers(task_id, answers);
    res.status(200).json({ success: true, message: "Answers updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// routes/answer.routes.js
import express from "express";
import { getAnswers, saveAnswers } from "../controllers/answer.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Get answers by Task ID
router.get("/:task_id", authMiddleware, getAnswers);

// ✅ Update answers for a specific Task
router.put("/:task_id", authMiddleware, saveAnswers);

export default router;
