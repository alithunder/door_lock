const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const lockRoutes = require('./routes/lock');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/lock', lockRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
