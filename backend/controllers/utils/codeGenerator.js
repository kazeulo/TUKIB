const pool = require('../../backend');

const generateRequestCode = async (serviceType) => {
    const prefix = 'RRC';
    const yearSuffix = new Date().getFullYear().toString().slice(-2); 
    
    const typeMap = {
        'Sample Processing': 'SP',
        'Training': 'TR',
        'Use of Equipment': 'EQ',
        'Use of Facility': 'FAC'
    };

    const typeCode = typeMap[serviceType];

    if (!typeCode) throw new Error('Invalid service type');

    const baseCode = `${prefix}-${yearSuffix}-${typeCode}`;

    const query = `
        SELECT request_code FROM serviceRequestTable
        WHERE request_code LIKE $1
        ORDER BY request_code DESC
        LIMIT 1
    `;

    const { rows } = await pool.query(query, [`${baseCode}%`]);

    let nextNumber = 1;

    if (rows.length > 0) {
        const lastCode = rows[0].request_code;
        const lastNum = parseInt(lastCode.slice(-3));
        nextNumber = lastNum + 1;
    }

    const formattedNumber = nextNumber.toString().padStart(3, '0');

    return `${baseCode}${formattedNumber}`;
};

module.exports = generateRequestCode;