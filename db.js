-- 🚀 Create the "role" table
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- 🚀 Create the "department" table
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE
);

-- 🚀 Create the "users" table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role_id INT NOT NULL,
    department_id INT NOT NULL,
    profile_picture VARCHAR(255),
    email VARCHAR(100) NOT NULL UNIQUE,
    leader_email VARCHAR(100) NOT NULL,
    FOREIGN KEY (role_id) REFERENCES role(role_id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES department(department_id) ON DELETE SET NULL
);

-- 🚀 Create the "product" table
CREATE TABLE product (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL UNIQUE
);

-- 🚀 Create the "cid" table
CREATE TABLE cid (
    cid_id SERIAL PRIMARY KEY,
    cid_name VARCHAR(255) NOT NULL UNIQUE,
    product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);

-- 🚀 Create the "task_category" table
CREATE TABLE task_category (
    task_category_id SERIAL PRIMARY KEY,
    task_category_name VARCHAR(255) NOT NULL UNIQUE
);

-- 🚀 Create the "cid_task" table
CREATE TABLE cid_task (
    cid_task_id SERIAL PRIMARY KEY,
    cid_id INT NOT NULL,
    task_category_id INT NOT NULL,
    FOREIGN KEY (cid_id) REFERENCES cid(cid_id) ON DELETE CASCADE,
    FOREIGN KEY (task_category_id) REFERENCES task_category(task_category_id) ON DELETE CASCADE
);

-- 🚀 Create the "status" table
CREATE TABLE status (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(255) NOT NULL UNIQUE
);

-- 🚀 Create the "task_approver" table
CREATE TABLE task_approver (
    task_approver_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    cid_task_id INT NOT NULL,
    status_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cid_task_id) REFERENCES cid_task(cid_task_id) ON DELETE CASCADE,
    FOREIGN KEY (status_id) REFERENCES status(status_id) ON DELETE SET NULL
);

-- 🚀 Create the "task_category_question" table
CREATE TABLE task_category_question (
    question_id SERIAL PRIMARY KEY,
    task_category_id INT NOT NULL,
    question_text TEXT NOT NULL,
    FOREIGN KEY (task_category_id) REFERENCES task_category(task_category_id) ON DELETE CASCADE
);

-- 🚀 Create the "task_category_question_answer" table
CREATE TABLE task_category_question_answer (
    answer_id SERIAL PRIMARY KEY,
    question_id INT NOT NULL,
    user_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES task_category_question(question_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
