const pool = require('../backend');

const getServiceRequests = async (req, res) => {
	try {
		// Join serviceRequestTable with usersTable to get the user name
		const result = await pool.query(
			`SELECT sr.request_id, sr.user_id, sr.service_name, sr.status, sr.payment_option, sr.request_code,
			        sr.start, sr."end", sr.rejection_reason, u.name AS user_name
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

const getServiceRequestsById = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const result = await pool.query(
        `SELECT 
            sr.request_id, 
            sr.service_name, 
            sr.status, 
            sr.request_code,
            sr.payment_option, 
            sr.start, 
            sr."end", 
            sr.rejection_reason,
            u.name AS user_name
         FROM serviceRequestTable sr
         JOIN usersTable u ON sr.user_id = u.user_id
         WHERE sr.user_id = $1`, 
        [userId]
      );
  
      const serviceRequests = result.rows;
  
      if (serviceRequests.length > 0) {
        res.json({ status: 'success', serviceRequests });
      } else {
        res.status(404).json({ message: 'No service requests found for this user' });
      }
    } catch (error) {
      console.error('Error fetching service requests:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
const cancelServiceRequest = async (req, res) => {
	const { requestId } = req.params;

	try {
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

// const getServiceRequestById = async (req, res) => {
// 	const { id } = req.params;

// 	if (!id || isNaN(id)) {
// 		return res.status(400).json({ status: 'error', message: 'Invalid request ID' });
// 	}

// 	try {
// 		const result = await pool.query(
// 			`SELECT sr.request_id, sr.user_id, sr.service_name, sr.status, sr.payment_option, 
// 			        sr.start, sr."end", u.name AS user_name
// 			 FROM serviceRequestTable sr
// 			 JOIN usersTable u ON sr.user_id = u.user_id
// 			 WHERE sr.request_id = $1`, [id]
// 		);

// 		if (result.rows.length === 0) {
// 			return res.status(404).json({ status: 'error', message: 'Service request not found' });
// 		}
// 		return res.status(200).json({
// 			status: 'success',
// 			serviceRequest: result.rows[0],
// 		});
// 	} catch (error) {
// 		console.error('Error fetching service request by ID:', error);
// 		return res.status(500).json({ status: 'error', message: 'Server error while fetching service request' });
// 	}
// };

const getTrainingRequestById = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid request ID' });
    }

    try {
        const result = await pool.query(
            `SELECT 
                sr.request_id, 
                sr.user_id, 
                sr.service_name, 
                sr.status, 
                sr.payment_option, 
                sr.start, 
                sr."end", 
                sr.rejection_reason,
                sr.request_code,
                sr.charge_slip,
                u.name AS user_name,
                u.institution AS user_institution,
                approver.name AS approver_name,
                tr.trainingTitle, 
                tr.trainingDate, 
                tr.participantCount, 
                tr.acknowledgeTerms, 
                tr.partnerLab, 
                tr.project_title, 
                tr.project_budget_code, 
                tr.proofOfFunds, 
                tr.paymentConforme, 
                tr.additionalInformation, 
                tr.necessaryDocuments
             FROM serviceRequestTable sr
             JOIN usersTable u ON sr.user_id = u.user_id
             LEFT JOIN usersTable approver ON sr.approved_by = approver.user_id
             LEFT JOIN trainingRequests tr ON sr.request_id = tr.request_id
             WHERE sr.request_id = $1`, [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Service request not found' });
        }
        
        const trainingRequest = result.rows[0]

        if (typeof trainingRequest.necessarydocuments === 'string') {
            trainingRequest.necessarydocuments = trainingRequest.necessarydocuments
            .replace(/[{}"]/g, '')
            .split(',')
            .map(doc => doc.trim());
        }

		// console.log('Result', result)

        return res.status(200).json({
            status: 'success',
            serviceRequest: result.rows[0],
        });
    } catch (error) {
        console.error('Error fetching service request by ID:', error);
        return res.status(500).json({ status: 'error', message: 'Server error while fetching service request' });
    }
};

const getEquipmentRentalRequestById = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid request ID' });
    }

    try {
        const result = await pool.query(
            `SELECT 
                sr.request_id, 
                sr.user_id, 
                sr.service_name, 
                sr.status, 
                sr.payment_option, 
                sr.start, 
                sr."end", 
                sr.rejection_reason,
                sr.request_code,
                sr.charge_slip,
                u.name AS user_name,
                u.institution AS user_institution,
                approver.name AS approver_name,
                err.authorized_representative, 
                err.laboratory, 
                err.equipment_name, 
                err.equipment_settings,
                err.sample_type, 
                err.sample_description, 
                err.sample_volume, 
                err.sample_hazard_description,
                err.schedule_of_use, 
                err.estimated_use_duration, 
                err.project_title, 
                err.project_budget_code, 
                err.proofOfFunds, 
                err.paymentConforme, 
                err.additional_information, 
                err.necessaryDocuments
             FROM serviceRequestTable sr
             JOIN usersTable u ON sr.user_id = u.user_id
             LEFT JOIN equipmentRentalRequests err ON sr.request_id = err.request_id
             LEFT JOIN usersTable approver ON sr.approved_by = approver.user_id
             WHERE sr.request_id = $1`, [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Service request not found' });
        }

        const sampleProcessingRequest = result.rows[0];

        if (typeof sampleProcessingRequest.necessarydocuments === 'string') {
        sampleProcessingRequest.necessarydocuments = sampleProcessingRequest.necessarydocuments
            .replace(/[{}"]/g, '')
            .split(',')
            .map(doc => doc.trim());
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

const getFacilityRentalRequestById = async (req, res) => {
    const { id } = req.params;

    // Validate the ID
    if (!id || isNaN(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid request ID' });
    }

    try {
        // SQL query to fetch service request along with facility details
        const result = await pool.query(
            `SELECT 
                sr.request_id, 
                sr.user_id, 
                sr.service_name, 
                sr.status, 
                sr.payment_option, 
                sr.start, 
                sr."end", 
                sr.rejection_reason,
                sr.request_code,
                sr.charge_slip,
                u.name AS user_name,
                u.institution AS user_institution,
                approver.name AS approver_name,
                frr.purpose_of_use,
                frr.project_title, 
                frr.project_budget_code, 
                frr.proofOfFunds, 
                frr.paymentConforme,
                frr.selected_facility, 
                frr.start_of_use, 
                frr.end_of_use, 
                frr.participant_count, 
                frr.additional_information, 
                frr.acknowledge_terms, 
                frr.necessaryDocuments,
                fac.facility_name
             FROM serviceRequestTable sr
             JOIN usersTable u ON sr.user_id = u.user_id
             LEFT JOIN usersTable approver ON sr.approved_by = approver.user_id
             LEFT JOIN facilityRentalRequests frr ON sr.request_id = frr.request_id
             LEFT JOIN facilitiesTable fac ON frr.selected_facility = fac.facility_id 
             WHERE sr.request_id = $1`, [id]
        );

        // If no results, send 404
        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Service request not found' });
        }

        // Return the result
        return res.status(200).json({
            status: 'success',
            serviceRequest: result.rows[0],
        });

    } catch (error) {
        // Log and return the error
        console.error('Error fetching service request by ID:', error);
        console.error('Actual DB error:', error.message);
        return res.status(500).json({ status: 'error', message: 'Server error while fetching service request' });
    }
};

const getSampleProcessingRequestById = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({ status: 'error', message: 'Invalid request ID' });
    }

    try {
        const result = await pool.query(
            `SELECT 
                sr.request_id, 
                sr.user_id, 
                sr.service_name, 
                sr.status, 
                sr.payment_option, 
                sr.start, 
                sr."end", 
                sr.rejection_reason,
                sr.request_code,
                sr.charge_slip,
                u.name AS user_name,
                u.institution AS user_institution,
                approver.name AS approver_name,
                spr.laboratory, 
                spr.type_of_analysis, 
                spr.sample_type, 
                spr.sample_description, 
                spr.sample_volume,
                spr.method_settings, 
                spr.sample_hazard_description, 
                spr.schedule_of_sample_submission,
                spr.project_title, 
                spr.project_budget_code, 
                spr.proofOfFunds, 
                spr.paymentConforme, 
                spr.additional_information, 
                spr.necessaryDocuments
            FROM serviceRequestTable sr
            JOIN usersTable u ON sr.user_id = u.user_id
            LEFT JOIN usersTable approver ON sr.approved_by = approver.user_id
            LEFT JOIN sampleProcessingRequests spr ON sr.request_id = spr.request_id
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

const rejectServiceRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const { rejectionReason } = req.body;
  
      // Check if the request exists in serviceRequestTable
      const result = await pool.query(
        `SELECT * FROM serviceRequestTable WHERE request_id = $1`,
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      // Update the status and rejection reason in the serviceRequestTable
      const updateResult = await pool.query(
        `UPDATE serviceRequestTable
         SET status = $1, rejection_reason = $2
         WHERE request_id = $3
         RETURNING *`,
        ['Rejected', rejectionReason, id]
      );
  
      // Return the updated request details
      return res.status(200).json({
        message: "Request rejected successfully",
        data: updateResult.rows[0],
      });
    } catch (error) {
      console.error("Error rejecting request:", error);
      return res.status(500).json({ message: "Error rejecting request" });
    }
};

const approveServiceRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { approverId } = req.body;

        // Check if the request exists in serviceRequestTable
        const result = await pool.query(
            `SELECT * FROM serviceRequestTable WHERE request_id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Request not found" });
        }

        // Check if the request is already approved or rejected
        const serviceRequest = result.rows[0];
        if (serviceRequest.status === "Approved" || serviceRequest.status === "Rejected") {
            return res.status(400).json({ message: "Request has already been processed" });
        }

        // Update the status to 'Approved' and set the approver's ID in the serviceRequestTable
        const updateResult = await pool.query(
            `UPDATE serviceRequestTable
             SET status = $1, approved_by = $2
             WHERE request_id = $3
             RETURNING *`,
            ['Approved', approverId, id]
        );

        // Return the updated request details
        return res.status(200).json({
            message: "Request approved successfully",
            data: updateResult.rows[0],
        });
    } catch (error) {
        console.error("Error approving request:", error);
        return res.status(500).json({ message: "Error approving request" });
    }
};

module.exports = {
	getServiceRequests,
    getServiceRequestsById,
	cancelServiceRequest,
	getTrainingRequestById,
	getEquipmentRentalRequestById,
	getFacilityRentalRequestById,
	getSampleProcessingRequestById,
    rejectServiceRequest,
    approveServiceRequest
};