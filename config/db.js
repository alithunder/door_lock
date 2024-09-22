const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: 'postgres',  // your username
  host: 'verbosely-zealous-hyrax.data-1.euc1.tembo.io',  // host provided by Tembo
  database: 'look_door',  // your database name
  password: '93ZlYtespWEifno2',  // your password
  port: 5432,
  ssl: {
    rejectUnauthorized: false,  // Allow self-signed certificates
  }
});


// Check the connection (optional)
pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

// Export the pool for use in other files
module.exports = pool;
