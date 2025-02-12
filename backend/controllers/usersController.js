const pool = require('../backend'); 

const getUsers = async (req, res) => {
    try {
        console.log('Fetching users...');
        const result = await pool.query('SELECT * FROM usersTable');
        console.log('Database query result:', result); 

        const users = result.rows; // Extract rows from the result

        if (users.length > 0) {
            console.log('Fetched users:', users);  // Log the users data
            res.json({ status: 'success', users });  // Send the response with users
        } else {
            console.log('No users found');
            res.status(404).json({ message: 'No users found' });  // Send 404 if no users found
        }
    } catch (error) {
        console.error('Error fetching users:', error);  // Log detailed error information
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { getUsers };
