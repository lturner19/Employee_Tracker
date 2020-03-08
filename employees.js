//Dependency setup
var mysql = require("mysql");
var inquirer = require("inquirer");

//allows access to the mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"Calomal15!",
    database: "employees_db"
})


