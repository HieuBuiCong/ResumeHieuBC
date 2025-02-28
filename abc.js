-- task_category_question_answer
CREATE TABLE IF NOT EXISTS task_category_question_answer (
  task_category_question_answer_id SERIAL PRIMARY KEY,
  task_category_question_id        INT NOT NULL REFERENCES task_category_question(task_category_question_id),
  cid_task_id                      INT NOT NULL REFERENCES cid_task(cid_task_id),
  answer                           TEXT
);


----------------------------------------------------------------------------

import pool from "../db.js"; // or wherever your PG pool is

/**
 * Insert blank answers for all questions in a given category
 * when a new cid_task is created.
 */
export const insertBlankAnswersForTask = async (categoryId, cidTaskId) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) Get all question IDs for this category
    const getQuestionsQuery = `
      SELECT task_category_question_id
      FROM task_category_question
      WHERE task_category_id = $1
    `;
    const { rows: questions } = await client.query(getQuestionsQuery, [categoryId]);

    // 2) Insert one row per question with answer = NULL
    if (questions.length > 0) {
      const insertAnswersQuery = `
        INSERT INTO task_category_question_answer (task_category_question_id, cid_task_id, answer)
        VALUES ($1, $2, NULL)
      `;
      for (const q of questions) {
        await client.query(insertAnswersQuery, [q.task_category_question_id, cidTaskId]);
      }
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Update the answers in task_category_question_answer based on user’s submission.
 * `answers` is expected to be an array of objects: [ { questionId, answer }, ... ]
 */
export const updateAnswersForTask = async (cidTaskId, answers = []) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const updateQuery = `
      UPDATE task_category_question_answer
      SET answer = $1
      WHERE cid_task_id = $2
        AND task_category_question_id = $3
    `;

    for (const { questionId, answer } of answers) {
      await client.query(updateQuery, [answer, cidTaskId, questionId]);
    }

    await client.query("COMMIT");
    return true;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
--------------------------------------------
import {
  createCIDTask,
  // ...
} from "../models/cid_task.model.js";

import {
  insertBlankAnswersForTask,
  // Possibly import updateAnswersForTask if you want to do it here
} from "../models/taskCategoryQuestionAnswer.model.js";

export const createTask = async (req, res) => {
  try {
    const taskData = req.body;
    // 1) Create the cid_task row
    const newTask = await createCIDTask(taskData);

    // newTask should include newTask.cid_task_id and newTask.task_category_id
    // Insert blank answers for each question in that category
    await insertBlankAnswersForTask(
      newTask.task_category_id,
      newTask.cid_task_id
    );

    return res
      .status(201)
      .json({
        success: true,
        message: "Task created successfully",
        data: newTask
      });
  } catch (error) {
    return res
      .status(400)
      .json({
        success: false,
        message: error.message
      });
  }
};
----------------------------------
import { updateAnswersForTask } from "../models/taskCategoryQuestionAnswer.model.js";
// ... other imports

export const submitTask = async (req, res) => {
  try {
    const { id } = req.params;  // This is the cid_task_id
    const userId = req.user.id; // Logged-in user ID
    const userRoleId = parseInt(req.user.role, 10); // user role

    const { answers } = req.body; 
    // Expecting 'answers' as an array of objects like:
    // [ { questionId: 1, answer: "Lorem ipsum" }, { questionId: 2, answer: "..." } ]

    const task = await getCIDTaskById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // 🚨 Ensure this user is the assignee or an Admin
    if (userRoleId !== 1 && task.assignee_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only the assigned user can submit this task."
      });
    }

    // 1) Update the answers (if any were provided)
    if (Array.isArray(answers) && answers.length > 0) {
      await updateAnswersForTask(id, answers);
    }

    // 2) Mark the task as "submitted"
    const updatedTask = await updateTaskStatusLogic(id, "submitted");

    return res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
