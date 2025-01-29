// backend/server.js
const express = require('express');
const cors = require('cors');

// controller files
const loginController = require('./controllers/loginController');
const eventsController = require('./controllers/eventsController');

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// Route for handling login
app.post('/api/login', loginController.handleLogin);

// Endpoint to fetch events from the database
app.get('/api/events', eventsController.getEvents);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
