📌 Explanation of Relationships
Users & Roles (users.role_id → role.role_id)

Each user has one role (admin or user).
When a role is deleted, its users are also deleted (CASCADE).
Users & Departments (users.department_id → department.department_id)

Users belong to a department.
If a department is deleted, its users are set to NULL (SET NULL).
Products & CID (cid.product_id → product.product_id)

Each cid is associated with a product.
If a product is deleted, its cid entries are also deleted (CASCADE).
CID & Tasks (cid_task.cid_id → cid.cid_id)

Each task belongs to a CID.
If a cid is deleted, related tasks are also deleted (CASCADE).
Task Categories & Tasks (cid_task.task_category_id → task_category.task_category_id)

Tasks are categorized.
If a task category is deleted, related tasks are also deleted (CASCADE).
Users & Task Approvers (task_approver.user_id → users.user_id)

Users can be task approvers.
If a user is deleted, their approvals are deleted (CASCADE).
Task Approvers & Status (task_approver.status_id → status.status_id)

Each approval has a status.
If a status is deleted, its tasks are set to NULL (SET NULL).
Task Questions & Answers (task_category_question_answer.question_id → task_category_question.question_id)

Each question has multiple answers.
If a question is deleted, all answers are also deleted (CASCADE).
