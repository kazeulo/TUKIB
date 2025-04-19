const pool = require('../backend');

// Function to create a new training request
const createTrainingRequest = async (req, res) => {
  try {
    console.log('File Info:', req.files);

    const {
      user_id,
      service_name = 'training',
      status = 'pending',
      payment_option,
      project_title = null,
      project_budget_code = null,
      trainingTitle,
      trainingDate,
      participantCount,
      acknowledgeTerms = false,
      partnerLab,
      additionalInformation = null
    } = req.body;

    // Handle file uploads and generate public URLs
    const necessaryDocuments = req.files?.necessaryDocuments
      ? req.files.necessaryDocuments.map((file) => `/uploads/necessaryDocuments/${file.filename}`)
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
       (user_id, service_name, status, payment_option, start, "end")
       VALUES ($1, $2, $3, $4, NOW(), NULL) 
       RETURNING request_id`,
      [user_id, service_name, status, payment_option]
    );

    // Retrieve the generated request_id
    const request_id = serviceResult.rows[0].request_id;

    // Insert into trainingRequests table
    const result = await pool.query(
      `INSERT INTO trainingRequests 
       (trainingTitle, trainingDate, participantCount, acknowledgeTerms, partnerLab, project_title, project_budget_code, proofOfFunds, paymentConforme, additionalInformation, necessaryDocuments, request_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        trainingTitle,
        trainingDate,
        participantCount,
        acknowledgeTerms,
        partnerLab,
        project_title,
        project_budget_code,
        proofOfFunds,
        paymentConforme,
        additionalInformation,
        necessaryDocuments,
        request_id
      ]
    );

    return res.status(201).json({
      message: 'Training request created successfully!',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    return res.status(500).json({ message: 'Error creating training request' });
  }
};

module.exports = { createTrainingRequest };