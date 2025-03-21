const pool = require('../backend'); // PostgreSQL connection pool

// Fetch all users (existing function)
const getUsers = async (req, res) => {
	try {
		const result = await pool.query('SELECT * FROM usersTable');
		const users = result.rows;

		if (users.length > 0) {
			res.json({ status: 'success', users });
		} else {
			res.status(404).json({ message: 'No users found' });
		}
	} catch (error) {
		console.error('Error fetching users:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Fetch a user by user_id 
const getUserById = async (req, res) => {
	try {
	  const { userId } = req.params;
	  const result = await pool.query('SELECT * FROM usersTable WHERE user_id = $1', [userId]);
	  const user = result.rows[0];
	  
	  if (!user) {
		return res.status(404).json({ status: 'error', message: 'User not found' });
	  }
  
	  res.json({ status: 'success', user });
	} catch (error) {
	  console.error('Error fetching user:', error);
	  res.status(500).json({ error: 'Internal server error' });
	}
};

const createUser = async (req, res) => {
	try {
		const { name, email, role, password, institution, contact_number } =
			req.body; 

		// Validate required fields
		if (!name || !email || !password) {
			return res.status(400).json({
				status: 'error',
				message: 'Name, email, and password are required',
			});
		}

		const result = await pool.query(
			'INSERT INTO usersTable (name, email, role, password, institution, contact_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
			[name, email, role, password, institution, contact_number] // Include contact_number in the query
		);

		const newUser = result.rows[0]; // Get the newly created user

		// Return success response with the new user
		res.json({ status: 'success', user: newUser });
	} catch (error) {
		console.error('Error adding user:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// Delete a user by ID (new function)
const deleteUser = async (req, res) => {
	try {
		const { userId } = req.params; // Get the user ID from the request parameters

		// Delete the user from the database
		const result = await pool.query(
			'DELETE FROM usersTable WHERE user_id = $1 RETURNING *',
			[userId]
		);

		if (result.rowCount === 0) {
			return res
				.status(404)
				.json({ status: 'error', message: 'User not found' });
		}

		// Return success response with the deleted user
		res.json({ status: 'success', message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

module.exports = { getUsers, getUserById, createUser, deleteUser };
