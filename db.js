import pool from "../config/database.js";

// ✅ Create a new task category question
export const createTaskCategoryQuestion = async (questionName, taskCategoryId) => {
  const query = `
    INSERT INTO task_category_question (question_name, task_category_id) 
    VALUES ($1, $2) RETURNING *`;
  const values = [questionName, taskCategoryId];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

// ✅ Get all task category questions
export const getAllTaskCategoryQuestions = async () => {
  const query = "SELECT * FROM task_category_question ORDER BY task_category_question_id ASC";
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a task category question by ID
export const getTaskCategoryQuestionById = async (taskCategoryQuestionId) => {
  const query = "SELECT * FROM task_category_question WHERE task_category_question_id = $1";
  const { rows } = await pool.query(query, [taskCategoryQuestionId]);
  return rows[0];
};

// ✅ Get questions by task category ID
export const getQuestionsByCategoryId = async (taskCategoryId) => {
  const query = "SELECT * FROM task_category_question WHERE task_category_id = $1";
  const { rows } = await pool.query(query, [taskCategoryId]);
  return rows;
};

// ✅ Update a task category question
export const updateTaskCategoryQuestion = async (taskCategoryQuestionId, updatedFields) => {
  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");
  const values = Object.values(updatedFields);

  const query = `UPDATE task_category_question SET ${fields} WHERE task_category_question_id = $${values.length + 1} RETURNING *`;

  const { rows } = await pool.query(query, [...values, taskCategoryQuestionId]);
  return rows[0];
};

// ✅ Delete a task category question
export const deleteTaskCategoryQuestion = async (taskCategoryQuestionId) => {
  const query = "DELETE FROM task_category_question WHERE task_category_question_id = $1 RETURNING *";
  const { rows } = await pool.query(query, [taskCategoryQuestionId]);
  return rows[0];
};
