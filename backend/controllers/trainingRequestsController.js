const pool = require('../backend');

// Function to create a new training request
const createTrainingRequest = async (req, res) => {
  console.log('File Info:', req.files);

  const {
    user_id,
    service_name,
    status,
    payment_option,
    charged_to_project,
    project_title,
    project_budget_code,
    trainingTitle,
    trainingDate,
    participantCount,
    acknowledgeTerms,
    partnerLab,
    additionalInformation
  } = req.body;

  const necessaryDocuments = req.files['necessaryDocuments']
    ? req.files['necessaryDocuments'].map(file => file.path)
    : [];

  const proofOfFunds = req.files['proofOfFunds'] ? req.files['proofOfFunds'][0].path : null;
  const paymentConforme = req.files['paymentConforme'] ? req.files['paymentConforme'][0].path : null;


  try {
    // Insert into serviceRequestTables
    const serviceResult = await pool.query(
      `INSERT INTO serviceRequestTable 
       (user_id, service_name, status, payment_option, charged_to_project, start, "end")
       VALUES ($1, $2, $3, $4, $5, NOW(), NULL) 
       RETURNING request_id`,
      [
        user_id,
        service_name,
        status,
        payment_option,
        charged_to_project,
      ]
    );

    // Retrieve the generated request_id
    const request_id = serviceResult.rows[0].request_id;

    // Insert into trainingRequests table
    const result = await pool.query(
      `INSERT INTO trainingRequests 
       (trainingTitle, trainingDate, participantCount, necessaryDocuments, proofOfFunds, paymentConforme, acknowledgeTerms, partnerLab, request_id, project_title, project_budget_code, additionalInformation)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        trainingTitle,
        trainingDate,
        participantCount,
        necessaryDocuments,
        proofOfFunds,
        paymentConforme,
        acknowledgeTerms,
        partnerLab,
        request_id,
        project_title,
        project_budget_code,
        additionalInformation
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