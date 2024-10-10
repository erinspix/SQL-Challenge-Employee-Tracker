// Import the 'pg' module, which is a PostgreSQL client for Node.js, used for connecting to and querying PostgreSQL databases
const { Pool } = require("pg");

// Load environment variables from a .env file into process.env, making database credentials secure and configurable
require('dotenv').config();

// Create a new instance of Pool to manage multiple connections to the PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,       // Username for the database, retrieved from environment variables
  host: process.env.DB_HOST,       // Host address of the PostgreSQL server, retrieved from environment variables
  database: process.env.DB_NAME,   // Name of the database to connect to, retrieved from environment variables
  password: process.env.DB_PASSWORD, // Password for the database user, retrieved from environment variables
  port: process.env.DB_PORT,       // Port number on which the PostgreSQL server is running, retrieved from environment variables
});

// Export a function to make database queries, allowing other parts of the application to interact with the database
module.exports = {
  query: (text, params) => pool.query(text, params), // Executes a database query with the provided SQL text and parameters
};

// Establish a connection to the database and log the connection status to the console
pool.connect((err) => {
  if (err) {
    // If there's an error during the connection, log the error details to the console
    console.error('Database connection error:', err.stack);
  } else {
    // If the connection is successful, log a confirmation message to the console
    console.log('Database connected successfully');
  }
});
