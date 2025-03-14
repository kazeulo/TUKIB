const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');

// Import controller files
const loginController = require('../controllers/loginController');
const googleLoginController = require('../controllers/googleLoginController');
const eventsController = require('../controllers/eventsController');
const usersController = require('../controllers/usersController');
const messagesController = require('../controllers/messagesController');
const serviceRequestsController = require('../controllers/serviceRequestsController');
const equipmentsController = require('../controllers/equipmentsController');
const newsController = require('../controllers/newsController');
const trainingRequestsController = require('../controllers/trainingRequestsController');

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

// Route for training requests
router.post('/training-requests', upload, async (req, res) => {
    console.log('Files received:', req.files); // Log incoming files
    console.log('Body received:', req.body);
    try {
        // Call the controller function to handle the request creation
        await trainingRequestsController.createTrainingRequest(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error processing the request' });
    }
});

// Export the router
module.exports = router;