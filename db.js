-- 🚀 Insert default roles
INSERT INTO role (role_name) VALUES ('admin'), ('user');

-- 🚀 Insert default departments
INSERT INTO department (department_name) VALUES ('IT'), ('Finance'), ('HR');

-- 🚀 Insert an admin user (Change password after first login)
INSERT INTO users (username, password, role_id, department_id, email, leader_email)
VALUES ('admin', '$2a$10$EXAMPLEHASHEDPASSWORD', 1, 1, 'admin@example.com', 'admin@example.com');

-- 🚀 Insert some sample products
INSERT INTO product (product_name) VALUES ('Product A'), ('Product B');

-- 🚀 Insert sample statuses
INSERT INTO status (status_name) VALUES ('Pending'), ('Approved'), ('Rejected');
