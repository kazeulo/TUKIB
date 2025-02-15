// backend/server.js
const express = require('express');
const cors = require('cors');

// controller files
const loginController = require('./controllers/loginController');
const eventsController = require('./controllers/eventsController');
const usersController = require('./controllers/usersController');
const messagesController = require('./controllers/messagesController');
const serviceRequestsController = require('./controllers/serviceRequestsController');

const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Route for handling login
app.post('/api/login', loginController.handleLogin);

// Endpoint to fetch events from the database
app.get('/api/events', eventsController.getEvents);

// Endpoint to fetch users from the database
app.get('/api/users', usersController.getUsers);

// Endpoint to add users to the database
app.post('/api/users', usersController.createUser);

// Endpoint to delete users from the database
app.delete('/api/users/:userId', usersController.deleteUser);

// Endpoint to fetch service requests
app.get('/api/serviceRequests', serviceRequestsController.getServiceRequests);

// Endpoint to cancel a service request (update status to 'Cancelled')
app.put(
	'/api/serviceRequests/:requestId/cancel',
	serviceRequestsController.cancelServiceRequest
);

// Endpoint to fetch messages from the database
app.get('/api/messages', messagesController.getMessages);

// Start server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
