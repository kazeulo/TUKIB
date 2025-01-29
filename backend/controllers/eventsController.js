const pool = require('../backend');  // import ppol

const getEvents = async (req, res) => {
  try {
    // Query the database to fetch events
    const result = await pool.query('SELECT * FROM events');

    res.status(200).json({ events: result.rows });
  } catch (error) {
    console.error('Error querying the database', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getEvents };
