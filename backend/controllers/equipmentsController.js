const pool = require('../backend');

// Get all equipment records
const getEquipments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM equipmentsTable');
        const equipments = result.rows;

        if (equipments.length > 0) {
            res.json({ status: 'success', equipments });
        } else {
            res.status(404).json({ message: 'No equipment found' });
        }
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getEquipments };
