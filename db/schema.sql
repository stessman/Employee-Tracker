DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department (
    department_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (department_id)
);

CREATE TABLE role (
    role_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary decimal,
    department_id INT NULL,
    CONSTRAINT fk_department
    FOREIGN KEY (department_id)
    REFERENCES department(department_id),
    PRIMARY KEY (role_id)
);

CREATE TABLE employee (
    employee_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    CONSTRAINT fk_role
    FOREIGN KEY (role_id)
    REFERENCES role(role_id),
    manager_id INT,
    CONSTRAINT fk_manager
    FOREIGN KEY (manager_id)
    REFERENCES employee(employee_id)
    ON UPDATE CASCADE,
    PRIMARY KEY (employee_id)
);
