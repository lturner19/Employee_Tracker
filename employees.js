//global variable for addEmployee and updateRole functions
let titleList = [];

//Dependency setup
const mysql = require("mysql");
const inquirer = require("inquirer");

//do not want as a variable
require("console.table");

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
    inquirer
        .prompt([{
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Departments",
                "View All Roles",
                "Add Employee",
                "Add Department",
                "Add Role",
                "Update Employee Role",
                "Exit"
            ]
        }])
        .then(function (input) {
            switch (input.action) {
                case "View All Employees":
                    viewEmployees();
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
function viewEmployees() {
    connection.query(
        //employee2 = alias for employee, allows the manager_id to be filled in with the manager name
        `SELECT employee.id, employee.First_Name, employee.Last_Name, role.title, department.name department, role.salary, concat(employee2.First_Name, " ", employee2.Last_Name) manager
        FROM employee 
        left join employee employee2 on employee.id = employee2.Manager_Id
        left join role on employee.Role_Id = role.id
        left join department on role.Department_Id = department.id Order By employee.id;`,
        function (err, res) {
            if (err) throw err;
            console.table(res); //formatting the look of data in terminal
            start();
        }
    );
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
    connection.query("SELECT Title FROM role", function (err, res) {
        if (err) throw err;
        //returning info in console.table format
        console.table(res);
        start();
    });
}
// ---------------------------------addEmployee function-----------------------------------------

function roleChoice() {
    return new Promise((resolve, reject) => {
        connection.query("Select Title FROM role", function (err, data) {
            if (err) throw err;
            resolve(data);
        });
    });
}

function managerChoice() {
    return new Promise((resolve, reject) => {
        connection.query(
            `Select Manager_Id, concat(employee.First_Name," ", employee.Last_Name) manager FROM employee`,
            function (err, data) {
                if (err) throw err;
                //console.log(data);
                resolve(data);
            }
        );
    });
}

function lookUpId(tableName, columnName, value) {
    return new Promise((resolve, reject) => {
        let statement = connection.query(
            `Select Id FROM ${tableName} WHERE ${columnName} = '${value}'`,
            function (err, data) {
                if (err) throw err;
                resolve(data);
            }
        );
    });
}

function addEmployee() {
    let managerList = [];

    roleChoice().then(function (titles) {
        titleList = titles.map(role => role.Title);

        managerChoice().then(function (managers) {
            managerList = managers.map(manager => manager.manager);

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
                ])
                .then(function (input) {

                    const selectedManager = managers.find(item => item.manager === input.manager);
                    console.log("test", selectedManager);
                    lookUpId("role", "title", input.role).then(function (titleData) {
                        // console.log("table", titleData[0].Id);
                        lookUpId("employee", "concat(First_Name, ' ', Last_Name)", input.manager).then(function (managerData) {
                            console.log("table", managerData)
                            connection.query(
                                console.log(`INSERT INTO employee (First_Name, Last_Name, Role_Id, Manager_Id) VALUES("${input.firstName}", "${input.lastName}", ${titleData[0].Id}, ${selectedManager.Manager_Id}`)
                                
                                
                                `INSERT INTO employee (First_Name, Last_Name, Role_Id, Manager_Id) VALUES("${input.firstName}", "${input.lastName}", ${titleData[0].Id}, ${selectedManagerinput.Manager_Id})`,

                                function (err, res) {
                                    if (err) throw err;
                                    console.table(viewEmployees())
                                    start();
                                }
                            );
                        });
                    });
                });
        })
    })
}

function addDept() {
    inquirer.prompt([{
            name: "department",
            type: "input",
            message: "What department would you like to add?"
        }])
        .then(function (input) {
            //inserting the user's input into the mysql database
            connection.query(`INSERT INTO department (name) VALUES("${input.department}")`, function (err, res) {
                if (err) throw err;
                console.table(viewDept());
                start();
            });
        });
}
// ----------------------------------addRole function---------------------------------------------
function deptChoice() {
    return new Promise((resolve, reject) => {
        connection.query("Select id, name FROM department", function (err, data) {
            if (err) throw err;
            resolve(data);
        })
    })
}

function addRole() {
    deptChoice().then(function (id) {
        idList = id.map(department => department.id)

        inquirer.prompt([{
                    name: "title",
                    type: "input",
                    message: "What role would you like to add?"
                },
                {
                    name: "salary",
                    type: "input",
                    message: "What is the salary for this role?"
                },
                {
                    name: "deptId",
                    type: "list",
                    message: "What department should the role be added to?",
                    choices: idList
                }
            ])
            .then(function (input) {
                connection.query(`INSERT INTO role (title, salary, department_id) VALUES("${input.title}", ${input.salary}, ${input.deptId})`,
                    function (err, res) {
                        if (err) throw err;
                        console.table(viewrole());
                        start();
                    });
            });
    });
}

// -------------------------------Update employee role function------------------------------------------------------------------------------------
function employeeChoice() {
    return new Promise((resolve, reject) => {
        connection.query(`Select First_Name, Last_Name FROM employee`, function (err, data) {
            if (err) throw err;
            console.log(data);
            resolve(data);
        });
    });
}

function updateRole() {
    let employeeList = [];

    employeeChoice().then(function (employees) {
        employeeList = employees.map(employee => employee.First_Name)

        roleChoice().then(function (titles) {
            titleList = titles.map(role => role.Title);

            inquirer.prompt([{
                    name: "pickEmployee",
                    type: "list",
                    message: "Which employee do you want to update?",
                    choices: employeeList
                },
                {
                    name: "updateTitle",
                    type: "list",
                    message: "What is the employee's new title?",
                    choices: titleList
                }
            ]).then(function (input) {
                connection.query(`INSERT INTO role (title) VALUE("${input.updateTitle}")`, function (err, res) {
                    if (err) throw err;

                })
                start();
            })
        })
    })
}