const pool = require('../backend');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

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
		// Extract fields from request body
		const {
			first_name,
			last_name,
			email,
			password,
			institution,
			contact_number,
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
		const role = 'Client'; // Default role is Client, adjust if needed
		const status = req.body.status || 'pending'; // Default status if not provided

		// Log to check the request body data
		console.log('Request body:', req.body);

		// Insert into database
		const result = await pool.query(
			`INSERT INTO usersTable (name, first_name, last_name, email, password, institution, contact_number, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
			[
				fullName,
				first_name,
				last_name,
				email,
				hashedPassword, // Use hashed password here
				institution,
				contact_number,
				role,
				status, // Ensure status is passed correctly
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

// Setup transporter for Gmail using App Password (2FA enabled)
const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'rainermayagma9@gmail.com',
		pass: 'arhsnmkifylhlimt',
	},
	tls: {
		rejectUnauthorized: false, // Allow connection even if certificates are problematic
	},
});

//  for debugging
// transporter.verify((err, success) => {
// 	if (err) {
// 		console.error('Connection failed:', err);
// 	} else {
// 		console.log('Server is ready to send emails');
// 	}
// });

// Send activation email function
const sendActivationEmail = async (email, name) => {
	const mailOptions = {
		from: '"Mailer" <rainermayagma9@gmail.com>',
		to: email,
		subject: 'Account Activated',
		text: `Hi ${name},\n\nYour account has been activated. You can now log in.\n\nThanks,\nYour App Team`,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('Activation email sent');
	} catch (error) {
		console.error('Failed to send activation email:', error);
	}
};

const updateUserStatus = async (req, res) => {
	try {
		const { userId } = req.params;
		const { status } = req.body;

		if (!['pending', 'active', 'blocked', 'locked'].includes(status)) {
			return res.status(400).json({
				status: 'error',
				message: 'Invalid status value',
			});
		}

		let query, values;

		if (status === 'active') {
			query = `
				UPDATE usersTable 
				SET status = $1, failed_attempts = 0, last_failed_attempt = NULL 
				WHERE user_id = $2 
				RETURNING user_id, status, failed_attempts, last_failed_attempt
			`;
			values = [status, userId];
		} else {
			query = `
				UPDATE usersTable 
				SET status = $1 
				WHERE user_id = $2 
				RETURNING user_id, status
			`;
			values = [status, userId];
		}

		const result = await pool.query(query, values);

		if (result.rowCount === 0) {
			return res.status(404).json({
				status: 'error',
				message: 'User not found',
			});
		}

		// Send activation email only if status is set to 'active'
		if (status === 'active') {
			const userInfo = await pool.query(
				'SELECT email, name FROM usersTable WHERE user_id = $1',
				[userId]
			);

			if (userInfo.rowCount > 0) {
				const { email, name } = userInfo.rows[0];
				if (email && name) {
					try {
						await sendActivationEmail(email, name);
					} catch (emailErr) {
						console.warn('Failed to send activation email:', emailErr.message);
					}
				}
			}
		}

		res.json({
			status: 'success',
			message: 'User status updated successfully',
			user: result.rows[0],
		});
	} catch (error) {
		console.error('Error updating user status:', error.message, error.stack);
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
