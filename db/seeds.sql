-- Insert into department table
INSERT INTO department (name)
VALUES 
    ('Sales'),
    ('Engineering'),
    ('HR'),
    ('Marketing'),
    ('Finance');

-- Insert into role table
INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Manager', 70000, 1),
    ('Sales Associate', 40000, 1),
    ('Software Engineer', 90000, 2),
    ('HR Specialist', 60000, 3),
    ('Marketing Coordinator', 65000, 4),
    ('Financial Analyst', 70000, 5),
    ('Finance Specialist', 50000, 5);

-- Insert into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Smith', 2, 1),
    ('Bob', 'Johnson', 3, NULL),
    ('Alice', 'Williams', 4, 1),
    ('Charlie', 'Brown', 5, 2),
    ('Emily', 'Johnson', 6, NULL),
    ('Michael', 'Williams', 7, NULL),
    ('Robert', 'Brown', 3, NULL),
    ('Julia', 'Banks', 1, NULL),
    ('Aaron', 'Smith', 2, NULL),
    ('Christina', 'Yang', 2, NULL);
