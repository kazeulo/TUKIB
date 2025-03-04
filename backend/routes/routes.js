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
const newsController = require('../controllers/newsController');

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
router.put(
	'/serviceRequests/:requestId/cancel',
	serviceRequestsController.cancelServiceRequest
);

// Routes for fetching and managing equipment
router.get('/equipments', equipmentsController.getEquipments);

// Routes for messages
router.get('/messages', messagesController.getMessages);
router.post('/messages/submit', messagesController.insertMessage);
router.get('/messages/:messageId/read', messagesController.updateMessageStatus);
router.get('/messages/:messageId', messagesController.getMessageDetails);

// Routes for news management
router.post('/news', newsController.addNews);
router.get('/news', newsController.getNews);

// Export the router
module.exports = router;
