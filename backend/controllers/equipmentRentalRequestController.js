const pool = require('../backend');
const generateRequestCode = require('./utils/codeGenerator');

// Function to create a new equipment rental request
const createEquipmentRentalRequest = async (req, res) => {
	try {
		console.log('File Info:', req.files);

		const {
			user_id,
			service_name = 'Use of Equipment',
			status = 'Pending for approval',
			payment_option,
			project_title = null,
			project_budget_code = null,
			authorizedRepresentative,
			laboratory,
			equipmentName,
			equipmentSettings,
			sampleType,
			sampleDescription,
			sampleVolume,
			sampleHazardDescription,
			scheduleOfUse,
			estimatedUseDuration,
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

		// Insert into equipment rental requests table
		const result = await pool.query(
			`INSERT INTO equipmentRentalRequests 
       (request_id, authorized_representative, laboratory, equipment_name, equipment_settings, sample_type, sample_description, 
       sample_volume, sample_hazard_description, schedule_of_use, estimated_use_duration, proofOfFunds, paymentConforme, 
       project_title, project_budget_code, additional_information, necessaryDocuments)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) 
       RETURNING *`,
			[
				request_id,
				authorizedRepresentative,
				laboratory,
				equipmentName,
				equipmentSettings,
				sampleType,
				sampleDescription,
				sampleVolume,
				sampleHazardDescription,
				scheduleOfUse,
				estimatedUseDuration,
				proofOfFunds,
				paymentConforme,
				project_title,
				project_budget_code,
				additionalInformation,
				necessaryDocuments,
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
			message: 'Equipment Rental Request created successfully!',
			data: result.rows[0],
		});
	} catch (error) {
		console.error('Error inserting data:', error);
		return res
			.status(500)
			.json({ message: 'Error creating Equipment Rental Request' });
	}
};

module.exports = { createEquipmentRentalRequest };
