const pool = require('../backend'); // PostgreSQL connection pool

// Fetch all service requests
const getServiceRequests = async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM serviceRequestTable'); // Corrected the table name
		const serviceRequests = result.rows;

		if (serviceRequests.length > 0) {
			res.json({ status: 'success', serviceRequests });
		} else {
			res.status(404).json({ message: 'No service requests found' });
		}
	} catch (error) {
		console.error('Error fetching service requests:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Cancel a service request
const cancelServiceRequest = async (req, res) => {
	const { requestId } = req.params;

	try {
		// Update the status to 'Cancelled' for the given request ID
		const result = await pool.query(
			'UPDATE serviceRequestTable SET status = $1 WHERE request_id = $2 RETURNING *', // Corrected the table name
			['Cancelled', requestId]
		);

		// Check if the request exists
		if (result.rows.length === 0) {
			return res
				.status(404)
				.json({ status: 'error', message: 'Service request not found' });
		}

		// Send success response
		return res.status(200).json({
			status: 'success',
			message: 'Service request cancelled',
			serviceRequest: result.rows[0],
		});
	} catch (error) {
		console.error('Error cancelling service request:', error);
		return res.status(500).json({ status: 'error', message: 'Server error' });
	}
};

module.exports = {
	getServiceRequests, // Ensure this function is exported
	cancelServiceRequest,
};
