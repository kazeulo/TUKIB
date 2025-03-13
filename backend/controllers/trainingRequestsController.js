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
    partnerLab
  } = req.body;

  // Store necessary documents as an array
  const necessaryDocuments = req.files ? req.files.map(file => file.path) : [];

  try {
    // Insert into serviceRequestTable
    const serviceResult = await pool.query(
      `INSERT INTO serviceRequestTable 
       (user_id, service_name, status, payment_option, charged_to_project, project_title, project_budget_code, start, "end")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NULL) 
       RETURNING request_id`,
      [
        user_id,
        service_name,
        status,
        payment_option,
        charged_to_project,
        project_title,
        project_budget_code
      ]
    );

    // Retrieve the generated request_id
    const request_id = serviceResult.rows[0].request_id;

    // Insert into trainingRequests table
    const result = await pool.query(
      `INSERT INTO trainingRequests 
       (trainingTitle, trainingDate, participantCount, necessaryDocuments, acknowledgeTerms, partnerLab, request_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        trainingTitle,
        trainingDate,
        participantCount,
        necessaryDocuments,
        acknowledgeTerms,
        partnerLab,
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
