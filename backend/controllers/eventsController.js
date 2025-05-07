const pool = require('../backend'); // import pool

// GET all events
const getEvents = async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM events ORDER BY start_time');
		res.status(200).json({ events: result.rows });
	} catch (error) {
		console.error('Error fetching events:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

// POST new event
const createEvent = async (req, res) => {
	const {
		title,
		description,
		location,
		officer,
		start_time,
		end_time,
		recurrence,
	} = req.body;

	// Backend validation: ensure start_time and end_time are provided
	if (!start_time || !end_time) {
		return res.status(400).json({
			success: false,
			message: 'Start time and end time are required',
		});
	}

	try {
		const result = await pool.query(
			`INSERT INTO events (title, description, location, officer, start_time, end_time, recurrence)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING *`,
			[title, description, location, officer, start_time, end_time, recurrence]
		);

		res.status(201).json({ event: result.rows[0] });
	} catch (error) {
		console.error('Error inserting event into database:', error);
		res.status(500).json({ success: false, message: 'Could not create event' });
	}
};

const updateEvent = async (req, res) => {
	const { id } = req.params;
	const {
		title,
		description,
		location,
		officer,
		start_time,
		end_time,
		recurrence,
	} = req.body;

	try {
		const result = await pool.query(
			`UPDATE events
       SET title = $1, description = $2, location = $3, officer = $4,
           start_time = $5, end_time = $6, recurrence = $7
       WHERE id = $8
       RETURNING *`,
			[
				title,
				description,
				location,
				officer,
				start_time,
				end_time,
				recurrence,
				id,
			]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ message: 'Event not found' });
		}

		res.json({ event: result.rows[0] });
	} catch (error) {
		console.error('Error updating event:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

const deleteEvent = async (req, res) => {
	const { id } = req.params;
	console.log('Trying to delete event with id:', id);

	try {
		const result = await pool.query(
			'DELETE FROM events WHERE id = $1 RETURNING *',
			[id]
		);

		if (result.rows.length === 0) {
			console.log('No event found with that id.');
			return res.status(404).json({ message: 'Event not found' });
		}

		console.log('Deleted event:', result.rows[0]);
		res.status(200).json({ message: 'Event deleted successfully' });
	} catch (error) {
		console.error('Error deleting event:', error);
		res.status(500).json({ message: 'Server error', details: error.message });
	}
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
};
