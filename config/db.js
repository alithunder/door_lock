const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: 'postgres',
  host: 'verbosely-zealous-hyrax.data-1.euc1.tembo.io',
  database: 'look_app',
  password: '93ZlYtespWEifno2',  // Ensure this matches the correct password
  port: 5432,
  ssl: {rejectUnauthorized: false },
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
