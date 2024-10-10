// Import the 'inquirer' module for creating command-line prompts
const inquirer = require('inquirer');
// Import the database client from the 'connections' module to interact with the PostgreSQL database
const client = require('./db/connections');

// Define the list of menu options that will be displayed to the user
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
    const answer = await inquirer.prompt({
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        choices: menuOptions
    });

    // Switch statement to handle the user's selection from the main menu
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
        const res = await client.query('SELECT * FROM department');
        console.table(res.rows); // Display the result as a table in the console
    } catch (error) {
        console.error('Error fetching departments:', error); // Log any errors to the console
    }
    await mainMenu();
};

// Function to view all roles with error handling
const viewRoles = async () => {
    try {
        const res = await client.query(`
            SELECT role.id, role.title, department.name AS department, role.salary
            FROM role
            JOIN department ON role.department_id = department.id;
        `);
        console.table(res.rows);
    } catch (error) {
        console.error('Error fetching roles:', error);
    }
    await mainMenu();
};

// Function to view all employees with error handling
const viewEmployees = async () => {
    try {
        const res = await client.query(`
            SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department,
            role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id;
        `);
        console.table(res.rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
    await mainMenu();
};

// Function to add a new department with error handling
const addDepartment = async () => {
    const answer = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the new department:'
    });

    try {
        const res = await client.query('INSERT INTO department (name) VALUES ($1) RETURNING *', [answer.name]);
        console.log(`Added department:`, res.rows[0]);
    } catch (error) {
        console.error('Error adding department:', error);
    }
    await mainMenu();
};

// Function to add a new role with error handling
const addRole = async () => {
    try {
        const departments = await client.query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(({ id, name }) => ({ name, value: id }));

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

        const res = await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *', [answer.title, answer.salary, answer.department_id]);
        console.log(`Added role:`, res.rows[0]);
    } catch (error) {
        console.error('Error adding role:', error);
    }
    await mainMenu();
};

// Function to add a new employee with error handling
const addEmployee = async () => {
    try {
        const roles = await client.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

        const employees = await client.query('SELECT * FROM employee');
        const managerChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));
        managerChoices.unshift({ name: 'None', value: null });

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

        const res = await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *', [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]);
        console.log(`Added employee:`, res.rows[0]);
    } catch (error) {
        console.error('Error adding employee:', error);
    }
    await mainMenu();
};

// Function to update an employee's role with error handling
const updateEmployeeRole = async () => {
    try {
        const employees = await client.query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        const roles = await client.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(({ id, title }) => ({ name: title, value: id }));

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

        const res = await client.query('UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *', [answer.role_id, answer.employee_id]);
        console.log('Updated employee role:', res.rows[0]);
    } catch (error) {
        console.error('Error updating employee role:', error);
    }
    await mainMenu();
};

// Function to delete an employee with error handling
const deleteEmployee = async () => {
    try {
        const employees = await client.query('SELECT * FROM employee');
        const employeeChoices = employees.rows.map(({ id, first_name, last_name }) => ({ name: `${first_name} ${last_name}`, value: id }));

        const answer = await inquirer.prompt({
            name: 'employee_id',
            type: 'list',
            message: 'Select the employee to delete:',
            choices: employeeChoices
        });

        const res = await client.query('DELETE FROM employee WHERE id = $1 RETURNING *', [answer.employee_id]);
        console.log('Deleted employee:', res.rows[0]);
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
    await mainMenu();
};

// Start the application by displaying the main menu
mainMenu();
