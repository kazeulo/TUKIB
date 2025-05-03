const { request } = require('express');
const pool = require('../backend');

// Get all facilities
const getAllFacilities = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT facility_id, facility_name, capacity, resources FROM facilitiesTable'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ error: 'Failed to fetch facilities' });
  }
};

// Create a new facility
const createFacility = async (req, res) => {
  const { facility_name, capacity, resources = [] } = req.body;

  if (!facility_name || typeof capacity !== 'number') {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO facilitiesTable (facility_name, capacity, resources)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [facility_name, capacity, resources]
    );

    res.status(201).json({
      message: 'Facility created successfully!',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error creating facility:', err);
    res.status(500).json({ error: 'Failed to create facility' });
  }
};

const updateFacility = async (req, res) => {
  const { id } = req.params;
  const { facility_name, capacity, available, resources } = req.body;

  try {
    const result = await pool.query(
      `UPDATE facilities
       SET facility_name = $1,
           capacity = $2,
           available = $3,
           resources = $4
       WHERE facility_id = $5
       RETURNING *`,
      [facility_name, capacity, available, resources, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.json({
      message: 'Facility updated successfully',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating facility:', err);
    res.status(500).json({ error: 'Failed to update facility' });
  }
};

const deleteFacility = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM facilitiesTable WHERE facility_id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Facility not found' });
    }

    res.json({ message: 'Facility deleted successfully' });
  } catch (err) {
    console.error('Error deleting facility:', err);
    res.status(500).json({ error: 'Failed to delete facility' });
  }
};

const getFacilityWithSchedules = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        f.facility_id,
        f.facility_name,
        f.capacity,
        f.resources,
        fr.purpose_of_use,
        fr.start_of_use,
        fr.end_of_use,
        sr.request_id,
        sr.request_code,
        sr.status
      FROM facilitiesTable f
      LEFT JOIN facilityRentalRequests fr ON f.facility_id = fr.selected_facility
      LEFT JOIN serviceRequestTable sr ON sr.request_id = fr.request_id
      ORDER BY f.facility_name, fr.start_of_use
    `);

    const grouped = {};

    result.rows.forEach(row => {
      const { facility_id, facility_name, capacity, resources, request_id, request_code } = row;

      if (!grouped[facility_id]) {
        grouped[facility_id] = {
          facility_id,
          request_id,
          facility_name,
          capacity,
          resources,
          request_code,
          schedules: [],
        };
      }

      if (row.start_of_use && row.status !== 'Cancelled') {
        grouped[facility_id].schedules.push({
          purpose_of_use: row.purpose_of_use,
          start: row.start_of_use,
          end: row.end_of_use,
          status: row.status,
          request_id: request_id,
          request_code: request_code
        });
      }
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error('Error getting facilities with schedules:', err);
    res.status(500).json({ error: 'Failed to fetch facilities and schedules' });
  }
};

module.exports = {
  getAllFacilities,
  createFacility,
  updateFacility,
  deleteFacility,
  getFacilityWithSchedules,
};