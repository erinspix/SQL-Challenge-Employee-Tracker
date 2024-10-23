# SQL-Challenge-Employee-Tracker
Challenge 12, SQL Employee Tracker


[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

The SQL Employee Tracker is a command-line application that allows business owners to view and manage their company's employee database using Node.js, Inquirer, and PostgreSQL. The purpose of this application is to help organize and plan business operations by keeping track of departments, roles, and employees in a structured and efficient way.
## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)

## Installation

Installation
Clone the repository to your local machine.

bash:

git clone https://github.com/your-username/SQL-Challenge-Employee-Tracker.git
Navigate to the project directory.



npm install

Set up the PostgreSQL database:

Run the schema.sql file to create the database and tables:



psql -U your_username -d postgres -f db/schema.sql
Run the seeds.sql file to populate the tables with initial data:


psql -U your_username -d co_db -f db/seeds.sql
Create a .env file in the root directory and add your database credentials:

makefile

DB_USER=your_username
DB_HOST=localhost
DB_NAME=co_db
DB_PASSWORD=your_password
DB_PORT=5432

## Usage

To use the application:

Start the server:

node server.js

Follow the prompts in the command-line interface to:
View all departments, roles, and employees.
Add new departments, roles, or employees.
Update employee roles.
Delete employees.
View the budget for each department.

## License

This project is licensed under the MIT license.

## Contributing

I made this using provided code.

## Tests

to test run index.js

## Questions

For any questions, please contact me with the information below:

GitHub: [GitHub: erinspix](https://github.com/GitHub: erinspix)  
Email: e.spix@yahoo.com


- **Home Directiory**: ![Directory](/Images/Home%20Directory.png)
- **Employee Table**: ![Table](/Images/Table.png)
- **Department Total**: ![Department Average](/Images/budget.png)

Demo Link:
https://drive.google.com/file/d/12EkyrxjqdV8pysUJdUOBNxQzfCtxHKrj/view?usp=sharing
