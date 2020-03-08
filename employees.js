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
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: ["View All Employees", "View Employees By Department", "View Employees By Role", "Add Employee", "Add Department", "Add Role","Update Employee Role", "Exit"]
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

function viewEmployee() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        for (let index = 0; index < res.length; index++) {
            console.log(res[index].First_Name + "||" + res[index].Last_Name + "||" + res[index].Role_Id + "||" + res[index].Manager_id);
            start();
        }
    });
}

function viewDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        for (let index = 0; index < res.length; index++) {
            console.log(res[index].id + "||" + res[index].name)
            start();
        }
    });
}

function viewRole() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        for (let index = 0; index < res.length; index++) {
            console.log(res[index].id + "||" + res[index].title + "||" + res[index].salary + "||" + res[index].department_id);
            start();
        }
    });
}
 