//Dependency setup
var mysql = require("mysql");
var inquirer = require("inquirer");

//creates access connection to the mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Calomal15!",
    database: "employees_db"
});

//Connecting to the mysql database
connection.connect(function (err) {
    if (err) throw err;

    //calling the function that prompts questions
    start();

});

function start() {
    inquirer.prompt([{
        type: "rawlist",
        name: "action",
        message: "What would you like to do?",
        choices: ["View All Employees", "View Employees By Department", "View Employees By Manager", "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
    }]).then(function (input) {
        switch (input.action) {
            case "View All Employees":
                view();
                break;
            case "View Employees By Department":
                viewDept();
                break;
            case "View Employees By Manager":
                viewManager();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee Role":
                updateRole();
                break;
            case "Update Employee Manager":
                updateManager();
                break;
            default:
                connection.end();
        }
    });
}

