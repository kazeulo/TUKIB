const pool = require('../backend');

// Get all services and rates
const getAllServices = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM rates_and_services ORDER BY service_type, laboratory, service_name');
        const services = result.rows;

        if (services.length > 0) {
            res.json({ status: 'success', services });
        } else {
            res.status(404).json({ message: 'No services found' });
        }
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get services by type (Sample Processing or Use of Equipment)
const getServicesByType = async (req, res) => {
    const serviceType = req.params.serviceType;
    
    try {
        const result = await pool.query(
            'SELECT * FROM rates_and_services WHERE service_type = $1 ORDER BY laboratory, service_name', 
            [serviceType]
        );
        const services = result.rows;

        if (services.length > 0) {
            res.json({ status: 'success', services });
        } else {
            res.status(404).json({ message: `No ${serviceType} services found` });
        }
    } catch (error) {
        console.error(`Error fetching ${serviceType} services:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get services by laboratory
const getServicesByLab = async (req, res) => {
    const laboratory = req.params.laboratory;
    
    try {
        const result = await pool.query(
            'SELECT * FROM rates_and_services WHERE laboratory = $1 ORDER BY service_type, service_name', 
            [laboratory]
        );
        const services = result.rows;

        if (services.length > 0) {
            res.json({ status: 'success', services });
        } else {
            res.status(404).json({ message: `No services found for ${laboratory}` });
        }
    } catch (error) {
        console.error(`Error fetching services for ${laboratory}:`, error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get service details by ID
const getServiceById = async (req, res) => {
    const serviceId = req.params.serviceId;
    
    try {
        const result = await pool.query('SELECT * FROM rates_and_services WHERE service_id = $1', [serviceId]);

        if (result.rows.length > 0) {
            res.json({ status: 'success', service: result.rows[0] });
        } else {
            res.status(404).json({ status: 'error', message: 'Service not found' });
        }
    } catch (error) {
        console.error('Error fetching service details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new service
const createService = async (req, res) => {
    const { service_type, laboratory, service_name, rate_fee, inclusions } = req.body;

    try {
        const query = `
            INSERT INTO rates_and_services (service_type, laboratory, service_name, rate_fee, inclusions)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const values = [service_type, laboratory, service_name, rate_fee, inclusions];

        const result = await pool.query(query, values);
        
        res.status(201).json({ 
            status: 'success', 
            message: 'Service added successfully',
            service: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a service
const updateService = async (req, res) => {
    const serviceId = req.params.serviceId;
    const { service_type, laboratory, service_name, rate_fee, inclusions } = req.body;

    try {
        const query = `
            UPDATE rates_and_services
            SET service_type = $1,
                laboratory = $2,
                service_name = $3,
                rate_fee = $4,
                inclusions = $5
            WHERE service_id = $6
            RETURNING *
        `;
        const values = [service_type, laboratory, service_name, rate_fee, inclusions, serviceId];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.json({
                status: 'success',
                message: 'Service updated successfully',
                service: result.rows[0]
            });
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a service
const deleteService = async (req, res) => {
    const serviceId = req.params.serviceId;

    try {
        const result = await pool.query(
            'DELETE FROM rates_and_services WHERE service_id = $1 RETURNING *',
            [serviceId]
        );

        if (result.rows.length > 0) {
            res.json({
                status: 'success',
                message: 'Service deleted successfully',
                service: result.rows[0]
            });
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all unique laboratories
const getAllLaboratories = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT DISTINCT laboratory FROM rates_and_services ORDER BY laboratory'
        );
        const laboratories = result.rows.map(row => row.laboratory);

        res.json({ status: 'success', laboratories });
    } catch (error) {
        console.error('Error fetching laboratories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllServices,
    getServicesByType,
    getServicesByLab,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getAllLaboratories
};