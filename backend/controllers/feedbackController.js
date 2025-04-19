const pool = require('../backend'); 

const getFeedback = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM feedback_table');
        const feedback = result.rows;

        if (feedback.length > 0) {
            res.json({ status: 'success', feedback });
        } else {
            res.status(404).json({ message: 'No feedback found' });
        }
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Store a new feedback
const insertFeedback = async (req, res) => {
    const { 
        age, 
        gender, 
        role, 
        servicetype, 
        satisfaction, 
        staffResponsiveness, 
        equipmentCondition, 
        facilityCleanliness, 
        serviceEfficiency, 
        waitingTime, 
        systemHelpfulness, 
        systemPreference, 
        additionalComments 
    } = req.body;

    try {
        const query = `
            INSERT INTO feedback_table (
                age, gender, role, servicetype, satisfaction, 
                staffResponsiveness, equipmentCondition, facilityCleanliness, 
                serviceEfficiency, waitingTime, systemHelpfulness, 
                systemPreference, additionalComments
            ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `;
        
        const values = [
            age, gender, role, servicetype, satisfaction,
            staffResponsiveness, equipmentCondition, facilityCleanliness, 
            serviceEfficiency, waitingTime, systemHelpfulness, 
            systemPreference, additionalComments
        ];

        await pool.query(query, values);

        res.status(201).json({ status: 'success', message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error storing feedback:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getFeedback, insertFeedback };
