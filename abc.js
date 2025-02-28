/**
 * ✅ Get all questions for a given task category
 */
export const getQuestionsByCategory = async (categoryId) => {
  const query = `
    SELECT task_category_question_id
    FROM task_category_question
    WHERE task_category_id = $1
  `;
  const { rows } = await pool.query(query, [categoryId]);
  return rows; // Returns an array of questions
};

-------------------------------------------------
/**
 * ✅ Submit Task (Users must provide answers only if there are questions)
 */
export const submitTask = async (req, res) => {
  try {
    const { id } = req.params; // `cid_task_id`
    const userId = req.user.id; // Logged-in user ID
    const userRoleId = parseInt(req.user.role, 10); // User role

    const { answers } = req.body; 
    // Expecting `answers` as an array of objects:
    // [ { questionId: 1, answer: "Lorem ipsum" }, { questionId: 2, answer: "..." } ]

    const task = await getCIDTaskById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // 🚨 Ensure this user is the assignee or an Admin
    if (userRoleId !== 1 && task.assignee_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only the assigned user can submit this task.",
      });
    }

    // ✅ Get the number of questions for this task category
    const questions = await getQuestionsByCategory(task.task_category_id);

    // 🚨 If the category has questions, require answers; otherwise, allow empty answers
    if (questions.length > 0) {
      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
          success: false,
          message: "You must provide answers before submitting the task.",
        });
      }
      // 1) Update the answers
      await updateAnswersForTask(id, answers);
    }

    // 2) Mark the task as "submitted"
    const updatedTask = await updateTaskStatusLogic(id, "submitted");

    res.status(200).json({
      success: true,
      message: "Task submitted successfully",
      data: updatedTask,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
