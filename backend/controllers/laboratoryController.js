const pool = require('../backend');

// Get all laboratories
const getLaboratories = async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM laboratories ORDER BY laboratory_name ASC');
		res.json({ status: 'success', laboratories: result.rows });
	} catch (error) {
		console.error('Error fetching laboratories:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const getLaboratoryById = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			'SELECT * FROM laboratories WHERE laboratory_id = $1',
			[id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ status: 'error', message: 'Laboratory not found' });
		}

		res.json({ status: 'success', laboratory: result.rows[0] });
	} catch (error) {
		console.error('Error fetching laboratory by ID:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

module.exports = {
	getLaboratories,
	getLaboratoryById
};
