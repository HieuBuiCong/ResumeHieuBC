CREATE TABLE task_category_question_answer (
    task_category_question_answer_id SERIAL PRIMARY KEY,
    task_category_question_id INT NOT NULL,
    cid_task_id INT NOT NULL,
    user_id INT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY (task_category_question_id) REFERENCES task_category_question(task_category_question_id) ON DELETE CASCADE,
    FOREIGN KEY (cid_task_id) REFERENCES cid_task(cid_task_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
