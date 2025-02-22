const pool = require('../backend');

// Get all messages
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

// Store a new message
const insertMessage = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const query = `
            INSERT INTO messagesTable (subject, sender, sender_email, body, remarks)
            VALUES ($1, $2, $3, $4, 'unread')
        `;
        const values = [subject, name, email, message];

        await pool.query(query, values);

        res.status(201).json({ status: 'success', message: 'Message submitted successfully' });
    } catch (error) {
        console.error('Error storing message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getMessages, insertMessage };
