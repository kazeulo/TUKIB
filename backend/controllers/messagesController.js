const pool = require('../backend'); 

const getMessages = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM messagesTable');

        const messages = result.rows;

        if (messages.length > 0) {
            res.json({ status: 'success', messages }); 
        } else {
            res.status(404).json({ message: 'No data found' }); 
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { getMessages };