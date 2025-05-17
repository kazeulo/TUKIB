const pool = require('../backend');
const generateRequestCode = require('./utils/codeGenerator');

// Function to create a new facility rental request
const createFacilityRentalRequest = async (req, res) => {
	try {
		console.log('File Info:', req.files);

		const {
			user_id,
			payment_option,
			project_title = null,
			project_budget_code = null,
			selectedFacility,
			purpose_of_use,
			service_name,
			status,
			startOfUse,
			endOfUse,
			participantCount,
			acknowledgeTerms = false,
			additionalInformation = null,
		} = req.body;

		const requestCode = await generateRequestCode(service_name);

		// Handle file uploads and generate public URLs
		const necessaryDocuments = req.files?.necessaryDocuments
			? req.files.necessaryDocuments.map(
					(file) => `/uploads/necessaryDocuments/${file.filename}`
			  )
			: [];

		const proofOfFunds = req.files?.proofOfFunds
			? `/uploads/proofOfFunds/${req.files.proofOfFunds[0].filename}`
			: null;

		const paymentConforme = req.files?.paymentConforme
			? `/uploads/paymentConforme/${req.files.paymentConforme[0].filename}`
			: null;

		// Insert into serviceRequestTable
		const serviceResult = await pool.query(
			`INSERT INTO serviceRequestTable 
       (user_id, service_name, request_code, status, payment_option, start, "end")
       VALUES ($1, $2, $3, $4, $5, NOW(), NULL) 
       RETURNING request_id`,
			[user_id, service_name, requestCode, status, payment_option]
		);

		// Retrieve the generated request_id
		const request_id = serviceResult.rows[0].request_id;

		// Insert into trainingRequests table
		const result = await pool.query(
			`INSERT INTO facilityRentalRequests 
       (request_id, selected_facility, purpose_of_use, start_of_use, end_of_use, participant_count, project_title, project_budget_code, 
        proofOfFunds, paymentConforme, additional_information, necessaryDocuments, acknowledge_terms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
       RETURNING *`,
			[
				request_id,
				selectedFacility,
				purpose_of_use,
				startOfUse,
				endOfUse,
				participantCount,
				project_title,
				project_budget_code,
				proofOfFunds,
				paymentConforme,
				additionalInformation,
				necessaryDocuments,
				acknowledgeTerms,
			]
		);

		// Get user name for notification
		const userResult = await pool.query(
			`SELECT name FROM usersTable WHERE user_id = $1`,
			[user_id]
		);

		const userName = userResult.rows[0]?.name || 'Unknown User';

		// Insert notification for admin with service_name and request_id
		await pool.query(
			`INSERT INTO notifications (user_id, message, service_name, request_id)
	 VALUES ($1, $2, $3, $4)`,
			[
				user_id,
				`You have a new ${service_name} request from ${userName}`,
				service_name, // exact service name string (e.g. "Use of Equipment")
				request_id, // the generated request_id
			]
		);

		return res.status(201).json({
			message: 'Use of facility request created successfully!',
			data: result.rows[0],
		});
	} catch (error) {
		console.error('Error inserting data:', error);
		return res.status(500).json({ message: 'Error creating training request' });
	}
};

module.exports = { createFacilityRentalRequest };
