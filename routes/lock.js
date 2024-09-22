const express = require('express');
const pool = require('../config/db');  // Database connection
const router = express.Router();

// Lock the door (requires user ID)
router.post('/lock', async (req, res) => {
    const { user_id } = req.body;  // Accept the user ID in the request

    try {
        // Insert the lock action into the lock_history table
        await pool.query('INSERT INTO lock_history (user_id, action) VALUES ($1, $2)', [user_id, 'lock']);

        // Update the lock status to "locked"
        await pool.query('UPDATE lock_status SET current_state = TRUE, last_updated = CURRENT_TIMESTAMP WHERE id = 1');

        res.json({ message: 'Door locked' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to lock the door' });
    }
});

// Unlock the door (requires user ID)
router.post('/unlock', async (req, res) => {
    const { user_id } = req.body;  // Accept the user ID in the request

    try {
        // Insert the unlock action into the lock_history table
        await pool.query('INSERT INTO lock_history (user_id, action) VALUES ($1, $2)', [user_id, 'unlock']);

        // Update the lock status to "unlocked"
        await pool.query('UPDATE lock_status SET current_state = FALSE, last_updated = CURRENT_TIMESTAMP WHERE id = 1');

        res.json({ message: 'Door unlocked' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to unlock the door' });
    }
});

// Get the current lock status
router.get('/status', async (req, res) => {
    try {
        // Retrieve the current lock status from the database
        const result = await pool.query('SELECT current_state FROM lock_status WHERE id = 1');
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve lock status' });
    }
});
router.post('/history', async (req, res) => {
    try {
        // Query to retrieve all lock/unlock history for all users
        const result = await pool.query(`
            SELECT lock_history.action, lock_history.timestamp, users.username 
            FROM lock_history 
            JOIN users ON lock_history.user_id = users.id
            ORDER BY lock_history.timestamp DESC
        `);

        res.json(result.rows);  // Return all history rows
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve history' });
    }
});




module.exports = router;
