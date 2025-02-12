const pool = require('../backend'); 

const getMessages = async (req, res) => {
    try {
        console.log('Fetching messages...');
        const result = await pool.query('SELECT * FROM messagesTable');
        console.log('Database query result:', result); 

        const messages = result.rows;

        if (messages.length > 0) {
            console.log('Fetched messages:', messages);  
            res.json({ status: 'success', messages }); 
        } else {
            console.log('No data found');
            res.status(404).json({ message: 'No data found' }); 
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { getMessages };