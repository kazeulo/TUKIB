const { request } = require('express');
const pool = require('../backend');

// Function to create a new training request
const createFacilityRentalRequest = async (req, res) => {
  try {
    console.log('File Info:', req.files);

    const {
      user_id,
      payment_option,
      project_title = null,
      project_budget_code = null,
      selectedFacility,
      service_name,
      status,
      startOfUse,
      endOfUse,
      participantCount,
      acknowledgeTerms = false,
      additionalInformation = null
    } = req.body;

    // Handle file uploads
    const necessaryDocuments = req.files?.['necessaryDocuments']
      ? req.files['necessaryDocuments'].map(file => file.path)
      : [];

    const proofOfFunds = req.files?.['proofOfFunds']?.[0]?.path || null;
    const paymentConforme = req.files?.['paymentConforme']?.[0]?.path || null;

    // Insert into serviceRequestTable
    const serviceResult = await pool.query(
      `INSERT INTO serviceRequestTable 
       (user_id, service_name, status, payment_option, start, "end")
       VALUES ($1, $2, $3, $4, NOW(), NULL) 
       RETURNING request_id`,
      [user_id, service_name, status, payment_option]
    );

    // Retrieve the generated request_id
    const request_id = serviceResult.rows[0].request_id;

    // Insert into trainingRequests table
    const result = await pool.query(
      `INSERT INTO facilityRentalRequests 
       (request_id, selected_facility, start_of_use, end_of_use, participant_count, project_title, project_budget_code, 
        proofOfFunds, paymentConforme, additional_information, necessaryDocuments, acknowledge_terms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        request_id,
        selectedFacility,
        startOfUse,
        endOfUse,
        participantCount,
        project_title,
        project_budget_code,
        proofOfFunds,
        paymentConforme,
        additionalInformation,
        necessaryDocuments,
        acknowledgeTerms
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