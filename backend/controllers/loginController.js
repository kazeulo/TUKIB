const pool = require('../db');  // import the pool

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the database to check for valid user credentials
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const role = user.role;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          phone: user.phone,
          role: role,
          profile_pic: user.profile_pic,
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
