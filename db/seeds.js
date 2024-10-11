// const client = require('./db');

// // Function to seed the database with initial data
// const seedDatabase = async () => {
//     try {
//         // Insert into department table
//         await client.query(`
//             INSERT INTO department (name)
//             VALUES 
//                 ('Dragon Slaying'),
//                 ('Potion Brewing'),
//                 ('Quest Management'),
//                 ('Treasure Hunting'),
//                 ('Scroll Keeping');
//         `);

//         // Insert into role table
//         await client.query(`
//             INSERT INTO role (title, salary, department_id)
//             VALUES 
//                 ('Dragon Tamer', 95000, 1),
//                 ('Fireproof Shield Carrier', 50000, 1),
//                 ('Potion Master', 120000, 2),
//                 ('Quest Giver', 75000, 3),
//                 ('Treasure Map Illustrator', 68000, 4),
//                 ('Gold Counter', 72000, 5),
//                 ('Scroll Guardian', 60000, 5);
//         `);

//         // Insert into employee table
//         await client.query(`
//             INSERT INTO employee (first_name, last_name, role_id, manager_id)
//             VALUES
//                 ('Luna', 'Dragonheart', 1, NULL),
//                 ('Merlin', 'Firewalker', 2, 1),
//                 ('Elvira', 'Herbwhisper', 3, NULL),
//                 ('Thorn', 'Oakshield', 4, 1),
//                 ('Finn', 'Mapmaker', 5, 2),
//                 ('Gwen', 'Goldfinger', 6, NULL),
//                 ('Thistle', 'Scrollkeeper', 7, NULL),
//                 ('Ragnar', 'Stonehammer', 3, NULL),
//                 ('Sylvia', 'Shadowleaf', 1, NULL),
//                 ('Percival', 'Silverthorn', 2, NULL),
//                 ('Celeste', 'Starweaver', 2, NULL);
//         `);

//         console.log('Database seeded successfully!');
//     } catch (error) {
//         console.error('Error seeding the database:', error);
//     } finally {
//         client.end(); // Close the database connection
//     }
// };

// // Execute the seed function
// seedDatabase();