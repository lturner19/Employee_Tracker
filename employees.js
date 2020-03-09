//Dependency setup
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Calomal15!",
    database: "employees_db"
});

//Connecting to mysql database
connection.connect(function (err) {
    if (err) throw err;

    //calling the function that prompts questions
    start();

});

//begins the prompts and calls other functions based on the user's choice
function start() {
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "View Employees By Department", "View Employees By Role", "Add Employee", "Add Department", "Add Role", "Update Employee Role", "Exit"]
    }]).then(function (input) {
        switch (input.action) {
            case "View All Employees":
                viewEmployee();
                break;
            case "View Employees By Department":
                viewDept();
                break;
            case "View Employees By Role":
                viewRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Role":
                addRole();
                break;
            case "Add Department":
                addDept();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "Exit":
                connection.end();
        }
    });
}

//allows the full amount of info about the employees, from the three tables in the sql database, to be viewed by left joining the three tables
function viewEmployee() {
    connection.query(
        //employee2 = alias for employee, allows the manager_id to be filled in with the manager name 
        `
    SELECT employee.id, employee.First_Name, employee.Last_Name, role.title, department.name department, role.salary, concat(employee2.First_Name, " ", employee2.Last_Name) manager
 FROM employee 
 left join employee employee2 on employee.id = employee2.Manager_Id
 left join role on employee.Role_Id = role.id
 left join department on role.Department_Id = department.id Order By employee.id;
    
    `, function (err, res) {
        if (err) throw err;
       
        console.table(res);
        start();
    });
}

function viewDept() {
    //pulling information from the dept. table in sql
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        //returning the information to the user and in the console.table format
            console.table(res);
            start();
    });
}
function viewRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
            start();
    });
}

