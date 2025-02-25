const pool = require('../backend'); // Assuming you have a PostgreSQL pool connection set up

// Function to add news to the database
const addNews = async (req, res) => {
	try {
		const { title, content, category } = req.body;

		// Basic validation: Ensure all required fields are provided
		if (!title || !content || !category) {
			return res
				.status(400)
				.json({ message: 'Title, content, and category are required.' });
		}

		const date = new Date().toISOString(); // Get the current date

		// Insert the news item into the database
		const result = await pool.query(
			'INSERT INTO news (title, content, category, date) VALUES ($1, $2, $3, $4) RETURNING *',
			[title, content, category, date]
		);

		// Respond with the newly inserted news data
		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error('Error adding news:', err);

		// Handle payload too large
		if (err.code === '413') {
			return res.status(413).json({
				message: 'Payload too large. Consider reducing the content size.',
			});
		}

		// Handle other errors
		res.status(500).json({ message: 'Error adding news' });
	}
};

// Function to get news from the database
const getNews = async (req, res) => {
	try {
		// Query the database to get all news articles, ordered by most recent first
		const result = await pool.query('SELECT * FROM news ORDER BY date DESC');

		// Return the news list as a JSON response
		res.status(200).json(result.rows);
	} catch (err) {
		console.error('Error fetching news:', err);
		res.status(500).json({ message: 'Error fetching news' });
	}
};

// Function to handle image upload
const uploadImage = (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'No file uploaded.' });
		}

		// Send back the uploaded image URL
		const imageUrl = `/uploads/${req.file.filename}`;
		res.status(200).json({ data: imageUrl });
	} catch (err) {
		console.error('Error uploading image:', err);
		res.status(500).json({ message: 'Error uploading image' });
	}
};

module.exports = { addNews, getNews, uploadImage };
