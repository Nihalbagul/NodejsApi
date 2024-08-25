require('dotenv').config();
const express = require('express');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/schools', schoolRoutes);

const PORT =   3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
