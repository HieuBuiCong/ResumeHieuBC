// ✅ Update only the status (User Permission by answering question) - ✅ Includes submitted_date update
export const updateCIDTaskStatus = async (cidTaskId, newStatus) => {
  const query = `
    UPDATE cid_task 
    SET status = $1, submitted_date = CURRENT_TIMESTAMP
    WHERE cid_task_id = $2
    RETURNING *`;

  const { rows } = await pool.query(query, [newStatus, cidTaskId]);
  return rows[0];
};
------------------------------
import pool from "../config/database.js"; // Import your database connection

/**
 * Insert blank answers for all questions in a given category
 * when a new cid_task is created.
 */
export const insertBlankAnswersForTask = async (categoryId, cidTaskId) => {
  // Get all question IDs for the given category
  const getQuestionsQuery = `
    SELECT task_category_question_id
    FROM task_category_question
    WHERE task_category_id = $1
  `;
  const { rows: questions } = await pool.query(getQuestionsQuery, [categoryId]);

  // Insert one row per question with answer = NULL
  if (questions.length > 0) {
    const insertAnswersQuery = `
      INSERT INTO task_category_question_answer (task_category_question_id, cid_task_id, answer)
      VALUES ($1, $2, NULL)
    `;
    for (const q of questions) {
      await pool.query(insertAnswersQuery, [q.task_category_question_id, cidTaskId]);
    }
  }

  return true; // Return true after successful execution
};

/**
 * Update the answers in task_category_question_answer based on user’s submission.
 * `answers` is expected to be an array of objects: [ { questionId, answer }, ... ]
 */
export const updateAnswersForTask = async (cidTaskId, answers) => {
  if (!Array.isArray(answers) || answers.length === 0) {
    return false; // If no answers provided, do nothing
  }

  const updateQuery = `
    UPDATE task_category_question_answer
    SET answer = $1
    WHERE cid_task_id = $2
      AND task_category_question_id = $3
  `;

  for (const { questionId, answer } of answers) {
    await pool.query(updateQuery, [answer, cidTaskId, questionId]);
  }

  return true; // Return true after successful execution
};
