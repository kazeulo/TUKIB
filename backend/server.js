require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const routes = require('./routes/routes');

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

// Use the routes defined in the routes folder
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
