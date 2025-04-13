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
const sampleProcessingRequestController = require('../controllers/sampleProcessingRequestController');
const equipmentRentalRequestController = require('../controllers/equipmentRentalRequestController');
const facilityRentalRequestsController = require('../controllers/facilityRentalRequestController');

// Routes for login
router.post('/login', loginController.handleLogin);
router.post('/google-login', googleLoginController.googleLoginController);

// Routes for fetching and managing events
router.get('/events', eventsController.getEvents);

// Routes for users management
router.get('/users', usersController.getUsers);
router.get('/users/:userId', usersController.getUserById);
router.post('/users', usersController.createUser);
router.delete('/users/:userId', usersController.deleteUser);

// Routes for fetching and managing equipment
router.get('/equipments', equipmentsController.getEquipments);

// Routes for messages
router.get('/messages', messagesController.getMessages);
router.post('/messages/submit', messagesController.insertMessage);
router.get('/messages/:messageId/read', messagesController.updateMessageStatus);
router.get('/messages/:messageId', messagesController.getMessageDetails);

// Routes for news management
router.post('/news', newsController.createNews);
router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getNewsById);
router.put('/news/:id', newsController.updateNews);
router.delete('/news/:id', newsController.deleteNews);

// Routes for service requests
router.get('/serviceRequests', serviceRequestsController.getServiceRequests);
router.get('/serviceRequests/:userId', serviceRequestsController.getServiceRequestsById);
router.put('/serviceRequests/:requestId/cancel', serviceRequestsController.cancelServiceRequest);
router.get('/useOfEquipmentRequestDetails/:id', serviceRequestsController.getEquipmentRentalRequestById);
router.get('/useOfFacilityRequestDetails/:id', serviceRequestsController.getFacilityRentalRequestById);
router.get('/trainingRequestDetails/:id', serviceRequestsController.getTrainingRequestById);
router.get('/sampleProcessingRequestDetails/:id', serviceRequestsController.getSampleProcessingRequestById);

// facility
router.get('/facility-bookings', facilityRentalRequestsController.getFacilitySchedule);

// Route for training requests
router.post('/training-requests', upload, async (req, res) => {
    console.log('Files received:', req.files);
    console.log('Body received:', req.body);
    try {
        await trainingRequestsController.createTrainingRequest(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error processing the request' });
    }
});

// Route for sample processing requests
router.post('/sample-processing-requests', upload, async (req, res) => {
    console.log('Files received:', req.files);
    console.log('Body received:', req.body);
    try {
        await sampleProcessingRequestController.createSampleProcessingRequest(req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error processing the request' });
    }
});

// Route for equipment rental requests
router.post('/equipment-rental-requests', upload, async (req, res) => {
    console.log('Files received:', req.files);
    console.log('Body received:', req.body);
    try {
        await equipmentRentalRequestController.createEquipmentRentalRequest (req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error processing the request' });
    }
});

router.post('/facility-rental-requests', upload, async (req, res) => {
    console.log('Files received:', req.files);
    console.log('Body received:', req.body);
    try {
        await facilityRentalRequestsController.createFacilityRentalRequest (req, res);
    } catch (error) {
        res.status(500).json({ message: 'Error processing the request' });
    }
});

// Export the router
module.exports = router;
