// Import the 'inquirer' module for creating command-line prompts to interact with the user
const inquirer = require('inquirer');

// Import the database client from the 'connections' module to interact with the PostgreSQL database
const client = require('./db/connections');

// Define the list of menu options that will be displayed to the user in the command-line interface
const menuOptions = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role', 
    'Add an employee',
    'Update an employee role',
    'Delete an employee',
    'View Budget for Department',
    'Exit'
];

// Main menu function to display options to the user and handle their selection
const mainMenu = async () => {
    // Prompt the user with the list of menu options
    const answer = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: menuOptions
    });

    // Use a switch statement to determine which action the user selected
    switch (answer.action) {
        case 'View all departments':
            await viewDepartments();
            break;            
        case 'View all roles':
            await viewRoles();
            break;
        case 'View all employees':
            await viewEmployees();
            break;
        case 'Add a department':
            await addDepartment();
            break;
        case 'Add a role':
            await addRole();
            break;        
        case 'Add an employee':
            await addEmployee();
            break;
        case 'Update an employee role':
            await updateEmployeeRole();
            break;
        case 'Delete an employee':
            await deleteEmployee();
            break;
        case 'View Budget for Department':
            await viewBudgetForDepartment();
            break;
        case 'Exit':
            console.log('Goodbye!');
            client.end(); // Close the database connection when the user exits
            return;
    }
};

// Function to view all departments with error handling
const viewDepartments = async () => {
    try {
        // Query the database to fetch all departments
        const res = await client.query('SELECT * FROM department');
        // Display the departments as a table in the console
        console.table(res.rows);
    } catch (error) {
        // Log any errors that occur during the query
        console.error('Error fetching departments:', error);
    }
    await mainMenu(); // Return to the main menu after displaying the results
};

// Function to view all roles with error handling
const viewRoles = async () => {
    try {
        // Query to fetch all roles along with their associated departments
        const res = await client.query(`
            SELECT role.id, role.title, department.name AS department, role.salary
            FROM role
            JOIN department ON role.department_id = department.id;
        `);
        // Display the roles as a table in the console
        console.table(res.rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
    await mainMenu();
};

// Function to view all employees with error handling
const viewEmployees = async () => {
    try {
        // Query to fetch all employee data including their roles, departments, and managers
        const res = await client.query(`
            SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
            role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id;
        `);
        // Display the employee data as a table in the console
        console.table(res.rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
    await mainMenu();
};

// Function to add a new department with error handling
const addDepartment = async () => {
    // Prompt the user to enter the name of the new department
    const answer = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the new department:'
    });

    try {
        // Insert the new department into the database and return the inserted row
        const res = await client.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [answer.name]);
        console.log(`Added department:`, res.rows[0]); // Log the added department
    } catch (error) {
        console.error('Error adding department:', error);
    }
    await mainMenu();
};

// Function to add a new role with error handling
const addRole = async () => {
    try {
        // Fetch all departments to display them as options for the new role
        const departments = await client.query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(({ id, name }) => ({ name, value: id }));

        // Prompt the user to enter details for the new role
        const answer = await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the new role:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary for the new role:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department for the new role:',
                choices: departmentChoices
            }
        ]);

        // Insert the new role into the database and return the inserted row
        const res = await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [answer.title, answer.salary, answer.department_id]);
        console.log(`Added role:`, res.rows[0]); // Log the added role
    } catch (error) {
        console.error('Error adding role:', error);
    }
    await mainMenu();
};

// Function to add a new employee with error handling
const addEmployee = async () => {
    try {
        // Fetch all roles to display them as options for the new employee
        const roles = await client.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

        // Fetch all employees to display them as options for selecting a manager
        const employees = await client.query('SELECT * FROM employee');
        const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
        managerChoices.unshift({ name: 'None', value: null }); // Add a 'None' option for employees with no manager

        // Prompt the user to enter details for the new employee
        const answer = await inquirer.prompt([
            {
                name: 'first_name',
                type: 'input',
                message: 'Enter the first name of the new employee:'
            },
            {
                name: 'last_name',
                type: 'input',
                message: 'Enter the last name of the new employee:'
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the role for the new employee:',
                choices: roleChoices
            },
            {
                name: 'manager_id',
                type: 'list',
                message: 'Select the manager for the new employee:',
                choices: managerChoices
            }
        ]);

        // Insert the new employee into the database and return the inserted row
        const res = await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]);
        console.log(`Added employee:`, res.rows[0]); // Log the added employee
    } catch (error) {
        console.error('Error adding employee:', error);
    }
    await mainMenu();
};

// Function to update an employee's role with error handling
const updateEmployeeRole = async () => {
    try {
        // Fetch all employees and roles to display them as options for the update
        const employees = await client.query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        const roles = await client.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

        // Prompt the user to select an employee and a new role for the update
        const answer = await inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to update:',
                choices: employeeChoices
            },
            {
                name: 'role_id',
                type: 'list',
                message: 'Select the new role for the employee:',
                choices: roleChoices
            }
        ]);

        // Update the employee's role in the database and return the updated row
        const res = await client.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [answer.role_id, answer.employee_id]);
        console.log('Updated employee role:', res.rows[0]); // Log the updated employee role
    } catch (error) {
        console.error('Error updating employee role:', error);
    }
    await mainMenu();
};

// Function to delete an employee with error handling
const deleteEmployee = async () => {
    try {
        // Fetch all employees to display them as options for deletion
        const employees = await client.query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        // Prompt the user to select an employee to delete
        const answer = await inquirer.prompt({
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to delete:',
            choices: employeeChoices
        });

        // Delete the selected employee from the database and return the deleted row
        const res = await client.query('DELETE FROM employee WHERE id = $1 RETURNING *', [answer.employee_id]);
        console.log('Deleted employee:', res.rows[0]); // Log the deleted employee
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
    await mainMenu();
};

// Start the application by displaying the main menu to the user
mainMenu();
