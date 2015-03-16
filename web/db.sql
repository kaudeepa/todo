create database todos;
CREATE USER 'todos_user'@'localhost' IDENTIFIED BY 'todos_password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP ON todos.* TO 'todos_user'@'localhost’;

create database todos;
CREATE TABLE todos_table(
user_id INT NOT NULL AUTO_INCREMENT,
PRIMARY KEY(user_id),
todo_items TEXT);
