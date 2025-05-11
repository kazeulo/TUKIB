const pool = require('../backend');
const bcrypt = require('bcrypt');

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
		const result = await pool.query(
			'SELECT * FROM usersTable WHERE user_id = $1',
			[userId]
		);
		const user = result.rows[0];

		if (!user) {
			return res
				.status(404)
				.json({ status: 'error', message: 'User not found' });
		}

		res.json({ status: 'success', user });
	} catch (error) {
		console.error('Error fetching user:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const signupUser = async (req, res) => {
	try {
		const {
			first_name,
			last_name,
			email,
			password,
			institution,
			contact_number,
			name,
		} = req.body;

		// Validate required fields
		if (!first_name || !last_name || !email || !password) {
			return res.status(400).json({
				status: 'error',
				message: 'First name, last name, email, and password are required',
			});
		}

		// Hash the password before storing
		const hashedPassword = await bcrypt.hash(password, 10);

		// Combine first_name and last_name for the 'name' field
		const fullName = `${first_name} ${last_name}`;
		const role = 'Client';

		// Insert into database
		const result = await pool.query(
			`INSERT INTO usersTable (name, first_name, last_name, email, password, institution, contact_number, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
			[
				fullName,
				first_name,
				last_name,
				email,
				hashedPassword, // Use hashed password here
				institution,
				contact_number,
				role,
				req.body.status || 'pending',
			]
		);

		const newUser = result.rows[0];
		res.json({ status: 'success', user: newUser });
	} catch (error) {
		console.error('Error signing up user:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const createUser = async (req, res) => {
	try {
		const {
			name,
			email,
			role,
			password,
			institution,
			contact_number,
			laboratory_id,
		} = req.body;

		if (!name || !email || !password || !role) {
			return res.status(400).json({
				status: 'error',
				message: 'Name, email, password, and role are required',
			});
		}

		if (role === 'University Researcher' && !laboratory_id) {
			return res.status(400).json({
				status: 'error',
				message: 'Laboratory is required for University Researchers',
			});
		}

		if (laboratory_id) {
			const labCheck = await pool.query(
				'SELECT * FROM laboratories WHERE laboratory_id = $1',
				[laboratory_id]
			);
			if (labCheck.rows.length === 0) {
				return res.status(400).json({
					status: 'error',
					message: 'Invalid laboratory_id provided',
				});
			}
		}

		// Hash the password before saving
		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await pool.query(
			`INSERT INTO usersTable (
				name, email, role, password, laboratory_id, institution, contact_number, status
			) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
			[
				name,
				email,
				role,
				hashedPassword,
				laboratory_id,
				institution,
				contact_number,
				req.body.status || 'pending',
			]
		);

		const newUser = result.rows[0];

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

// Update a user's profile
const editUser = async (req, res) => {
	try {
		const { userId } = req.params;
		const { name, email, contact_number, institution } = req.body;

		// Basic validation
		if (!name || !email) {
			return res.status(400).json({
				status: 'error',
				message: 'Name and email are required.',
			});
		}

		// Check if the user exists
		const userCheck = await pool.query(
			'SELECT * FROM usersTable WHERE user_id = $1',
			[userId]
		);
		if (userCheck.rows.length === 0) {
			return res.status(404).json({
				status: 'error',
				message: 'User not found.',
			});
		}

		// Update user info
		const result = await pool.query(
			`UPDATE usersTable 
			SET name = $1, email = $2, contact_number = $3, institution = $4
			WHERE user_id = $5
			RETURNING user_id, name, email, contact_number, institution, role, status`,
			[name, email, contact_number, institution, userId]
		);

		res.json({
			status: 'success',
			message: 'User profile updated successfully.',
			user: result.rows[0],
		});
	} catch (error) {
		console.error('Error updating user:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

const updateUserStatus = async (req, res) => {
	try {
		const { userId } = req.params; // Get the userId from the URL
		const { status } = req.body; // Get the new status from the request body

		// Validate the status (optional)
		if (!['pending', 'active', 'blocked', 'locked'].includes(status)) {
			return res.status(400).json({
				status: 'error',
				message: 'Invalid status value',
			});
		}

		// Update the user status in the database
		const result = await pool.query(
			`UPDATE usersTable SET status = $1 WHERE user_id = $2 RETURNING user_id, status`,
			[status, userId]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({
				status: 'error',
				message: 'User not found',
			});
		}

		// Return the updated user
		res.json({
			status: 'success',
			message: 'User status updated successfully',
			user: result.rows[0],
		});
	} catch (error) {
		console.error('Error updating user status:', error);
		res.status(500).json({ error: 'Internal server error' });
	}
};

module.exports = {
	getUsers,
	getUserById,
	signupUser,
	createUser,
	deleteUser,
	editUser,
	updateUserStatus,
};
