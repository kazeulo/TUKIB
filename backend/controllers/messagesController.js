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

const updateMessageStatus = async (req, res) => {
    const messageId = req.params.messageId;

    try {
        // Update status to 'read'
        const query = `
            UPDATE messagesTable
            SET remarks = 'read'
            WHERE message_id = $1
            RETURNING *;
        `;
        const values = [messageId];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.json({
                status: 'success',
                message: result.rows[0], 
            });
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        console.error('Error updating message status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get a message by ID (for message details page)
const getMessageDetails = async (req, res) => {
    const messageId = req.params.messageId;

    try {
        const result = await pool.query('SELECT * FROM messagesTable WHERE message_id = $1', [messageId]);

        if (result.rows.length > 0) {
            res.json({ status: 'success', message: result.rows[0] });
        } else {
            res.status(404).json({ status: 'error', message: 'Message not found' });
        }
    } catch (error) {
        console.error('Error fetching message details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getMessages, insertMessage, updateMessageStatus, getMessageDetails };

