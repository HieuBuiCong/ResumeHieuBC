import {
  createTaskCategoryQuestion,
  getAllTaskCategoryQuestions,
  getTaskCategoryQuestionById,
  getQuestionsByCategoryId,
  updateTaskCategoryQuestion,
  deleteTaskCategoryQuestion
} from "../models/task_category_question.model.js";

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
    if (!question) return res.status(404).json({ message: "Question not found" });

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get all questions by task category ID
export const getQuestionsByCategory = async (req, res) => {
  try {
    const questions = await getQuestionsByCategoryId(req.params.categoryId);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Create a new task category question
export const addTaskCategoryQuestion = async (req, res) => {
  try {
    const { question_name, task_category_id } = req.body;
    
    if (!question_name || !task_category_id) {
      return res.status(400).json({ message: "Question name and task category ID are required" });
    }

    const question = await createTaskCategoryQuestion(question_name, task_category_id);
    res.status(201).json({ message: "Question created successfully", question });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update a task category question
export const editTaskCategoryQuestion = async (req, res) => {
  try {
    const updatedQuestion = await updateTaskCategoryQuestion(req.params.id, req.body);
    if (!updatedQuestion) return res.status(404).json({ message: "Question not found" });

    res.status(200).json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Delete a task category question
export const removeTaskCategoryQuestion = async (req, res) => {
  try {
    const deletedQuestion = await deleteTaskCategoryQuestion(req.params.id);
    if (!deletedQuestion) return res.status(404).json({ message: "Question not found" });

    res.status(200).json({ message: "Question deleted successfully", deletedQuestion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
