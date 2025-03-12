const jwt = require('jsonwebtoken');
const pool = require('../backend'); 
const SECRET_KEY = process.env.SECRET_KEY; 

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    const result = await pool.query(
      'SELECT * FROM usersTable WHERE email = $1',
      [email]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Compare the provided plain password with the stored password in the database
      if (password === user.password) {
        // Generate a JWT token
        const token = jwt.sign(
          { userId: user.user_id, email: user.email },
          SECRET_KEY,
          { expiresIn: '1h' } // Token expiration in 1 hour
        );

        // Optionally, store the token in a table to track user sessions
        const insertTokenQuery = 'INSERT INTO user_tokens (user_id, token, created_at) VALUES ($1, $2, $3)';
        await pool.query(insertTokenQuery, [user.user_id, token, new Date()]);

        // Send the response back with the user data and token
        res.status(200).json({
          success: true,
          message: 'Login successful',
          user: {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            institution: user.institution,
            contact: user.contact_number,
            role: user.role,
          },
          roleSpecificMessage:
            user.role === 'Admin' ? 'Welcome, Admin!' : 'Welcome, Client!',
          token: token, // Send the JWT token
        });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error querying the database', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { handleLogin };
