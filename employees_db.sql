CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department(
Id INT NOT NULL AUTO_INCREMENT,
Name VARCHAR(30) NOT NULL,
PRIMARY KEY (Id)
);


CREATE TABLE role (
Id INT NOT NULL AUTO_INCREMENT,
Title VARCHAR(30) NOT NULL,
Salary DECIMAL (10,2),
Department_Id INT,
PRIMARY KEY (Id)
);


CREATE TABLE employee (
Id INT NOT NULL AUTO_INCREMENT,
First_Name VARCHAR(30) NOT NULL,
Last_Name VARCHAR(30) NOT NULL,
Role_Id INT,
Manager_Id INT NULL,
PRIMARY KEY (Id)
);

-- Joining all three tables together to render all employees and info about them for the View All Employees requirement
SELECT employee.id, employee.First_Name, employee.Last_Name, role.title, department.name department, role.salary, concat(employee2.First_Name, " ", employee2.Last_Name) manager
 FROM employee 
 left join employee employee2 on employee.id = employee2.Manager_Id
 left join role on employee.Role_Id = role.id
 left join department on role.Department_Id = department.id Order By employee.id;

-- see employees by department 
 SELECT * FROM department

--  see employees by role
SELECT * FROM role