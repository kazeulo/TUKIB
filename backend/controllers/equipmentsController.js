const pool = require('../backend');

// Get all equipment records with staff and lab name
const getEquipments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.equipment_id,
                e.equipment_name,
                e.brand,
                e.quantity,
                e.model,
                e.serial_number,
                e.staff_name,  -- No join with usersTable, use the staff_name directly
                l.laboratory_name,
                e.sticker_paper_printed
            FROM 
                equipmentsTable e
            INNER JOIN 
                laboratories l ON e.laboratory_id = l.laboratory_id
            ORDER BY 
                e.equipment_id
        `);

        const equipments = result.rows;

        if (equipments.length > 0) {
            res.json({ status: 'success', equipments });
        } else {
            res.status(404).json({ message: 'No equipment found' });
        }
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// add equipment
const addEquipment = async (req, res) => {
    const { 
        equipment_name, 
        brand, 
        model, 
        serial_number, 
        quantity, 
        staff_name, 
        laboratory_id, 
        sticker_paper_printed, 
        remarks 
    } = req.body;

    if (!equipment_name || !quantity || !staff_name || !laboratory_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const labResult = await pool.query(`
            SELECT laboratory_id 
            FROM laboratories 
            WHERE laboratory_id = $1 LIMIT 1
        `, [laboratory_id]);

        if (labResult.rows.length === 0) {
            return res.status(400).json({ error: 'Laboratory not found' });
        }

        const insertResult = await pool.query(`
            INSERT INTO equipmentsTable 
            (equipment_name, brand, model, serial_number, quantity, staff_name, laboratory_id, sticker_paper_printed, remarks) 
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING equipment_id
        `, [
            equipment_name, 
            brand, 
            model, 
            serial_number, 
            quantity, 
            staff_name,
            laboratory_id, 
            sticker_paper_printed, 
            remarks
        ]);

        const newEquipment = insertResult.rows[0];

        res.status(201).json({
            status: 'success',
            message: 'Equipment added successfully',
            equipment_id: newEquipment.equipment_id
        });

    } catch (error) {
        console.error('Error adding equipment:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM equipmentsTable WHERE equipment_id = $1 RETURNING *', [id]);
        
        if (result.rows.length > 0) {
            res.json({ status: 'success', message: 'Equipment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Equipment not found' });
        }
    } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get equipment by laboratory name
// const getEquipmentByLab = async (req, res) => {
//     const { laboratory_id } = req.params; 

//     try {
//         const result = await pool.query(`
//             SELECT 
//                 e.equipment_id,
//                 e.equipment_name,
//                 e.brand,
//                 e.quantity,
//                 e.model,
//                 e.serial_number,
//                 e.staff_name,
//                 l.laboratory_name,
//                 e.sticker_paper_printed
//             FROM 
//                 equipmentsTable e
//             INNER JOIN 
//                 laboratories l ON e.laboratory_id = l.laboratory_id
//             WHERE 
//                 l.laboratory_id = $1
//             ORDER BY 
//                 e.equipment_id
//         `, [laboratory_id]);

//         const equipments = result.rows;

//         if (equipments.length > 0) {
//             res.json({ status: 'success', equipments });
//         } else {
//             res.status(404).json({ message: 'No equipment found for this laboratory' });
//         }
//     } catch (error) {
//         console.error('Error fetching equipment by laboratory:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

const getEquipmentByLab = async (req, res) => {
  const { laboratory_id } = req.params;

  // Validate and parse laboratory_id
  const labIdInt = parseInt(laboratory_id, 10);
  if (isNaN(labIdInt)) {
    return res.status(400).json({ status: 'error', message: 'Invalid laboratory ID' });
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        e.equipment_id,
        e.equipment_name,
        e.brand,
        e.quantity,
        e.model,
        e.serial_number,
        e.staff_name,
        l.laboratory_name,
        e.sticker_paper_printed
      FROM 
        equipmentsTable e
      INNER JOIN 
        laboratories l ON e.laboratory_id = l.laboratory_id
      WHERE 
        l.laboratory_id = $1
      ORDER BY 
        e.equipment_id
      `,
      [labIdInt]
    );

    const equipments = result.rows;

    if (equipments.length > 0) {
      res.json({ status: 'success', equipments });
    } else {
      res.status(404).json({ status: 'error', message: 'No equipment found for this laboratory' });
    }
  } catch (error) {
    console.error('Error fetching equipment by laboratory:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};


module.exports = { 
    getEquipments, 
    addEquipment, 
    deleteEquipment,
    getEquipmentByLab
};