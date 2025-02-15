import pool from "../config/database.js";

// ✅ Create a task category question answer
export const createTaskCategoryQuestionAnswer = async (answerData) => {
  const query = `
    INSERT INTO task_category_question_answer (task_category_question_id, cid_task_id, user_id, answer)
    VALUES ($1, $2, $3, $4) RETURNING *`;
  const values = [
    answerData.task_category_question_id,
    answerData.cid_task_id,
    answerData.user_id,
    answerData.answer
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all answers by CID Task ID
export const getAnswersByCIDTask = async (cidTaskId) => {
  const query = "SELECT * FROM task_category_question_answer WHERE cid_task_id = $1";
  const { rows } = await pool.query(query, [cidTaskId]);
  return rows;
};
