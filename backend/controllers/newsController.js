const pool = require('../backend'); // PostgreSQL connection pool
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/'); // Save files to 'uploads' directory
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const fileName = `${file.fieldname}-${Date.now()}${ext}`;
		cb(null, fileName);
	},
});

// Multer middleware for handling file uploads
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
		// Accept image files only
		if (!file.mimetype.startsWith('image/')) {
			return cb(new Error('Please upload an image file'), false);
		}
		cb(null, true);
	},
});

// Fetch all news
const getNews = async (req, res) => {
	try {
		const result = await pool.query(
			'SELECT * FROM newstable ORDER BY date DESC'
		); // Order by date
		const newsItems = result.rows;

		if (newsItems.length > 0) {
			res.json({ status: 'success', newsItems });
		} else {
			res.status(404).json({ message: 'No news found' });
		}
	} catch (error) {
		console.error('Error fetching news:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Add new news (image upload handled by multer)
const addNews = async (req, res) => {
	const { title, content, category } = req.body;
	const image = req.file ? req.file.filename : null;

	// Validation: check if required fields are present
	if (!title || !content || !category) {
		return res
			.status(400)
			.json({ message: 'Please provide title, content, and category' });
	}

	try {
		const result = await pool.query(
			'INSERT INTO newstable (title, content, category, image, date) VALUES ($1, $2, $3, $4, NOW()) RETURNING *',
			[title, content, category, image]
		);

		const newNews = result.rows[0];
		res.status(201).json({
			status: 'success',
			message: 'News added successfully',
			news: newNews,
		});
	} catch (error) {
		console.error('Error adding news:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Update news
const updateNews = async (req, res) => {
	const { newsId } = req.params;
	const { title, content, category } = req.body;
	const image = req.file ? req.file.filename : null;

	// Validation: check if required fields are present
	if (!title || !content || !category) {
		return res
			.status(400)
			.json({ message: 'Please provide title, content, and category' });
	}

	try {
		const result = await pool.query(
			'UPDATE newstable SET title = $1, content = $2, category = $3, image = COALESCE($4, image), date = NOW() WHERE news_id = $5 RETURNING *',
			[title, content, category, image, newsId]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'News not found' });
		}

		const updatedNews = result.rows[0];
		res.json({
			status: 'success',
			message: 'News updated successfully',
			news: updatedNews,
		});
	} catch (error) {
		console.error('Error updating news:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Delete news
const deleteNews = async (req, res) => {
	const { newsId } = req.params;

	try {
		const result = await pool.query(
			'DELETE FROM newstable WHERE news_id = $1 RETURNING *',
			[newsId]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'News not found' });
		}

		res.json({
			status: 'success',
			message: 'News deleted successfully',
			news: result.rows[0],
		});
	} catch (error) {
		console.error('Error deleting news:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

module.exports = {
	getNews,
	addNews: [upload.single('image'), addNews], // Apply multer middleware for image upload
	updateNews: [upload.single('image'), updateNews], // Apply multer middleware for image upload
	deleteNews,
};
