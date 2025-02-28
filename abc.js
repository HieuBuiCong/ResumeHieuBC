-- task_category_question_answer
CREATE TABLE IF NOT EXISTS task_category_question_answer (
  task_category_question_answer_id SERIAL PRIMARY KEY,
  task_category_question_id        INT NOT NULL REFERENCES task_category_question(task_category_question_id),
  cid_task_id                      INT NOT NULL REFERENCES cid_task(cid_task_id),
  answer                           TEXT
);


----------------------------------------------------------------------------

import pool from "../config/database.js"; // Or wherever your pool is

/**
 * Insert blank answers for all questions in a given category
 * when a new cid_task is created, using "pool.query" style.
 */
export const insertBlankAnswersForTask = async (categoryId, cidTaskId) => {
  try {
    // 1) Get all question IDs for this category
    let getQuestionsQuery = `
      SELECT task_category_question_id
      FROM task_category_question
      WHERE task_category_id = $1
    `;
    let values = [categoryId];
    const { rows: questions } = await pool.query(getQuestionsQuery, values);

    // 2) Insert one row per question with answer = NULL
    if (questions.length > 0) {
      let insertAnswersQuery = `
        INSERT INTO task_category_question_answer (task_category_question_id, cid_task_id, answer)
        VALUES ($1, $2, NULL)
      `;
      for (const q of questions) {
        let insertValues = [q.task_category_question_id, cidTaskId];
        await pool.query(insertAnswersQuery, insertValues);
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
};
/**
 * Update the answers in task_category_question_answer based on user’s submission
 * using "pool.query" style.
 * 
 * `answers` is expected to be an array of objects:
 * [ { questionId, answer }, ... ]
 */
export const updateAnswersForTask = async (cidTaskId, answers = []) => {
  try {
    // If no answers provided, do nothing
    if (!Array.isArray(answers) || answers.length === 0) {
      return false;
    }

    let updateQuery = `
      UPDATE task_category_question_answer
      SET answer = $1
      WHERE cid_task_id = $2
        AND task_category_question_id = $3
    `;

    for (const { questionId, answer } of answers) {
      let updateValues = [answer, cidTaskId, questionId];
      await pool.query(updateQuery, updateValues);
    }

    return true;
  } catch (error) {
    throw error;
  }
};
