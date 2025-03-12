const pool = require('../backend');

// Function to create a new training request
const createTrainingRequest = async (req, res) => {
    console.log('File Info:', req.file);

  const {
    user_id,
    trainingTitle,
    trainingDate,
    participantCount,
    acknowledgeTerms,
    partnerLab
  } = req.body;

  const necessaryDocuments = req.files ? req.files.map(file => file.path) : [];
  console.log('Necessary Documents Path:', necessaryDocuments);

  try {
    // Insert the new training request into the database
    const result = await pool.query(
      `INSERT INTO trainingRequests (user_id, trainingTitle, trainingDate, participantCount, necessaryDocuments, acknowledgeTerms, partnerLab)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        user_id,
        trainingTitle,
        trainingDate,
        participantCount,
        necessaryDocuments.join(','), 
        acknowledgeTerms,
        partnerLab,
      ]
    );

    // Respond with the newly inserted request
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
