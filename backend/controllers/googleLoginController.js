const db = require('../backend'); // Database connection
const { OAuth2Client } = require('google-auth-library');

// Initialize the OAuth2 Client with the Google Client ID
const client = new OAuth2Client(
	'99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com'
);

const googleLoginController = async (req, res) => {
	const { token } = req.body; // Frontend should send the token

	try {
		// Verify the Google token
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience:
				'99014928817-a55l0uqhc29c2jjn0ka4v025av2cfk9c.apps.googleusercontent.com', // Client ID
		});

		// Extract the payload from the ticket
		const payload = ticket.getPayload();
		const { name, email, sub: google_id, picture: profile_pic_url } = payload;

		// Check if the user with the given email exists in the database
		const query = `
      SELECT * FROM "userstable" WHERE email = $1 LIMIT 1;
    `;
		const values = [email];
		const result = await db.query(query, values);

		// If the user does not exist in the database
		if (result.rows.length === 0) {
			return res.status(401).json({
				success: false,
				message: 'Email not registered. Please contact admin.',
			});
		}

		// If the user exists, check their status
		const user = result.rows[0];

		if (user.status !== 'active') {
			console.log(`User status is ${user.status}, login denied`);
			return res.status(403).json({
				success: false,
				message: 'Account is not active. Please contact support.',
			});
		}

		// Log Google account details for debugging
		console.log('Google Account Details:');
		console.log(`Name: ${name}`);
		console.log(`Email: ${email}`);
		console.log(`Google ID: ${google_id}`);
		console.log(`Profile Picture URL: ${profile_pic_url}`);

		// Return the user data and their role for login
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
		res.status(500).json({
			success: false,
			message: 'Error during Google login. Please try again.',
		});
	}
};

module.exports = { googleLoginController };
