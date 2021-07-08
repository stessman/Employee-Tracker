class Queries {
    constructor(data) {
      this.data = data;
    }
  
    viewAllEmployees = () => {
        console.log('Selecting all artists that appear more than once...\n');
        connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, manager_name = CONCAT(e2.first_name, " ", e2.last_name) FROM employee e1 INNER JOIN employee e2 ON e1.manager_id = e2.id', (err, res) => {
          if (err) throw err;
          // Log all results of the SELECT statement
          console.log(res);
        });
      };
  }


  
  module.exports = Queries;