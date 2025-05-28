const pool = require('../backend');

const getRestrictedDates = async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM calendar ORDER BY start_date');
		res.status(200).json({ events: result.rows });
	} catch (error) {
		console.error('Error fetching events:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

const addRestrictedDate = async (req, res) => {
	const {
		title,
		calendar_type,
		officer,
		start_date,
		end_date,
		description,
		is_restricted,
		restrict_equipment,
		recurrence,
		owner_ids = [],
	} = req.body;

	if (!title || !calendar_type || !start_date || !end_date) {
		return res.status(400).json({
			success: false,
			message: 'title, calendar_type, start_date, and end_date are required',
		});
	}

	const client = await pool.connect();

	try {
		await client.query('BEGIN');

		const calendarResult = await client.query(
			`INSERT INTO calendar (
				title,
				calendar_type,
				officer,
				start_date,
				end_date,
				is_restricted,
				restrict_equipment,
				description,
				recurrence
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
			RETURNING *`,
			[
				title,
				calendar_type,
				officer || null,
				start_date,
				end_date,
				is_restricted ?? false,
				restrict_equipment ?? false,
				description || null,
				recurrence || 'none',
			]
		);

		// ✅ Use correct field name from DB
		const calendarId = calendarResult.rows[0].calendar_id;

		for (const owner of owner_ids) {
			await client.query(
				`INSERT INTO calendar_owners (calendar_id, owner_id, owner_type)
				 VALUES ($1, $2, $3)`,
				[calendarId, owner.id, owner.type]
			);
		}

		await client.query('COMMIT');
		res.status(201).json({ event: calendarResult.rows[0] });
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Error inserting event:', error);
		res.status(500).json({ success: false, message: 'Could not create event' });
	} finally {
		client.release();
	}
};

module.exports = {
	getRestrictedDates,
    addRestrictedDate,
};