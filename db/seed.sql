INSERT INTO department (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1),
("Sales Lead", 100000, 1),
("Software Engineer", 120000, 2),
("Lead Engineer", 150000, 2),
("Accountant", 125000, 3),
("Lawyer", 190000, 4),
("Leagal Team Lead", 250000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Salesman", 1, 2),
("Tim", "SalesLead", 2, 8),
("Slip", "SoftwareEngineer", 3, 4),
("Slop", "LeadEngineer", 4, 8),
("Rick", "Accountant", 5, 8),
("Pete", "Lawyer",  6, 7),
("Poot", "LeagalTeamLead", 7, 8),
("Quit", "NoManager", 6);