const Queries = require('./queries');
const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

let newQuery;
let currentTask;

const connection = mysql.createConnection({
  host: 'localhost',

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: 'root',

  // BE SURE TO UPDATE WITH YOUR OWN MYSQL PASSWORD BEFORE USING!
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
                'Add Department','Add Role', 'Add Employee', 'View Employees By Department', 'View Employees By Role', 'View all Employees', 'Update Employee Role',
            ],
            name: 'userChoice'
        },
    ])
    .then((data) => {
        currentTask = data.userChoice;
        newQuery = new Queries(data);
        inquireSwitch(data);
    });
}

// Case statement to send the user to the next part of their query
const inquireSwitch = data => {
    switch(data.userChoice) {
        case 'Add Department':
            addDepartmentInquire();
        break;
        case 'Add Role':
            getDepartments();
        break;
        case 'Add Employee':
            getRoles();
        break;
        case 'View Employees By Department':
            getDepartments();
        break;
        case 'View Employees By Role':
            getRoles();
        break;
        case 'View all Employees':
            viewAllEmployeesQuery();
        break;
        case 'Update Employee Role':
            getRoles();
        break;
    }
}
// Inquire users about the name of the department they would like to add
const addDepartmentInquire = () => {
    inquirer.prompt ([
        {
            type: 'input',
            message: `What would you like the department to be called?`,
            name: 'departmentName'
        },
    ])
    .then((data) => {
        addDepartmentQuery(data.departmentName);
    });
}

// Inquire users on which department they'd like to query information for
const listOfDepartmentsInquire = (departments) => {
    inquirer.prompt ([
        {
            type: 'list',
            message: `Select a department to find employees for:`,
            choices:  departments,
            name: 'departmentName',
        },
    ])
    .then((data) => {
        viewEmployeesByDeptQuery(data.departmentName);
    });
}

// Inquire users on which department they'd like to query information for
const listOfRolesInquire = (roles) => {
    inquirer.prompt ([
        {
            type: 'list',
            message: `Select a role to find employees for:`,
            choices:  roles,
            name: 'roleTitle'
        },
    ])
    .then((data) => {
        viewEmployeesByRoleQuery(data.roleTitle);
    });
}

// Query for viewing all employees and their information
const viewAllEmployeesQuery = () => {
    connection.query('SELECT e1.employee_id, e1.first_name, e1.last_name, role.title, department.name, role.salary, CONCAT(e2.first_name, " ", e2.last_name) AS manager_name FROM employee e1 LEFT JOIN employee e2 ON e1.manager_id = e2.employee_id INNER JOIN role ON e1.role_id = role.role_id INNER JOIN department ON role.department_id = department.department_id ORDER BY e1.employee_id', (err, res) => {
      if (err) throw err;
      console.table(res);
      inquireUser();
    });
  };

  // Query for adding departments to the department table
  const addDepartmentQuery = (departmentName) => {
    const query = connection.query(
        'INSERT INTO department SET ?',
        {
          name: departmentName,
        },
        (err, res) => {
            if (err) throw err;
            console.log(departmentName + " has been added to departments.");
            inquireUser();
        }
    );
  }

  // Gets all current departments and puts them into an array to be used
  const getDepartments = () => {
    connection.query('SELECT name FROM department ORDER BY name', (err, res) => {
        if (err) throw err;
        let deptList = [];
        for (const [key, value] of Object.entries(res)){
            deptList.push(value.name);
        }
        if (currentTask === "View Employees By Department"){
            listOfDepartmentsInquire(deptList, "viewEmp");
        } else if (currentTask === "Add Role"){
            addRoleInquire(deptList);
        }
      });
  }

  // Displays the information about all users in given department
  const viewEmployeesByDeptQuery = (departmentName) => {
    connection.query('SELECT employee_id, first_name, last_name, role.title, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.role_id INNER JOIN department ON role.department_id = department.department_id WHERE ? ORDER BY employee.employee_id',
    {
        name: departmentName
    },
     (err, res) => {
        if (err) throw err;
        console.table(res);
        inquireUser();
      });
  }

    // Gets all current roles and puts them into an array to be used
    const getRoles = () => {
        connection.query('SELECT title FROM role ORDER BY title', (err, res) => {
            if (err) throw err;
            let roleList = [];
            for (const [key, value] of Object.entries(res)){
                roleList.push(value.title);
            }
            if (currentTask === "View Employees By Role"){
                listOfRolesInquire(roleList);
            } else if (currentTask === "Update Employee Role" || currentTask === "Add Employee"){
                getUserList(roleList);
            }
          });
      }

    // Displays the information about all users by a given role
    const viewEmployeesByRoleQuery = (roleTitle) => {
    connection.query('SELECT employee_id, first_name, last_name, role.title, department.name AS department FROM employee INNER JOIN role ON employee.role_id = role.role_id INNER JOIN department ON role.department_id = department.department_id WHERE ? ORDER BY employee.employee_id',
    {
        title: roleTitle
    },
     (err, res) => {
        if (err) throw err;
        console.table(res);
        inquireUser();
      });
  }

  // Inquire the user on input data for their new role
const addRoleInquire = (deptList) => {
    inquirer.prompt ([
        {
            type: 'input',
            message: `What is the name of the role that you would like to create?`,
            name: 'newRoleName'
        },
        {
            type: 'input',
            message: `What is the salary of this role?`,
            name: 'newRoleSalary'
        },
        {
            type: 'list',
            message: `What department is this new role in?`,
            choices:  deptList,
            name: 'newRoleDepartment'
        },
    ])
    .then((data) => {
        getNewRoleDeptId(data);
    });
}
    // Gets the department id for a passed in department name
const getNewRoleDeptId = data => {
    connection.query('SELECT department_id FROM department WHERE ?',
    {
        name: data.newRoleDepartment
    },
     (err, res) => {
        if (err) throw err;
        createNewRoleQuery(data, res[0].department_id)
      });
}

// Query to add a new role to the role table
const createNewRoleQuery = (data, deptId) => {
    connection.query('INSERT INTO role SET ?',
    {
        title: data.newRoleName,
        salary: data.newRoleSalary,
        department_id: deptId
    },
     (err, res) => {
        if (err) throw err;
        console.log("Your new role has been added!");
        inquireUser();
      });
}

// Query to get a list of all current employees
const getUserList = (rolesList) => {
    connection.query('SELECT CONCAT(first_name, " ", last_name) AS employee_name FROM employee',
     (err, res) => {
        let employeeList = [];
        for (const [key, value] of Object.entries(res)){
            employeeList.push(value.employee_name);
        }
        if (currentTask === "Update Employee Role"){
            updateUserRoleInquire(employeeList, rolesList);
        } else if(currentTask === "Add Employee"){
            createNewEmployeeInquire(employeeList, rolesList);
        }    
      });
}

  // Inquire the user updating a user's role
  const updateUserRoleInquire = (empList,rolesList) => {
    inquirer.prompt ([
        {
            type: 'list',
            message: `What user would you like to update the role of?`,
            choices:  empList,
            name: 'empToUpdate'
        },
        {
            type: 'list',
            message: `What role would you like this user to be?`,
            choices:  rolesList,
            name: 'newEmpRole'
        },
    ])
    .then((data) => {
        getRoleId(data);
    });
}

    // Gets the role id for a passed in role title
    const getRoleId = (data) => {
        connection.query('SELECT role_id FROM role WHERE ?',
        {
            title: data.newEmpRole
        },
         (err, res) => {
            if (err) throw err;
            if (currentTask === "Update Employee Role"){
                updateUserRoleQuery(data, res[0].role_id)
            } else if(currentTask === "Add Employee" && data.newEmpManager !== "No Manager"){
                getEmpId(data, res[0].role_id);
            } else{
                createEmployeeQuery(data, res[0].role_id, null);
            }
          });
    }

// Query to add a new role to the role table
const updateUserRoleQuery = (data, roleId) => {
    connection.query(`UPDATE employee SET ? WHERE CONCAT(first_name, " ", last_name) = "${data.empToUpdate}"`,
    {
        role_id: roleId
    },
     (err, res) => {
        if (err) throw err;
        console.log("Employee role has been updated!");
        inquireUser();
      });
}

  // Inquire information for creating a new employee
  const createNewEmployeeInquire = (employeeList, rolesList) => {
      employeeList.push("No Manager");
    inquirer.prompt ([
        {
            type: 'input',
            message: `What is the first name of your employee?`,
            name: 'empFName'
        },
        {
            type: 'input',
            message: `What is the last name of your employee?`,
            name: 'empLName'
        },
        {
            type: 'list',
            message: `What role would you like this user to be?`,
            choices:  rolesList,
            name: 'newEmpRole'
        },
        {
            type: 'list',
            message: `Who is this employee's manager?`,
            choices:  employeeList,
            name: 'newEmpManager'
        },
    ])
    .then((data) => {
        getRoleId(data);
    });
}

    // Gets the employee id for a passed in role title
    const getEmpId = (data, roleId) => {
        connection.query(`SELECT employee_id FROM employee WHERE CONCAT(first_name, " ", last_name) = "${data.newEmpManager}"`,
         (err, res) => {
            if (err) throw err;
            createEmployeeQuery(data, roleId, res[0].employee_id)
          });
    }

    //Query for creating an employee
    const createEmployeeQuery = (data, roleId, managerId) => {
        connection.query(`INSERT INTO employee SET ?`,
        {
            first_name: data.empFName,
            last_name: data.empLName,
            role_id: roleId,
            manager_Id: managerId,
        },
        (err, res) => {
           if (err) throw err;
           inquireUser();
         });
    }