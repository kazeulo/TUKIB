const db = require('../backend'); // Database connection
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(
	'99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com'
);

const googleLoginController = async (req, res) => {
	const { token } = req.body;

	try {
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience:
				'99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com',
		});

		const payload = ticket.getPayload();
		const { name, email, sub: google_id, picture: profile_pic_url } = payload;

		const query = 'SELECT * FROM userstable WHERE email = $1 LIMIT 1';
		const result = await db.query(query, [email]);

		if (result.rows.length === 0) {
			return res.status(401).json({
				success: false,
				message: 'Email not registered. Please contact admin.',
			});
		}

		const user = result.rows[0];

		// Check status
		if (user.status !== 'active') {
			console.log(`User status is ${user.status}, login denied`);
			return res.status(403).json({
				success: false,
				message: 'Account is not active. Please contact support.',
			});
		}

		const now = new Date();
		const lastAttempt = user.last_failed_attempt
			? new Date(user.last_failed_attempt)
			: null;
		const minutesSinceLastFail = lastAttempt
			? (now - lastAttempt) / 60000
			: null;

		// Lockout logic
		if (user.failed_attempts >= 5 && minutesSinceLastFail < 15) {
			return res.status(429).json({
				success: false,
				message: 'Too many failed attempts. Please try again in 15 minutes.',
			});
		}

		// Reset failed_attempts on successful login
		await db.query(
			`UPDATE userstable SET failed_attempts = 0, last_failed_attempt = NULL WHERE user_id = $1`,
			[user.user_id]
		);

		console.log('Google Account Details:');
		console.log(`Name: ${name}`);
		console.log(`Email: ${email}`);
		console.log(`Google ID: ${google_id}`);
		console.log(`Profile Picture URL: ${profile_pic_url}`);

		res.json({
			success: true,
			user: {
				id: user.user_id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error('Google login error:', error);

		// Handle failed attempt tracking
		try {
			const result = await db.query(
				`SELECT * FROM userstable WHERE email = $1`,
				[req.body.email]
			);
			if (result.rows.length > 0) {
				const user = result.rows[0];
				const newAttempts = user.failed_attempts + 1;
				const newStatus = newAttempts >= 15 ? 'locked' : user.status;

				await db.query(
					`UPDATE userstable SET failed_attempts = $1, last_failed_attempt = $2, status = $3 WHERE user_id = $4`,
					[newAttempts, new Date(), newStatus, user.user_id]
				);
			}
		} catch (logError) {
			console.error('Error updating failed attempts:', logError);
		}

		res.status(500).json({
			success: false,
			message: 'Error during Google login. Please try again.',
		});
	}
};

module.exports = { googleLoginController };
