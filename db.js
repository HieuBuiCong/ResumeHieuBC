import pool from "../config/database.js";

// ✅ Helper function: Get task_category_id from task_name
const getTaskCategoryIdFromTaskName = async (taskName) => {
  const query = `SELECT task_category_id FROM task_category WHERE task_name = $1`;
  const { rows } = await pool.query(query, [taskName]);
  return rows[0]?.task_category_id;
};

// ✅ Create a new task category question using task_name
export const createTaskCategoryQuestion = async (questionName, taskName) => {
  const taskCategoryId = await getTaskCategoryIdFromTaskName(taskName);

  if (!taskCategoryId) {
    throw new Error(`Task category with name "${taskName}" not found.`);
  }

  const query = `
    INSERT INTO task_category_question (question_name, task_category_id) 
    VALUES ($1, $2) RETURNING *`;
    
  const values = [questionName, taskCategoryId];
  const { rows } = await pool.query(query, values);

  return rows[0];
};

// ✅ Get all task category questions (with task_name included)
export const getAllTaskCategoryQuestions = async () => {
  const query = `
    SELECT q.*, c.task_name 
    FROM task_category_question q
    JOIN task_category c ON q.task_category_id = c.task_category_id
    ORDER BY q.task_category_question_id ASC`;
    
  const { rows } = await pool.query(query);
  return rows;
};

// ✅ Get a task category question by ID (includes task_name)
export const getTaskCategoryQuestionById = async (taskCategoryQuestionId) => {
  const query = `
    SELECT q.*, c.task_name 
    FROM task_category_question q
    JOIN task_category c ON q.task_category_id = c.task_category_id
    WHERE q.task_category_question_id = $1`;
    
  const { rows } = await pool.query(query, [taskCategoryQuestionId]);
  return rows[0];
};

// ✅ Get questions by task_name instead of task_category_id
export const getQuestionsByTaskName = async (taskName) => {
  const taskCategoryId = await getTaskCategoryIdFromTaskName(taskName);

  if (!taskCategoryId) {
    throw new Error(`Task category with name "${taskName}" not found.`);
  }

  const query = `
    SELECT * FROM task_category_question 
    WHERE task_category_id = $1`;
    
  const { rows } = await pool.query(query, [taskCategoryId]);
  return rows;
};

// ✅ Update a task category question (task_name can be updated too)
export const updateTaskCategoryQuestion = async (taskCategoryQuestionId, updatedFields) => {
  if (updatedFields.task_name) {
    const taskCategoryId = await getTaskCategoryIdFromTaskName(updatedFields.task_name);
    
    if (!taskCategoryId) {
      throw new Error(`Task category with name "${updatedFields.task_name}" not found.`);
    }

    updatedFields.task_category_id = taskCategoryId;
    delete updatedFields.task_name; // Remove to avoid column conflict
  }

  const fields = Object.keys(updatedFields)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const values = Object.values(updatedFields);

  const query = `
    UPDATE task_category_question SET ${fields} 
    WHERE task_category_question_id = $${values.length + 1} 
    RETURNING *`;

  const { rows } = await pool.query(query, [...values, taskCategoryQuestionId]);

  return rows[0];
};

// ✅ Delete a task category question
export const deleteTaskCategoryQuestion = async (taskCategoryQuestionId) => {
  const query = `
    DELETE FROM task_category_question 
    WHERE task_category_question_id = $1 
    RETURNING *`;
    
  const { rows } = await pool.query(query, [taskCategoryQuestionId]);
  return rows[0];
};
-----------------------
import {
  createTaskCategoryQuestion,
  getAllTaskCategoryQuestions,
  getTaskCategoryQuestionById,
  getQuestionsByTaskName,
  updateTaskCategoryQuestion,
  deleteTaskCategoryQuestion,
} from "../models/taskCategoryQuestion.model.js";

// ✅ Create a new task category question (using task_name)
export const addTaskCategoryQuestion = async (req, res) => {
  try {
    const { question_name, task_name } = req.body;

    if (!question_name || !task_name) {
      return res.status(400).json({
        message: "Question name and task name are required.",
      });
    }

    const newQuestion = await createTaskCategoryQuestion(question_name, task_name);

    res.status(201).json({
      message: "Question created successfully.",
      question: newQuestion,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Get all task category questions
export const getTaskCategoryQuestions = async (req, res) => {
  try {
    const questions = await getAllTaskCategoryQuestions();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get a task category question by ID
export const getTaskCategoryQuestion = async (req, res) => {
  try {
    const question = await getTaskCategoryQuestionById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get questions by task name
export const getQuestionsByTask = async (req, res) => {
  try {
    const { task_name } = req.params;

    const questions = await getQuestionsByTaskName(task_name);
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Update a task category question (using task_name optionally)
export const editTaskCategoryQuestion = async (req, res) => {
  try {
    const updatedQuestion = await updateTaskCategoryQuestion(req.params.id, req.body);

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json({
      message: "Question updated successfully.",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// ✅ Delete a task category question
export const removeTaskCategoryQuestion = async (req, res) => {
  try {
    const deletedQuestion = await deleteTaskCategoryQuestion(req.params.id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found." });
    }

    res.status(200).json({
      message: "Question deleted successfully.",
      question: deletedQuestion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
-----------------------
