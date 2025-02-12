const pool = require('../backend'); 

const getServiceRequests = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM serviceRequestTable');
        console.log('Database query result:', result); 

        const serviceRequests = result.rows;

        if (serviceRequests.length > 0) {
            console.log('Fetched service:', serviceRequests);  
            res.json({ status: 'success', serviceRequests}); 
        } else {
            console.log('No data found');
            res.status(404).json({ message: 'No data found' }); 
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = { getServiceRequests };