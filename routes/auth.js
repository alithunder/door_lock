const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');  // Database connection
const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    const { user_id } = req.body;

    try {
        const result = await pool.query('SELECT role FROM users WHERE id = $1', [user_id]);
        const user = result.rows[0];

        if (user && user.role === 'admin') {
            next();  // User is an admin, proceed
        } else {
            res.status(403).json({ error: 'Access denied. Admins only.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Authorization failed' });
    }
};

// Register a new user (public endpoint)
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user in the database
        const result = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, role]
        );

        // Return the user data (without password)
        res.status(201).json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'User registration failed' });
    }
});

// Login a user (public endpoint)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch the user from the database by email
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        // If the user doesn't exist, return an error
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Return the user ID and username (for future requests)
        res.json({ message: 'Login successful', user: { id: user.rows[0].id, username: user.rows[0].username, role: user.rows[0].role } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Admin route to add a user
router.post('/add-user', isAdmin, async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'User added successfully', user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add user' });
    }
});

// Admin route to get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, email, role FROM users ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

module.exports = router;
