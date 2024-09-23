const { Client } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const client = new Client({
  user: 'postgres',
  host: 'verbosely-zealous-hyrax.data-1.euc1.tembo.io',
  database: 'look_door',
  password: '93ZiYtespWEifno2',  // Ensure this matches the correct password
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

// Connect to the database
client.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

// Export the client for use in other files
module.exports = client;
