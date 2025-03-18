const pool = require('../backend');

const getServiceRequests = async (req, res) => {
	try {
		// Join serviceRequestTable with usersTable to get the user name
		const result = await pool.query(
			`SELECT sr.request_id, sr.user_id, sr.service_name, sr.status, sr.payment_option, 
			        sr.start, sr."end", u.name AS user_name
			 FROM serviceRequestTable sr
			 JOIN usersTable u ON sr.user_id = u.user_id`
		);
		
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

const cancelServiceRequest = async (req, res) => {
	const { requestId } = req.params;

	try {
		// Update the status to 'Cancelled' for the given request ID
		const result = await pool.query(
			'UPDATE serviceRequestTable SET status = $1 WHERE request_id = $2 RETURNING *',
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

const getServiceRequestById = async (req, res) => {
	const { id } = req.params;

	if (!id || isNaN(id)) {
		return res.status(400).json({ status: 'error', message: 'Invalid request ID' });
	}

	try {
		const result = await pool.query(
			`SELECT sr.request_id, sr.user_id, sr.service_name, sr.status, sr.payment_option, 
			        sr.start, sr."end", u.name AS user_name
			 FROM serviceRequestTable sr
			 JOIN usersTable u ON sr.user_id = u.user_id
			 WHERE sr.request_id = $1`, [id]
		);

		if (result.rows.length === 0) {
			return res.status(404).json({ status: 'error', message: 'Service request not found' });
		}
		return res.status(200).json({
			status: 'success',
			serviceRequest: result.rows[0],
		});
	} catch (error) {
		console.error('Error fetching service request by ID:', error);
		return res.status(500).json({ status: 'error', message: 'Server error while fetching service request' });
	}
};

module.exports = {
	getServiceRequests,
	cancelServiceRequest,
	getServiceRequestById,
};