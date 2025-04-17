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

module.exports = {
	getLaboratories,
};
