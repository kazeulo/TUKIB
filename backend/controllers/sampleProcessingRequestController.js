const pool = require("../backend");
const path = require("path");

// Function to create a new Sample Processing Request
const createSampleProcessingRequest = async (req, res) => {
  try {
    console.log("File Info:", req.files);

    const {
      user_id,
      service_name = "Sample processing",
      status = "Pending for approval",
      payment_option,
      project_title = null,
      project_budget_code = null,
      laboratory,
      typeOfAnalysis,
      sampleType,
      sampleDescription,
      sampleVolume = null,
      methodSettings,
      sampleHazardDescription,
      scheduleSampleSubmission,
      additionalInformation = null,
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

    // Insert into sampleProcessingRequests table
    const result = await pool.query(
      `INSERT INTO sampleProcessingRequests 
       (laboratory, type_of_analysis, sample_type, sample_description, sample_volume, method_settings, sample_hazard_description, schedule_of_sample_submission, additional_information, necessaryDocuments, proofOfFunds, paymentConforme, request_id, project_title, project_budget_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
       RETURNING *`,
      [
        laboratory,
        typeOfAnalysis,
        sampleType,
        sampleDescription,
        sampleVolume,
        methodSettings,
        sampleHazardDescription,
        scheduleSampleSubmission,
        additionalInformation,
        necessaryDocuments,
        proofOfFunds,
        paymentConforme,
        request_id,
        project_title,
        project_budget_code,
      ]
    );

    return res.status(201).json({
      message: "Sample Processing Request created successfully!",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    return res
      .status(500)
      .json({ message: "Error creating Sample Processing Request" });
  }
};

module.exports = { createSampleProcessingRequest };