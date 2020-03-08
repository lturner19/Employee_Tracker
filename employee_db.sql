CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE department(
Id INT NOT NULL AUTO_INCREMENT,
Name VARCHAR(30) NOT NULL,
PRIMARY KEY (Id)
);

INSERT INTO department (Name)
VALUES ("Sales");

INSERT INTO department (Name)
VALUES ("Engineering");

CREATE TABLE role (
Id INT NOT NULL AUTO_INCREMENT,
Title VARCHAR(30) NOT NULL,
Salary DECIMAL (10,2),
Department_Id INT,
PRIMARY KEY (Id)
);

INSERT INTO role (Title, Salary)
VALUES("Engineer", 100000.00, 2); 

Insert INTO role (Title, Salary, Department_Id)
VALUES ("Salesperson", 160000.00, 1);


CREATE TABLE employee (
Id INT NOT NULL AUTO_INCREMENT,
First_Name VARCHAR(30) NOT NULL,
Last_Name VARCHAR(30) NOT NULL,
Role_Id INT,
Manager_Id INT NULL,
PRIMARY KEY (Id)
);

INSERT INTO employee (First_Name, Last_Name, Role_Id, Manager_Id)
Values ("Leandra", "Turner", 1, 3);

INSERT INTO employee (First_Name, Last_Name, Role_Id, Manager_Id)
Values ("Bob", "Smith", 2, 1);

SELECT *
FROM department;

SELECT *
FROM role;

SELECT *
FROM employee;