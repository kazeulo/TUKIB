const pool = require('../backend');  // import the pool

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query the database to check for valid user credentials
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const role = user.role;

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
          role: role,
        },
        roleSpecificMessage:
          role === 'admin' ? 'Welcome, Admin!' : 'Welcome, Client!',
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error querying the database', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { handleLogin };
