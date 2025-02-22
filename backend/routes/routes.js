const express = require('express');
const router = express.Router();

// Import controller files
const loginController = require('../controllers/loginController');
const googleLoginController = require('../controllers/googleLoginController');
const eventsController = require('../controllers/eventsController');
const usersController = require('../controllers/usersController');
const messagesController = require('../controllers/messagesController');
const serviceRequestsController = require('../controllers/serviceRequestsController');
const equipmentsController = require('../controllers/equipmentsController');

// Routes for login
router.post('/login', loginController.handleLogin);
router.post('/google-login', googleLoginController.googleLoginController);

// Routes for fetching and managing events
router.get('/events', eventsController.getEvents);

// Routes for users management
router.get('/users', usersController.getUsers);
router.post('/users', usersController.createUser);
router.delete('/users/:userId', usersController.deleteUser);

// Routes for service requests
router.get('/serviceRequests', serviceRequestsController.getServiceRequests);
router.put('/serviceRequests/:requestId/cancel', serviceRequestsController.cancelServiceRequest);

// Routes for fetching and managing equipment
router.get('/equipments', equipmentsController.getEquipments);

// Routes for messages
router.get('/messages', messagesController.getMessages);

// Export the router
module.exports = router;