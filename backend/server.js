require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // To handle image uploads
const path = require('path');
const routes = require('./routes/routes');

const app = express();

// Middleware
app.use(cors());

// Increase the body size limit for large content and files
app.use(express.json({ limit: '50mb' })); // Increase limit for JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration to handle file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); // Save the files in the 'uploads' folder
	},
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${file.originalname}`;
		cb(null, uniqueName); // Create unique filename for the uploaded file
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Set a limit of 5MB for image uploads
}).single('image');

// Route to handle image uploads
app.post('/api/news/upload_image', (req, res) => {
	upload(req, res, function (err) {
		if (err instanceof multer.MulterError) {
			// Handle multer-specific errors
			return res.status(413).json({ message: 'File too large' });
		} else if (err) {
			// Handle other errors
			return res.status(500).json({ message: 'Error uploading image' });
		}

		// Send the file path as the response
		res.status(200).json({ data: `/uploads/${req.file.filename}` });
	});
});

// Use the routes defined in the routes folder
app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
