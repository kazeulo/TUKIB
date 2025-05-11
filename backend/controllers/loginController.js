const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../backend');
const SECRET_KEY = process.env.SECRET_KEY;

const handleLogin = async (req, res) => {
	const { email, password } = req.body;

	try {
		const result = await pool.query(
			'SELECT * FROM usersTable WHERE email = $1',
			[email]
		);

		if (result.rows.length === 0) {
			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials' });
		}

		const user = result.rows[0];

		// Block if account is not active
		if (['pending', 'locked', 'blocked'].includes(user.status)) {
			return res
				.status(403)
				.json({ success: false, message: `Account is ${user.status}` });
		}

		// Check for cooldown
		if (user.failed_attempts >= 5 && user.failed_attempts < 15) {
			const lastAttempt = new Date(user.last_failed_attempt);
			const now = new Date();
			const diffInMinutes = (now - lastAttempt) / 60000;

			if (diffInMinutes < 15) {
				return res.status(429).json({
					success: false,
					message: `Too many failed attempts. Please wait ${Math.ceil(
						15 - diffInMinutes
					)} minutes.`,
				});
			}
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);

		if (isMatch) {
			// Reset failed attempts on success
			await pool.query(
				'UPDATE usersTable SET failed_attempts = 0, last_failed_attempt = NULL WHERE user_id = $1',
				[user.user_id]
			);

			const token = jwt.sign(
				{ userId: user.user_id, email: user.email },
				SECRET_KEY,
				{
					expiresIn: '1h',
				}
			);

			await pool.query(
				'INSERT INTO user_tokens (user_id, token, created_at) VALUES ($1, $2, $3)',
				[user.user_id, token, new Date()]
			);

			return res.status(200).json({
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
			// Increment failed attempts
			const newFailedAttempts = user.failed_attempts + 1;

			if (newFailedAttempts >= 15) {
				await pool.query(
					'UPDATE usersTable SET status = $1, failed_attempts = $2, last_failed_attempt = $3 WHERE user_id = $4',
					['locked', newFailedAttempts, new Date(), user.user_id]
				);
				return res.status(403).json({
					success: false,
					message: 'Account locked due to too many failed attempts',
				});
			}

			await pool.query(
				'UPDATE usersTable SET failed_attempts = $1, last_failed_attempt = $2 WHERE user_id = $3',
				[newFailedAttempts, new Date(), user.user_id]
			);

			return res
				.status(401)
				.json({ success: false, message: 'Invalid credentials' });
		}
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).json({ success: false, message: 'Server error' });
	}
};

module.exports = { handleLogin };
