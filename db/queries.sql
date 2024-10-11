--im not actually using this--
--the internet told me to put this here--



-- Choosing the COLUMNS/fields we are intrested in seeing
SELECT department.id, department.name, SUM(role.salary) AS Department_Budget 
FROM employee 
JOIN role 
    ON employee.role_id = role.id 
JOIN department 
    ON role.department_id = department.id 
GROUP BY department.id, department.name;


-- SIMPLE SINGLE TABLE QUERY
SELECT id, name
FROM department; 


-- SIMPLE TWO TABLE JOIN QUERY
SELECT department.id, name, role.id, title, role.salary
FROM department
LEFT JOIN role 
    ON role.department_id = department.id;


SELECT department.id, name, role.id, title, role.salary
FROM role
RIGHT JOIN department 
    ON role.department_id = department.id;
