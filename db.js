-- 🚀 Create task_category table
CREATE TABLE task_category (
    task_category_id SERIAL PRIMARY KEY,
    task_name VARCHAR(255) NOT NULL UNIQUE
);

-- 🚀 Create task_category_question table
CREATE TABLE task_category_question (
    task_category_question_id SERIAL PRIMARY KEY,
    question_name TEXT NOT NULL UNIQUE,
    task_category_id INT NOT NULL,
    FOREIGN KEY (task_category_id) REFERENCES task_category(task_category_id) ON DELETE CASCADE
);
