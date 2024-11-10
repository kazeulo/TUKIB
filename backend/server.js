const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// PostgreSQL connection pool setup
const pool = new Pool({
	user: 'kanon',
	host: 'localhost',
	database: 'tukib_db',
	password: '123456789',
	port: 5432,
});

// Sample route for handling login
app.post('/api/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		// Query the database to check for valid user credentials
		const result = await pool.query(
			'SELECT * FROM users WHERE username = $1 AND password = $2',
			[username, password]
		);

		if (result.rows.length > 0) {
			// If user is found
			res.status(200).json({ success: true, message: 'Login successful' });
		} else {
			// If user not found or wrong credentials
			res.status(401).json({ success: false, message: 'Invalid credentials' });
		}
	} catch (error) {
		console.error('Error querying the database', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
});

// Endpoint to fetch events from the database
app.get('/api/events', async (req, res) => {
	try {
		// Query the database to fetch events
		const result = await pool.query('SELECT * FROM events');

		// Send the events data as a response
		res.status(200).json({ events: result.rows });
	} catch (error) {
		console.error('Error querying the database', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
