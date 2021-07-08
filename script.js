const Queries = require('./queries');
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

let newQuery;

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // Be sure to update with your own MySQL password!
  password: '',
  database: 'employees_db',
});

// Connect to the Database
connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    inquireUser();
  });

  // Queries the user information about their team.
const inquireUser = () => {
    inquirer.prompt ([
        {
            type: 'list',
            message: `What would you like to do?`,
            choices:  [
                'Add Department','Add Role', 'Add Employee', 'View All Employees By Department', 'View All Employees By Role', 'View all Employees', 'Update Employee Role',
            ],
            name: 'userChoice'
        },
        // {
        //     type: 'input',
        //     message: `What school do they go to?`,
        //     name: 'internSchool',
        //     when: () => empType === 'Intern',
        // },
    ])
    .then((data) => {
        newQuery = new Queries(data);
        inquireSwitch(data);
    });
}

const inquireSwitch = data => {
    switch(data.userChoice) {
        case 'Add Department':
        addDepartmentInquire();
        break;
        case 'Add Role':

        break;
        case 'Add Employee':

        break;
        case 'View All Employees By Department':

        break;
        case 'View All Employees By Role':

        break;
        case 'View all Employees':
        viewAllEmployees();
        break;
        case 'Update Employee Role':

        break;
    }
}

const addDepartmentInquire = () => {
    inquirer.prompt ([
        {
            type: 'input',
            message: `Are you cool`,
            name: 'cool'
        },
    ])
    .then((data) => {
console.log('hi');
    });
}

// Query for viewing all employees and their information
const viewAllEmployees = () => {
    connection.query('SELECT e1.employee_id, e1.first_name, e1.last_name, role.title, department.name, role.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager_name FROM employee e1 LEFT JOIN employee e2 ON e1.manager_id = e2.employee_id INNER JOIN role ON e1.role_id = role.role_id INNER JOIN department ON role.department_id = department.department_id ORDER BY e1.employee_id', (err, res) => {
      if (err) throw err;
      console.table(res);
    });
  };
