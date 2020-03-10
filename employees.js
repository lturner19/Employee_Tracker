//Dependency setup
const mysql = require("mysql");
const inquirer = require("inquirer");


//do not want as a variable
require("console.table")

//Accessing the mysql table
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Calomal15!",
    database: "employees_db"
});

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
        choices: ["View All Employees", "View All Departments", "View All Roles", "Add Employee", "Add Department", "Add Role", "Update Employee Role", "Exit"]
    }]).then(function (input) {
        switch (input.action) {
            case "View All Employees":
                viewEmployee();
                break;
            case "View All Departments":
                viewDept();
                break;
            case "View All Roles":
                viewRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDept();
                break;
            case "Add Role":
                addRole();
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
        `SELECT employee.id, employee.First_Name, employee.Last_Name, role.title, department.name department, role.salary, concat(employee2.First_Name, " ", employee2.Last_Name) manager
        FROM employee 
        left join employee employee2 on employee.id = employee2.Manager_Id
        left join role on employee.Role_Id = role.id
        left join department on role.Department_Id = department.id Order By employee.id;`,
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        });
}

function viewDept() {
    //pulling information from the dept. table in sql database
    connection.query("SELECT Name FROM department", function (err, res) {
        if (err) throw err;
        //returning the information to the user and in the console.table format
        console.table(res);
        start();
    });
}

function viewRole() {
    //pulling info from role table in sql database
    connection.query(
        "SELECT Title FROM role",
        function (err, res) {
            if (err) throw err;
            //returning info in console.table format
            console.table(res);
            start();
        });
}

function roleChoice() {
    return new Promise((resolve, reject) => {
        connection.query("Select Title FROM role", function (err, data) {
            if (err) throw err;
            resolve(data);
        })
    })
}


function managerChoice() {
    return new Promise((resolve, reject) => {
        connection.query(`Select concat(employee.First_Name," ", employee.Last_Name) manager FROM employee`, function (err, data) {
            if (err) throw err;
            //console.log(data);
            resolve(data);
        })
    });
}

function lookUpId(tableName, columnName, value) {
    return new Promise((resolve, reject) => {
        let statement = connection.query(`Select Id FROM ${tableName} WHERE ${columnName} = ${value}`, function (err, data) {
            if (err) throw err;
            resolve(data)
        })
    })
}


function addEmployee() {

    let titleList = [];
    let managerList = [];

    roleChoice().then(function (titles) {
        titleList = titles.map(role => role.Title)

        managerChoice().then(function (managers) {
            managerList = managers.map(manager => manager.manager)

            inquirer.prompt([{
                    name: "firstName",
                    type: "input",
                    message: "What is the employee's first name?"
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "What is the employee's last name?"
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is the employee's role?",
                    choices: titleList
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Who is the employee's manager?",
                    choices: managerList
                }
            ]).then(function (input) {
                lookUpId("role", "title", "input.role").then(function (titleData) {
                    lookUpId("employee", "concat(First_Name, ' ', Last_Name)", input.manager).then(function (managerData) {

                        connection.query(`INSERT INTO employee (First_Name, Last_Name, Role_Id, Manager_Id) VALUES("${input.firstName}", "${input.lastName}", "${input.role}", "${input.manager}")`,
                            function (err, data) {
                                if (err) throw err;
                                //need to fix where error
                            })
                    })
                })
            })
        })
    })
}

