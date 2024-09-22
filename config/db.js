const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a new pool instance for PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'verbosely-zealous-hyrax.data-1.euc1.tembo.io',
    database: 'look_door',
    password: '93ZiYtespWEifno2',
    port: 5432,
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
