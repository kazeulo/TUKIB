const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../backend');
const SECRET_KEY = process.env.SECRET_KEY;

const handleLogin = async (req, res) => {
	const { email, password } = req.body;

	console.log('Received login request:', email);

	try {
		const result = await pool.query(
			'SELECT * FROM usersTable WHERE email = $1',
			[email]
		);

		console.log('Database query result:', result.rows);

		if (result.rows.length > 0) {
			const user = result.rows[0];
			// Check if the user's status is active
			if (user.status !== 'active') {
				console.log(`User status is ${user.status}, login denied`);
				return res.status(403).json({
					success: false,
					message: 'Account is not active. Please contact support.',
				});
			}

			// Compare the entered password with the hashed one in the DB
			const isMatch = await bcrypt.compare(password, user.password);

			if (isMatch) {
				const token = jwt.sign(
					{ userId: user.user_id, email: user.email },
					SECRET_KEY,
					{ expiresIn: '1h' }
				);

				const insertTokenQuery =
					'INSERT INTO user_tokens (user_id, token, created_at) VALUES ($1, $2, $3)';
				await pool.query(insertTokenQuery, [user.user_id, token, new Date()]);

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
					token: token,
				});
			} else {
				console.log('Invalid password');
				res
					.status(401)
					.json({ success: false, message: 'Invalid credentials' });
			}
		} else {
			console.log('User not found');
			res.status(401).json({ success: false, message: 'Invalid credentials' });
		}
	} catch (error) {
		console.error('Error querying the database', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
};

module.exports = { handleLogin };
