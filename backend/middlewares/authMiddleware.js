const jwt = require('jsonwebtoken');
const pool = require('../backend'); 
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {

  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(403).json({ success: false, message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const { rows } = await pool.query(
      'SELECT * FROM user_tokens WHERE user_id = $1 AND token = $2',
      [decoded.userId, token]
    );

    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    req.user = decoded;

    next(); 
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    return res.status(403).json({ success: false, message: 'Invalid token', error: error.message });
  }
};

module.exports = { verifyToken };
