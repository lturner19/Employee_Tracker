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


-- Data taken from the homework gif 
INSERT INTO department(name)
VALUES("Sales"),("Engineering"),("Finance"),("Legal");

INSERT INTO role (Title, Salary, Department_Id)
VALUES ("Sales Lead", 150000.00, 1), ("Salesperson", 130000.00, 1), ("Lead Engineer", 200000.00, 2),("Software Engineer", 185000.00, 2), ("Accountant", 85000.00, 3), ("Legal Team Lead", 250000.00, 4), ("Lawyer", 210000.00, 4);

INSERT INTO employee (First_Name, Last_Name, Role_Id, Manager_Id)
VALUES("John", "Doe", 1, 3), ("Mike", "Chan", 2, 1), ("Ashely", "Rodriquez", 3, null), ("Kevin", "Tupik", 3, 4), ("Malia", "Brown", 5, null), ("Sarah", "Lourd", 6, null), ("Tom", "Allen", 7, 7), ("Christian", "Eckenrode", 3, 2);


-- Joining all three tables together to render all employees and info about them for the View All Employees requirement
SELECT employee.id, employee.First_Name, employee.Last_Name, role.title, department.name department, role.salary, concat(employee2.First_Name, " ", employee2.Last_Name) manager
 FROM employee 
 left join employee employee2 on employee.id = employee2.Manager_Id
 left join role on employee.Role_Id = role.id
 left join department on role.Department_Id = department.id Order By employee.id;

-- see employees by department 
 SELECT * FROM department

--  see employees by role
SELECT First_Name, Last_Name, Title
FROM employee
LEFT JOIN role ON employee.Role_Id = role.id;