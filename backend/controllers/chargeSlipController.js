const pool = require('../backend');

const insertChargeSlip = async (req, res) => {
    const {
        user_name,
        request_id,
        request_code,
        payment_option,
        project_title,
        project_budget_code,
        service_name,
        trainingtitle,
        trainingdate,
        participantcount,
        equipment_name,
        facility_name,
        resources,
        type_of_analysis,
        volume,
        rate,
        total_hours,
        institution,
        clientCategory
    } = req.body;

    const client = await pool.connect(); 
    try {
        await client.query('BEGIN');

        // Insert charge slip details
        const query = `
            INSERT INTO chargeslips (
                user_name, request_id, request_code, payment_option, project_title,
                project_budget_code, service_name, trainingtitle, trainingdate,
                participantcount, equipment_name, facility_name, resources,
                type_of_analysis, volume, rate, total_hours,
                institution, clientCategory
            ) VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9,
                $10, $11, $12, $13,
                $14, $15, $16, $17,
                $18, $19
            )
        `;
        const values = [
            user_name, request_id, request_code, payment_option, project_title,
            project_budget_code, service_name, trainingtitle, trainingdate,
            participantcount, equipment_name, facility_name, resources,
            type_of_analysis, volume, rate, total_hours,
            institution, clientCategory
        ];

        await client.query(query, values);

        // Update the charge_slip flag in serviceRequestTable
        const updateQuery = `
            UPDATE serviceRequestTable
            SET charge_slip = TRUE
            WHERE request_id = $1
        `;
        await client.query(updateQuery, [request_id]);

        await client.query('COMMIT');

        res.status(201).json({ status: 'success', message: 'Charge slip submitted successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error inserting charge slip:', error);
        res.status(500).json({ status: 'error', error: 'Internal server error' });
    } finally {
        client.release();
    }
};

const getChargeSlipByRequestId = async (req, res) => {
    const { request_id } = req.params;

    try {
        const query = `
            SELECT * FROM chargeslips WHERE request_id = $1
        `;
        const result = await pool.query(query, [request_id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No charge slip found for the given request ID' });
        }

        res.status(200).json({ status: 'success', data: result.rows });
    } catch (error) {
        console.error('Error fetching charge slip:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};

module.exports = { insertChargeSlip, getChargeSlipByRequestId };
